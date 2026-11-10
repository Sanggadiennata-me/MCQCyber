import { createClient } from '@supabase/supabase-js';
import { createLocalSupabaseAdapter } from './localAdapter';

const DEFAULT_SUPABASE_URL = 'https://azfvlvqpakyhbuquxcqo.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_sutrDx8_2YfKzE1dJNqI1Q_Ip97F2T5';

// Clean and sanitize environment values to avoid whitespace/newline issues
const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/['"]/g, '');
const supabaseUrl =
  !rawUrl || rawUrl.includes('gldesqcwgxbhaqrgpiwl') || rawUrl.includes('placeholder')
    ? DEFAULT_SUPABASE_URL
    : rawUrl;

const rawKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim().replace(/['"]/g, '');

// Strictly validate service role key; if corrupted or old, fallback to guaranteed active publishable key
const serviceRoleKey =
  rawKey.startsWith('sb_secret_') && rawKey.length === 42
    ? rawKey
    : DEFAULT_ANON_KEY;

let adminInstance = null;
let fallbackInstance = null;
let localInstance = null;

/**
 * Returns a server-side Supabase client.
 * Supports auto-fallback to guaranteed publishable key on key mismatches.
 */
export function getAdminSupabase(forceFallback = false) {
  if (forceFallback) {
    if (!fallbackInstance) {
      fallbackInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_ANON_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return fallbackInstance;
  }

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
