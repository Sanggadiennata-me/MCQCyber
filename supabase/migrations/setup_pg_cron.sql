-- ==============================================================================
-- Cyber Security MCQ Platform - Native Supabase pg_cron Setup
-- Otomatisasi pembersihan room sementara langsung di PostgreSQL Supabase
-- ==============================================================================

-- 1. Aktifkan ekstensi pg_cron (ekstensi resmi Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Pastikan stored procedure cleanup_stale_rooms sudah terpasang
CREATE OR REPLACE FUNCTION public.cleanup_stale_rooms(
  waiting_timeout_minutes INT DEFAULT 120,
  completed_retention_minutes INT DEFAULT 30
)
RETURNS INT AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM public.rooms
  WHERE 
    -- 1. Room 'WAITING' yang ditinggalkan lebih dari batas timeout (default: 2 jam)
    (status = 'WAITING' AND created_at < NOW() - (waiting_timeout_minutes || ' minutes')::interval)
    OR
    -- 2. Room 'COMPLETED' yang sudah selesai lewat masa retensi (default: 30 menit untuk baca hasil)
    (status = 'COMPLETED' AND finished_at < NOW() - (completed_retention_minutes || ' minutes')::interval)
    OR
    -- 3. Room 'IN_PROGRESS' yang hang/terbengkalai melebihi 1 jam setelah waktu kedaluwarsa
    (status = 'IN_PROGRESS' AND expires_at < NOW() - INTERVAL '1 hour')
    OR
    -- 4. Room 'EXPIRED' yang sudah lewat 15 menit
    (status = 'EXPIRED' AND created_at < NOW() - INTERVAL '15 minutes');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Berikan izin akses eksekusi fungsi kepada role postgres & service_role
GRANT EXECUTE ON FUNCTION public.cleanup_stale_rooms(INT, INT) TO postgres, service_role;

-- 3. Hapus jadwal lama jika nama job yang sama sudah ada (mencegah duplikasi)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-cleanup-stale-rooms') THEN
    PERFORM cron.unschedule('auto-cleanup-stale-rooms');
  END IF;
END $$;

-- 4. Daftarkan jadwal baru untuk berjalan setiap 30 menit
SELECT cron.schedule(
  'auto-cleanup-stale-rooms',
  '*/30 * * * *',
  $$ SELECT public.cleanup_stale_rooms(120, 30); $$
);

-- 5. Query untuk verifikasi jadwal yang aktif (bisa dicek di SQL Editor):
-- SELECT jobid, schedule, command, nodename, active FROM cron.job;
