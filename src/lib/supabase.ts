
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jtcfclcaiofqlteipiyj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BJJ_Fw-WuH0-fJLWiAW71w_PzDAmRVw';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_kEenOxGFuT65F7eYjL5-Ig_9TLirGVp';

// Create a single supabase client for interacting with your database
// We use the Service Role Key to bypass RLS (Row Level Security) because the API routes
// are already protected by our own admin authentication.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
