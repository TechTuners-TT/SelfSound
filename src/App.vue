<!--App.vue-->

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

// exapmle how to import components:
// import HelloWorld from "./components/HelloWorld.vue";
</script>


<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header with Navigation -->
    <header class="bg-blue-600 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="hover:underline font-semibold">
          Home
        </router-link>
        <router-link to="/about" class="hover:underline font-semibold">
          About
        </router-link>
        <router-link to="/sign-in" class="hover:underline font-semibold">
          Sign In
        </router-link>
        <router-link to="/sign-up" class="hover:underline font-semibold">
          Sign Up
        </router-link>

      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow container mx-auto p-0">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white text-center p-4">
      &copy; 2025 My Website
    </footer>
  </div>
</template>
