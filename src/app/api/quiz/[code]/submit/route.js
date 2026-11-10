import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { hashToken } from '@/lib/security/tokens';
import { evaluateQuizSubmission } from '@/lib/scoring/evaluator';

export async function POST(request, { params }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Koneksi Supabase belum dikonfigurasi.' },
        { status: 503 }
      );
    }

    const { code } = params;
    const roomCode = (code || '').trim().toUpperCase();

    const authHeader = request.headers.get('authorization') || '';
    const tokenFromHeader = authHeader.replace(/^Bearer\s+/i, '').trim();
    const tokenFromUrl = request.nextUrl.searchParams.get('token') || '';

    const body = await request.json();
    const { token: tokenFromBody, answers = {} } = body;

    const token = tokenFromHeader || tokenFromUrl || tokenFromBody;
    if (!token) {
      return NextResponse.json(
        { error: 'Token autentikasi peserta diperlukan.' },
        { status: 401 }
      );
    }

    const supabase = getAdminSupabase();
    const hashedToken = hashToken(token);

    // Fetch room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, room_code, status, configuration')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room tidak ditemukan.' }, { status: 404 });
    }

    // Authenticate participant
    const { data: participant, error: pError } = await supabase
      .from('room_participants')
      .select('id, nickname, status, assigned_question_ids, answers, score, accuracy, started_at, expires_at, finished_at')
      .eq('room_id', room.id)
      .eq('participant_token_hash', hashedToken)
      .maybeSingle();

    if (pError || !participant) {
      return NextResponse.json(
        { error: 'Peserta tidak ditemukan atau token tidak valid.' },
        { status: 403 }
      );
    }

    // Prevent double submission
    if (participant.status === 'COMPLETED') {
      const evaluation = evaluateQuizSubmission({
        assignedQuestionIds: participant.assigned_question_ids || [],
        userAnswers: participant.answers || {},
        negativeMarking: Boolean(room.configuration?.negativeMarking),
        startedAt: participant.started_at,
        finishedAt: participant.finished_at,
      });

      return NextResponse.json({
        success: true,
        message: 'Jawaban sudah pernah dikirimkan sebelumnya.',
        participantId: participant.id,
        nickname: participant.nickname,
        result: evaluation,
      });
    }

    // Server-authoritative timer validation (allow 5-second network transmission grace)
    const now = new Date();
    const networkGraceMs = 5000;
    const expirationThresholdMs = new Date(participant.expires_at).getTime() + networkGraceMs;

    const isExpired = now.getTime() > expirationThresholdMs;
    const finalAnswers = typeof answers === 'object' && answers !== null ? answers : {};

    // Evaluate on server
    const evaluation = evaluateQuizSubmission({
      assignedQuestionIds: participant.assigned_question_ids || [],
      userAnswers: finalAnswers,
      negativeMarking: Boolean(room.configuration?.negativeMarking),
      startedAt: participant.started_at,
      finishedAt: now.toISOString(),
    });

    // Update participant record
    const { error: updateError } = await supabase
      .from('room_participants')
      .update({
        status: 'COMPLETED',
        answers: finalAnswers,
        score: evaluation.totalScore,
        correct_count: evaluation.correctCount,
        incorrect_count: evaluation.incorrectCount,
        unanswered_count: evaluation.unansweredCount,
        accuracy: evaluation.accuracyPercentage,
        finished_at: now.toISOString(),
      })
      .eq('id', participant.id);

    if (updateError) {
      console.error('Failed to update participant completion:', updateError);
      return NextResponse.json(
        { error: 'Gagal mencatat penyelesaian kuis di database.' },
        { status: 500 }
      );
    }

    // Check if ALL participants in this room are now completed
    const { data: allParticipants } = await supabase
      .from('room_participants')
      .select('id, status')
      .eq('room_id', room.id);

    const allFinished =
      Array.isArray(allParticipants) &&
      allParticipants.length > 0 &&
      allParticipants.every((p) => p.status === 'COMPLETED' || p.id === participant.id);

    if (allFinished) {
      await supabase
        .from('rooms')
        .update({
          status: 'COMPLETED',
          finished_at: now.toISOString(),
        })
        .eq('id', room.id);
    }

    return NextResponse.json({
      success: true,
      isExpired,
      participantId: participant.id,
      nickname: participant.nickname,
      result: evaluation,
      roomCompleted: allFinished,
    });
  } catch (error) {
    console.error('Unhandled error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses pengiriman jawaban.' },
      { status: 500 }
    );
  }
}
