import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASEURL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASEKEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

