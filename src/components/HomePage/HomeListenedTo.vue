<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800 px-4 py-3"
    >
      <h1 class="text-xl font-semibold text-center">Listened To</h1>
    </div>

    <!-- DEBUG: Always show ListenedToFeed for testing -->
    <div>
      <p>
        DEBUG: Auth status - authenticated: {{ isAuthenticated }}, checking:
        {{ checkingAuth }}
      </p>
      <ListenedToFeed />
    </div>

    <!-- Original conditional logic (commented out for debugging) -->
    <!-- 
    <div v-if="!isAuthenticated && !checkingAuth" class="flex flex-col items-center justify-center py-16 px-6">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h3 class="text-xl font-semibold mb-2">Sign In Required</h3>
        <p class="text-gray-400 mb-6">You need to sign in to see posts from users you're listening to.</p>
        <router-link 
          to="/sign-in" 
          class="bg-[#6D01D0] hover:bg-[#5a0ba8] text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          Sign In
        </router-link>
      </div>
    </div>

    <div v-else-if="checkingAuth" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0]"></div>
    </div>

    <ListenedToFeed v-else />
    -->
  </div>
</template>

<script setup lang="ts">
console.log("🔥 HomeListenedTo.vue script is executing!");
import { ref, onMounted } from "vue";
import ListenedToFeed from "../Posts_Feed_Components/ListenedToFeed.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const isAuthenticated = ref(false);
const checkingAuth = ref(true);

// Check if user is authenticated (same logic as your router)
async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/authorization/me`, {
      method: "GET",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

onMounted(async () => {
  console.log("🚨 HomeListenedTo component mounted!");
  checkingAuth.value = true;
  isAuthenticated.value = await checkAuth();
  checkingAuth.value = false;
  console.log("🚨 Authentication result:", isAuthenticated.value);
  console.log(
    "🚨 Should show ListenedToFeed:",
    isAuthenticated.value && !checkingAuth.value,
  );
});
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
