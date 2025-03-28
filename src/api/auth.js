import { supabase } from '../supabase';

export async function getGoogleToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.provider_token || null;
}

export async function verifyGoogleToken() {
  const idToken = await getGoogleToken();

  if (!idToken) {
    console.error("No ID token found");
    return null;
  }

  try {
    const response = await fetch('http://localhost:8000/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });

    return await response.json();
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
