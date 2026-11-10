import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { hashToken } from '@/lib/security/tokens';
import { evaluateQuizSubmission } from '@/lib/scoring/evaluator';

export async function GET(request, { params }) {
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
    const callerToken = tokenFromHeader || tokenFromUrl;
    const hashedCallerToken = callerToken ? hashToken(callerToken) : '';

    const supabase = getAdminSupabase();

    // Fetch room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, room_code, status, configuration, created_at, started_at, finished_at, expires_at')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room tidak ditemukan.' }, { status: 404 });
    }

    // Fetch all participants
    const { data: participants, error: pError } = await supabase
      .from('room_participants')
      .select('id, nickname, status, score, correct_count, incorrect_count, unanswered_count, accuracy, started_at, finished_at, expires_at, assigned_question_ids, answers, participant_token_hash')
      .eq('room_id', room.id)
      .order('score', { ascending: false });

    if (pError || !participants) {
      return NextResponse.json(
        { error: 'Gagal mengambil data peserta.' },
        { status: 500 }
      );
    }

    let teamScore = 0;
    let allFinished = true;

    const participantResults = participants.map((p) => {
      teamScore += p.score || 0;
      if (p.status !== 'COMPLETED') {
        allFinished = false;
      }

      let timeTakenSeconds = 0;
      if (p.started_at && p.finished_at) {
        const startMs = new Date(p.started_at).getTime();
        const endMs = new Date(p.finished_at).getTime();
        if (endMs >= startMs) {
          timeTakenSeconds = Math.round((endMs - startMs) / 1000);
        }
      }

      return {
        id: p.id,
        nickname: p.nickname,
        status: p.status,
        score: p.score || 0,
        accuracy: parseFloat(p.accuracy) || 0,
        correctCount: p.correct_count || 0,
        incorrectCount: p.incorrect_count || 0,
        unansweredCount: p.unanswered_count || 0,
        timeTakenSeconds,
      };
    });

    // If caller provided their token, deliver their personal question explanation breakdown
    let callerBreakdown = null;
    const activeParticipant = participants.find((p) => p.participant_token_hash === hashedCallerToken);

    if (activeParticipant && activeParticipant.status === 'COMPLETED') {
      const evaluation = evaluateQuizSubmission({
        assignedQuestionIds: activeParticipant.assigned_question_ids || [],
        userAnswers: activeParticipant.answers || {},
        negativeMarking: Boolean(room.configuration?.negativeMarking),
        startedAt: activeParticipant.started_at,
        finishedAt: activeParticipant.finished_at,
      });
      callerBreakdown = evaluation.breakdown;
    }

    return NextResponse.json({
      success: true,
      roomCode: room.room_code,
      roomStatus: room.status,
      allFinished: allFinished || room.status === 'COMPLETED',
      teamScore,
      participantCount: participants.length,
      participants: participantResults,
      callerParticipantId: activeParticipant?.id || null,
      callerBreakdown,
    });
  } catch (error) {
    console.error('Unhandled error fetching results:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memuat hasil pertandingan.' },
      { status: 500 }
    );
  }
}
