import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { hashToken } from '@/lib/security/tokens';

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

    const supabase = getAdminSupabase();

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, room_code, host_token_hash, status, configuration, created_at, started_at, finished_at, expires_at')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room tidak ditemukan.' }, { status: 404 });
    }

    // Fetch participants
    const { data: participants, error: pError } = await supabase
      .from('room_participants')
      .select('id, nickname, status, score, correct_count, incorrect_count, unanswered_count, accuracy, started_at, finished_at, expires_at, participant_token_hash')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true });

    if (pError) {
      return NextResponse.json(
        { error: 'Gagal mengambil data peserta.' },
        { status: 500 }
      );
    }

    // Determine caller role
    const authHeader = request.headers.get('authorization') || '';
    const tokenFromHeader = authHeader.replace(/^Bearer\s+/i, '').trim();
    const tokenFromUrl = request.nextUrl.searchParams.get('token') || '';
    const callerToken = tokenFromHeader || tokenFromUrl;
    const hashedCallerToken = callerToken ? hashToken(callerToken) : '';

    const isHost = Boolean(hashedCallerToken && hashedCallerToken === room.host_token_hash);
    const activeParticipant = participants.find((p) => p.participant_token_hash === hashedCallerToken);

    // Sanitize participants output (strip sensitive hashes)
    const safeParticipants = participants.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      status: p.status,
      score: room.status === 'COMPLETED' ? p.score : 0,
      accuracy: room.status === 'COMPLETED' ? p.accuracy : 0,
      isFinished: p.status === 'COMPLETED',
      startedAt: p.started_at,
      finishedAt: p.finished_at,
      expiresAt: p.expires_at,
    }));

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        roomCode: room.room_code,
        status: room.status,
        configuration: room.configuration,
        createdAt: room.created_at,
        startedAt: room.started_at,
        finishedAt: room.finished_at,
        expiresAt: room.expires_at,
      },
      participants: safeParticipants,
      isHost,
      currentParticipantId: activeParticipant?.id || null,
    });
  } catch (error) {
    console.error('Unhandled error fetching room:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat mengambil data room.' },
      { status: 500 }
    );
  }
}
