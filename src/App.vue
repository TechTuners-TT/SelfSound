<template>
  <div class="app">
    <h1>Google Auth with Supabase</h1>
    <h2>Hello it is test</h2>

    <button v-if="!user" @click="loginWithGoogle">Login with Google</button>
    <button v-if="user" @click="logout">Logout</button>
    <button v-if="user" @click="verifyToken">Verify Google Token</button>

    <p v-if="user">Logged in as: {{ user.email }}</p>
  </div>
  <div class="bg-blue-500 text-white p-4">
    Hello, Tailwind!
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from './supabase';
import { verifyGoogleToken } from './api/auth';

export default {
  setup() {
    const user = ref(null);

    // Вхід через Google
    const loginWithGoogle = async () => {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) console.error('Google Auth Error:', error);
    };

    // Вихід
    const logout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Logout Error:', error);
      user.value = null;
    };

    // Верифікація токена
    const verifyToken = async () => {
      const result = await verifyGoogleToken();
      console.log(result);
    };

    // Стежимо за змінами авторизації
    onMounted(async () => {
      const { data } = await supabase.auth.getUser();
      user.value = data?.user || null;

      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null;
      });
    });

    return { user, loginWithGoogle, logout, verifyToken };
  }
};
</script>

<style>
.app {
  text-align: center;
  margin-top: 50px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
