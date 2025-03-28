import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL, 
  process.env.VUE_APP_SUPABASE_ANON_KEY
)
