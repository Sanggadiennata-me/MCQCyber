import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase/admin';

export async function POST(request) {
  return handleCleanup(request);
}

export async function GET(request) {
  return handleCleanup(request);
}

async function handleCleanup(request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Koneksi Supabase belum dikonfigurasi.' },
        { status: 503 }
      );
    }

    const supabase = getAdminSupabase();
    let specificRoomCode = null;

    try {
      const body = await request.json();
      specificRoomCode = body?.roomCode;
    } catch {
      specificRoomCode = request.nextUrl.searchParams.get('roomCode');
    }

    // If client requested immediate cleanup of a specific finished room
    if (specificRoomCode) {
      const cleanCode = specificRoomCode.trim().toUpperCase();
      const { data: room } = await supabase
        .from('rooms')
        .select('id, status')
        .eq('room_code', cleanCode)
        .maybeSingle();

      if (room) {
        await supabase.from('rooms').delete().eq('id', room.id);
        return NextResponse.json({
          success: true,
          message: `Room ${cleanCode} berhasil dibersihkan.`,
        });
      }
    }

    // Automated periodic cleanup:
    // 1. WAITING rooms older than 2 hours (abandoned lobbies)
    // 2. COMPLETED rooms older than 30 minutes (allows viewing results)
    // 3. EXPIRED rooms older than 15 minutes
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { error: err1 } = await supabase
      .from('rooms')
      .delete()
      .eq('status', 'WAITING')
      .lt('created_at', twoHoursAgo);

    const { error: err2 } = await supabase
      .from('rooms')
      .delete()
      .eq('status', 'COMPLETED')
      .lt('finished_at', thirtyMinsAgo);

    const { error: err3 } = await supabase
      .from('rooms')
      .delete()
      .eq('status', 'EXPIRED')
      .lt('created_at', fifteenMinsAgo);

    if (err1 || err2 || err3) {
      console.error('Errors in scheduled cleanup:', err1, err2, err3);
    }

    return NextResponse.json({
      success: true,
      message: 'Idempotent cleanup rutin berhasil dijalankan.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unhandled error in room cleanup:', error);
    return NextResponse.json(
      { error: 'Gagal menjalankan pembersihan room.' },
      { status: 500 }
    );
  }
}
