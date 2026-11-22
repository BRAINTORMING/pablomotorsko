import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env ?? {};
const url: string = env.VITE_SUPABASE_URL || '';
const anonKey: string = env.VITE_SUPABASE_ANON_KEY || '';

/** True when the .env variables are present. */
export const supabaseConfigured = Boolean(url && anonKey);

/** Supabase client, or null when the app is not configured yet (the site then uses its sample data). */
export const supabase = supabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

export const PHOTO_BUCKET = 'vehiculos';
