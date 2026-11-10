-- ==============================================================================
-- Cyber Security MCQ Platform - Initial Database Schema
-- Designed for Temporary Multiplayer Rooms with Strict Cascading & Auto-cleanup
-- ==============================================================================

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(12) NOT NULL UNIQUE,
  host_token_hash VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
  -- Statuses: 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED'
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  CONSTRAINT valid_room_status CHECK (status IN ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED'))
);

-- 2. ROOM PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  nickname VARCHAR(32) NOT NULL,
  participant_token_hash VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
  -- Statuses: 'WAITING', 'READY', 'IN_PROGRESS', 'COMPLETED', 'DISCONNECTED'
  assigned_question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  incorrect_count INT NOT NULL DEFAULT 0,
  unanswered_count INT NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_nickname_per_room UNIQUE (room_id, nickname),
  CONSTRAINT valid_participant_status CHECK (status IN ('WAITING', 'READY', 'IN_PROGRESS', 'COMPLETED', 'DISCONNECTED'))
);

-- 3. INDEXES FOR FAST ROOM LOOKUPS & CLEANUP
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at);
CREATE INDEX IF NOT EXISTS idx_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_participants_expires_at ON room_participants(expires_at);

-- 4. REALTIME REPLICATION
-- Enable Supabase Realtime publication on rooms & room_participants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'room_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- In environments where supabase_realtime publication is managed externally
    NULL;
END $$;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;

-- Allow public read of active room states (excluding host_token_hash via views/select limits)
CREATE POLICY "Public can view active rooms" ON rooms
  FOR SELECT
  USING (true);

-- Allow public read of participants in a room (excluding participant_token_hash)
CREATE POLICY "Public can view room participants" ON room_participants
  FOR SELECT
  USING (true);

-- Service role and Anon role have full access to rooms and participants
CREATE POLICY "Service role has full access to rooms" ON rooms
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to room_participants" ON room_participants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon has full access to rooms" ON rooms
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon has full access to room_participants" ON room_participants
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 6. STORED PROCEDURE FOR AUTOMATED CLEANUP
-- Cleans up stale rooms (waiting > 2 hours, completed > 30 mins, expired)
CREATE OR REPLACE FUNCTION cleanup_stale_rooms(
  waiting_timeout_minutes INT DEFAULT 120,
  completed_retention_minutes INT DEFAULT 30
)
RETURNS INT AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM rooms
  WHERE 
    -- Rooms waiting longer than timeout (e.g. abandoned lobbies)
    (status = 'WAITING' AND created_at < NOW() - (waiting_timeout_minutes || ' minutes')::interval)
    OR
    -- Completed rooms past retention window (allows players to view final results)
    (status = 'COMPLETED' AND finished_at < NOW() - (completed_retention_minutes || ' minutes')::interval)
    OR
    -- In progress rooms that timed out and expired past 1 hour
    (status = 'IN_PROGRESS' AND expires_at < NOW() - INTERVAL '1 hour')
    OR
    -- Explicitly expired rooms
    (status = 'EXPIRED' AND created_at < NOW() - INTERVAL '15 minutes');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. OPTIONAL SUPABASE NATIVE PG_CRON (FREE IN SUPABASE POSTGRESQL)
-- ==============================================================================
-- Jika menggunakan Vercel Hobby (yang membatasi cron gratis hanya 1x sehari),
-- Anda bisa menjalankan cron gratis langsung di database Supabase:
-- 1. Buka Supabase Dashboard -> Database -> Extensions -> Aktifkan "pg_cron".
-- 2. Jalankan perintah SQL berikut di SQL Editor Supabase:
--
-- SELECT cron.schedule(
--   'auto-cleanup-stale-rooms',
--   '*/30 * * * *',
--   $$ SELECT cleanup_stale_rooms(120, 30); $$
-- );

