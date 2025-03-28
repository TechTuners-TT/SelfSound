import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://konitfcqyldrasqerqgi.supabase.co'; // Замініть на свій
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvbml0ZmNxeWxkcmFzcWVycWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODk2NjgsImV4cCI6MjA1ODA2NTY2OH0.ULM14dh3aRmNAb2uLQvIn6G-xtYpuiLJK_IzjNNFiK8'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
