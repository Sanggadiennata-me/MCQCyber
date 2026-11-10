import { createClient } from '@supabase/supabase-js';
import { createLocalSupabaseAdapter } from './localAdapter';

const DEFAULT_SUPABASE_URL = 'https://azfvlvqpakyhbuquxcqo.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_sutrDx8_2YfKzE1dJNqI1Q_Ip97F2T5';

// Prioritize the active Supabase project and bypass stale Vercel dashboard variables
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl =
  rawUrl.includes('gldesqcwgxbhaqrgpiwl') || !rawUrl
    ? DEFAULT_SUPABASE_URL
    : rawUrl;

const rawKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const serviceRoleKey =
  !rawKey || rawKey.includes('placeholder')
    ? DEFAULT_ANON_KEY
    : rawKey;

let adminInstance = null;
let localInstance = null;

/**
 * Returns a server-side Supabase client.
 * Falls back to local file-backed adapter when cloud credentials are not provided.
 */
export function getAdminSupabase() {
  if (supabaseUrl && serviceRoleKey) {
    if (!adminInstance) {
      adminInstance = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return adminInstance;
  }

  // Fallback to local store for development and offline testing
  if (!localInstance) {
    localInstance = createLocalSupabaseAdapter();
  }
  return localInstance;
}

/**
 * Checks if Supabase (cloud or local fallback) is available for operation.
 * Always returns true so Team Challenge is fully playable.
 */
export function isSupabaseConfigured() {
  return true;
}

/**
 * Checks if remote Supabase Cloud credentials are provided.
 */
export function isCloudSupabaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}
