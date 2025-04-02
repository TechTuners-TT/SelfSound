<!--App.vue-->

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

// exapmle how to import components:
// import HelloWorld from "./components/HelloWorld.vue";
</script>


<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main Content Area -->
    <main class="flex-grow container mx-auto p-0">
      <router-view />
    </main>

    <!-- Footer
    <footer class="bg-gray-800 text-white text-center p-4">
      &copy; 2025 My Website
    </footer> -->
  </div>
</template>
