import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { generateSessionToken, hashToken, sanitizeNickname } from '@/lib/security/tokens';

export async function POST(request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Koneksi Supabase belum dikonfigurasi.' },
        { status: 503 }
      );
    }

    const supabase = getAdminSupabase();
    const body = await request.json();

    const { roomCode: rawCode, nickname: rawNickname } = body;

    const roomCode = (rawCode || '').trim().toUpperCase();
    if (!roomCode || roomCode.length < 4) {
      return NextResponse.json(
        { error: 'Room code tidak valid.' },
        { status: 400 }
      );
    }

    const nicknameVal = sanitizeNickname(rawNickname);
    if (!nicknameVal.valid) {
      return NextResponse.json({ error: nicknameVal.error }, { status: 400 });
    }

    // Fetch room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, room_code, status, configuration')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Room dengan kode tersebut tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Check status
    if (room.status !== 'WAITING') {
      return NextResponse.json(
        { error: `Room tidak dapat dimasuki karena status pertandingan: ${room.status}.` },
        { status: 403 }
      );
    }

    // Check existing participants
    const { data: participants, error: pError } = await supabase
      .from('room_participants')
      .select('id, nickname')
      .eq('room_id', room.id);

    if (pError) {
      return NextResponse.json(
        { error: 'Gagal memeriksa peserta room.' },
        { status: 500 }
      );
    }

    // Enforce max 3 participants
    if (participants.length >= 3) {
      return NextResponse.json(
        { error: 'Room sudah penuh (maksimal 3 peserta).' },
        { status: 403 }
      );
    }

    // Enforce unique nickname
    const duplicate = participants.some(
      (p) => p.nickname.toLowerCase() === nicknameVal.nickname.toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json(
        { error: 'Nickname tersebut sudah digunakan oleh peserta lain di room ini.' },
        { status: 409 }
      );
    }

    // Generate token
    const participantToken = generateSessionToken();
    const participantTokenHash = hashToken(participantToken);

    const { data: newParticipant, error: insertError } = await supabase
      .from('room_participants')
      .insert({
        room_id: room.id,
        nickname: nicknameVal.nickname,
        participant_token_hash: participantTokenHash,
        status: 'READY',
      })
      .select()
      .single();

    if (insertError || !newParticipant) {
      return NextResponse.json(
        { error: 'Gagal bergabung ke dalam room.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      roomCode: room.room_code,
      participantToken,
      participantId: newParticipant.id,
      room: {
        id: room.id,
        roomCode: room.room_code,
        status: room.status,
        configuration: room.configuration,
      },
    });
  } catch (error) {
    console.error('Unhandled error in join room:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat mencoba bergabung ke room.' },
      { status: 500 }
    );
  }
}
