import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://azfvlvqpakyhbuquxcqo.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_sutrDx8_2YfKzE1dJNqI1Q_Ip97F2T5';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl =
  rawUrl.includes('gldesqcwgxbhaqrgpiwl') || !rawUrl
    ? DEFAULT_SUPABASE_URL
    : rawUrl;

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAnonKey =
  rawKey.includes('sb_publishable_sutrDx8_2YfKzE1dJNqI1Q_Ip97F2T5')
    ? rawKey
    : DEFAULT_ANON_KEY;

let clientInstance = null;

/**
 * Returns a singleton browser Supabase client for realtime subscriptions
 */
export function getBrowserSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return clientInstance;
}
