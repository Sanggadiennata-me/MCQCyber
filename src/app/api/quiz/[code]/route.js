import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { hashToken } from '@/lib/security/tokens';
import { loadAllQuestionBanks, stripAnswers } from '@/lib/questions/loader';

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
    const token = tokenFromHeader || tokenFromUrl;

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
      .select('id, nickname, status, assigned_question_ids, answers, started_at, expires_at, finished_at, score, accuracy')
      .eq('room_id', room.id)
      .eq('participant_token_hash', hashedToken)
      .maybeSingle();

    if (pError || !participant) {
      return NextResponse.json(
        { error: 'Peserta tidak ditemukan atau token tidak valid.' },
        { status: 403 }
      );
    }

    // Load question definitions for this participant
    const assignedIds = Array.isArray(participant.assigned_question_ids)
      ? participant.assigned_question_ids
      : [];

    const { questionsMap } = loadAllQuestionBanks();
    const rawQuestions = [];
    for (const qId of assignedIds) {
      const q = questionsMap.get(qId);
      if (q) rawQuestions.push(q);
    }

    // SECURITY: Strip answers and explanations
    const safeQuestions = stripAnswers(rawQuestions);

    const now = new Date();
    const serverTime = now.toISOString();

    let remainingSeconds = 0;
    if (participant.expires_at) {
      const diffMs = new Date(participant.expires_at).getTime() - now.getTime();
      remainingSeconds = Math.max(0, Math.floor(diffMs / 1000));
    }

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        nickname: participant.nickname,
        status: participant.status,
        startedAt: participant.started_at,
        expiresAt: participant.expires_at,
        finishedAt: participant.finished_at,
        savedAnswers: participant.answers || {},
        isCompleted: participant.status === 'COMPLETED',
      },
      room: {
        roomCode: room.room_code,
        status: room.status,
        negativeMarking: Boolean(room.configuration?.negativeMarking),
      },
      questions: safeQuestions,
      timer: {
        serverTime,
        startedAt: participant.started_at,
        expiresAt: participant.expires_at,
        remainingSeconds,
      },
    });
  } catch (error) {
    console.error('Unhandled error fetching quiz data:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat mengambil data kuis.' },
      { status: 500 }
    );
  }
}
