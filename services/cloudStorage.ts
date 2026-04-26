import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

const TABLE_NAME = 'app_storage';

export async function getCloudValue<T>(key: string): Promise<T | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error(`Failed to read ${key} from Supabase`, error);
    return null;
  }

  return (data?.value as T | undefined) ?? null;
}

export async function setCloudValue<T>(key: string, value: T): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from(TABLE_NAME).upsert(
    {
      key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  );

  if (error) {
    console.error(`Failed to save ${key} to Supabase`, error);
    return false;
  }

  return true;
}
