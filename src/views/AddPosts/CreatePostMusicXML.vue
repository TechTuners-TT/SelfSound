<script setup lang="ts">
import { ref, onMounted } from "vue";
import CreateMusicXML from "../../components/AddPostsPage/CreateMusicXML.vue";
import NavBar from "../../components/Navigation/NavBar.vue";

const showNav = ref(false);

onMounted(() => {
  const mediaQuery = window.matchMedia("(min-width: 1024px)"); // lg = 1024px
  showNav.value = mediaQuery.matches;

  mediaQuery.addEventListener("change", (e) => {
    showNav.value = e.matches;
  });
});
</script>

<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->
    <main class="flex flex-col flex-grow overflow-auto">
      <!-- MAIN CONTENT -->

      <!-- Nav Bar -->
      <NavBar v-if="showNav" />

      <!-- Settings Content -->
      <div class="flex-grow max-h-full">
        <CreateMusicXML />
      </div>
    </main>
  </div>
</template>
