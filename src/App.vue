<template>
  <div class="app">
    <h1>Google Auth with Supabase</h1>

    <button v-if="!user" @click="loginWithGoogle">Login with Google</button>
    <button v-if="user" @click="logout">Logout</button>
    <button v-if="user" @click="verifyToken">Verify Google Token</button>

    <p v-if="user">Logged in as: {{ user.email }}</p>
  </div>

  <header>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/secret">Secret</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/signin">SignIn design</RouterLink>
        <RouterLink to="/signup">SignUp design</RouterLink>
        <RouterLink to="/about">About design</RouterLink>
      </nav>
    </div>
  </header>

  <div class="content">
	<RouterView />
  </div>

</template>


<script>
// import { RouterLink, RouterView } from 'vue-router'

import { ref, onMounted } from 'vue';
import { supabase } from './clients/supabase';
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

<style scoped>
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

nav {
	display: flex;
	justify-content: center;
}

nav a {
	padding: 1em;
}

.content {
	/*
  display: flex;
	align-items: center;
	flex-direction: column;
	width: 500px;
	border: solid 1px black;
	margin-left: auto;
	margin-right: auto;
	border-radius: 1em;
	padding: 2em 0 2em 0;
  */
}
</style>

