import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { hashToken } from '@/lib/security/tokens';
import { distributeTeamQuestions } from '@/lib/room/distributor';

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

    const body = await request.json();
    const { hostToken } = body;

    if (!hostToken) {
      return NextResponse.json(
        { error: 'Host authorization token diperlukan untuk memulai pertandingan.' },
        { status: 401 }
      );
    }

    const supabase = getAdminSupabase();

    // Fetch room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, room_code, host_token_hash, status, configuration')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room tidak ditemukan.' }, { status: 404 });
    }

    // Authenticate host
    const hashedToken = hashToken(hostToken);
    if (hashedToken !== room.host_token_hash) {
      return NextResponse.json(
        { error: 'Akses ditolak: Token host tidak valid.' },
        { status: 403 }
      );
    }

    if (room.status !== 'WAITING') {
      return NextResponse.json(
        { error: `Pertandingan tidak dapat dimulai karena status room: ${room.status}.` },
        { status: 400 }
      );
    }

    // Fetch participants
    const { data: participants, error: pError } = await supabase
      .from('room_participants')
      .select('id, nickname')
      .eq('room_id', room.id);

    if (pError || !participants) {
      return NextResponse.json(
        { error: 'Gagal mengambil data peserta.' },
        { status: 500 }
      );
    }

    if (participants.length < 2) {
      return NextResponse.json(
        { error: 'Minimal 2 peserta diperlukan untuk memulai pertandingan tim.' },
        { status: 400 }
      );
    }

    if (participants.length > 3) {
      return NextResponse.json(
        { error: 'Maksimal 3 peserta diperbolehkan dalam room.' },
        { status: 400 }
      );
    }

    // Distribute unique questions
    const participantIds = participants.map((p) => p.id);
    const distributionResult = distributeTeamQuestions({
      participantIds,
      configuration: room.configuration,
    });

    if (!distributionResult.success) {
      return NextResponse.json(
        { error: distributionResult.error },
        { status: 400 }
      );
    }

    const durationMinutes = parseInt(room.configuration.durationMinutes, 10) || 15;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const startedAtISO = now.toISOString();
    const expiresAtISO = expiresAt.toISOString();

    // Update each participant with their individual questions & timer
    for (const p of participants) {
      const assignedQuestions = distributionResult.distributions[p.id] || [];
      const assignedIds = assignedQuestions.map((q) => q.id);

      const { error: updatePError } = await supabase
        .from('room_participants')
        .update({
          assigned_question_ids: assignedIds,
          status: 'IN_PROGRESS',
          started_at: startedAtISO,
          expires_at: expiresAtISO,
        })
        .eq('id', p.id);

      if (updatePError) {
        console.error(`Failed to assign questions to participant ${p.id}:`, updatePError);
      }
    }

    // Update room status
    const { error: updateRoomError } = await supabase
      .from('rooms')
      .update({
        status: 'IN_PROGRESS',
        started_at: startedAtISO,
        expires_at: expiresAtISO,
      })
      .eq('id', room.id);

    if (updateRoomError) {
      return NextResponse.json(
        { error: 'Gagal memperbarui status room menjadi IN_PROGRESS.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pertandingan berhasil dimulai.',
      startedAt: startedAtISO,
      expiresAt: expiresAtISO,
    });
  } catch (error) {
    console.error('Unhandled error starting room:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memulai pertandingan.' },
      { status: 500 }
    );
  }
}
