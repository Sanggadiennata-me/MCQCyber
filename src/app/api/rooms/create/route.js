import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';
import { generateRoomCode, generateSessionToken, hashToken, sanitizeNickname } from '@/lib/security/tokens';

export async function POST(request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            'Koneksi Supabase belum dikonfigurasi. Harap atur environment variables NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local.',
        },
        { status: 503 }
      );
    }

    const supabase = getAdminSupabase();
    const body = await request.json();

    const {
      nickname: rawNickname,
      categoryMode = 'mixed',
      categories = [],
      difficulty = 'mixed',
      questionCount = 10,
      durationMinutes = 15,
      negativeMarking = false,
      randomizeOptions = true,
      randomizeQuestions = true,
    } = body;

    const nicknameVal = sanitizeNickname(rawNickname);
    if (!nicknameVal.valid) {
      return NextResponse.json({ error: nicknameVal.error }, { status: 400 });
    }

    const limit = Math.max(5, Math.min(100, parseInt(questionCount, 10) || 10));
    const duration = Math.max(5, Math.min(120, parseInt(durationMinutes, 10) || 15));

    const configuration = {
      categoryMode,
      categories: Array.isArray(categories) ? categories : [],
      difficulty,
      questionCount: limit,
      durationMinutes: duration,
      negativeMarking: Boolean(negativeMarking),
      randomizeOptions: Boolean(randomizeOptions),
      randomizeQuestions: Boolean(randomizeQuestions),
    };

    // Generate unique room code with collision check
    let roomCode = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      attempts++;
      const candidateCode = generateRoomCode();
      const { data: existing } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', candidateCode)
        .maybeSingle();

      if (!existing) {
        roomCode = candidateCode;
        isUnique = true;
      }
    }

    if (!roomCode) {
      return NextResponse.json(
        { error: 'Gagal membuat room code unik. Silakan coba kembali.' },
        { status: 500 }
      );
    }

    // Generate tokens
    const hostToken = generateSessionToken();
    const hostTokenHash = hashToken(hostToken);

    const participantToken = generateSessionToken();
    const participantTokenHash = hashToken(participantToken);

    // Insert room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        room_code: roomCode,
        host_token_hash: hostTokenHash,
        status: 'WAITING',
        configuration,
      })
      .select()
      .single();

    if (roomError || !room) {
      console.error('Error creating room:', roomError);
      return NextResponse.json(
        { error: 'Gagal membuat room di database: ' + (roomError?.message || '') },
        { status: 500 }
      );
    }

    // Insert host as the first participant
    const { data: participant, error: participantError } = await supabase
      .from('room_participants')
      .insert({
        room_id: room.id,
        nickname: nicknameVal.nickname,
        participant_token_hash: participantTokenHash,
        status: 'READY',
      })
      .select()
      .single();

    if (participantError || !participant) {
      console.error('Error creating host participant:', participantError);
      // Clean up orphaned room
      await supabase.from('rooms').delete().eq('id', room.id);
      return NextResponse.json(
        { error: 'Gagal mendaftarkan host ke dalam room.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      roomCode: room.room_code,
      hostToken,
      participantToken,
      participantId: participant.id,
      room: {
        id: room.id,
        roomCode: room.room_code,
        status: room.status,
        configuration: room.configuration,
      },
    });
  } catch (error) {
    console.error('Unhandled error in room creation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat membuat room.' },
      { status: 500 }
    );
  }
}
