
import { supabase } from '../supabase';

export async function getGoogleToken() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

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

    if (!response.ok) {
      throw new Error('Failed to verify token');
    }

    return await response.json();
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

