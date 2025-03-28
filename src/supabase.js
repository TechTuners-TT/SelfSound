
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL, 
  process.env.VUE_APP_SUPABASE_ANON_KEY
);

// Template to get data from tables
const fetchData = async () => {
  const { data, error } = await supabase.from('User').select('*');
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Fetched data:', data);
  }
};

fetchData();

