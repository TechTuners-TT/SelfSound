<template>
  <div class="text-white font-inter px-6">
    <!-- Header with title and artist -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold mb-2">{{ content.title }}</h1>
      <p class="text-lg text-gray-300">{{ content.artist }}</p>
    </div>

    <!-- Full lyrics with proper formatting -->
    <div class="text-base leading-relaxed whitespace-pre-line p-6 rounded-lg">
      {{ formattedLyrics }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  content: {
    title: string;
    artist: string;
    lyricsText: string;
  };
}>();

// Format lyrics for better display
const formattedLyrics = computed(() => {
  if (!props.content.lyricsText) return "No lyrics available";

  return (
    props.content.lyricsText
      // Keep structure markers for better readability
      .replace(/^\[([^\]]+)\]$/gm, "\n[$1]\n")
      // Clean up extra newlines but keep paragraph breaks
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
});
</script>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif;
}
</style>
