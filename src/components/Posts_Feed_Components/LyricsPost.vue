<template>
  <div class="text-white font-inter">
    <!-- Назва та автор -->
    <div class="mb-5">
      <h2 class="text-[18px] font-semibold">{{ content.title }}</h2>
      <p class="text-[16px] text-gray-300">{{ content.artist }}</p>
    </div>

    <!-- Formatted Lyrics Text -->
    <div class="text-[16px] mb-4 leading-relaxed">
      <!-- Show truncated or full lyrics -->
      <div class="whitespace-pre-line">
        {{ isExpanded ? cleanLyrics : truncatedLyrics }}
      </div>
    </div>

    <!-- Read more / Show less button (only show if there's more content) -->
    <button
      v-if="needsReadMore"
      @click="toggleExpanded"
      class="inline-flex items-center gap-[5px] px-[13px] py-[8px] bg-[#6D01D0]/20 text-[#6D01D0] hover:bg-[#000C9C]/40 text-[16px] font-medium rounded-[5px] transition"
    >
      {{ isExpanded ? "Show less" : "Read more" }}
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ 'rotate-180': isExpanded }"
        class="transition-transform duration-200"
      >
        <path
          d="M0.86084 5.18829H9.6452M9.6452 5.18829L5.253 0.796143M9.6452 5.18829L5.253 9.58046"
          stroke="#6D01D0"
          stroke-width="1.2549"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps<{
  content: {
    title: string;
    artist: string;
    lyricsText: string;
  };
}>();

// State for expand/collapse
const isExpanded = ref(false);

// Clean lyrics - remove ALL structure markers and create flowing text
const cleanLyrics = computed(() => {
  if (!props.content.lyricsText) return "";

  return (
    props.content.lyricsText
      // Remove structure markers like [VERSE], [CHORUS], etc.
      .replace(/^\[.*\]$/gm, "")
      // Remove multiple consecutive empty lines
      .replace(/\n\n+/g, "\n\n")
      // Remove leading/trailing whitespace
      .trim()
  );
});

// Truncated version - show complete lines only (no cut-off)
const truncatedLyrics = computed(() => {
  const fullText = cleanLyrics.value;
  const lines = fullText.split("\n").filter((line) => line.trim());

  // Show first 4 complete lines (no partial words)
  const maxLines = 4;
  const previewLines = lines.slice(0, maxLines);

  return previewLines.join("\n");
});

// Check if "Read more" button is needed
const needsReadMore = computed(() => {
  const fullText = cleanLyrics.value;
  const truncated = truncatedLyrics.value;

  // Show read more if there's more content beyond the truncated version
  return fullText.length > truncated.length;
});

// Toggle expand/collapse
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
/* Remove any overflow or height restrictions that could cause cut-off */
</style>
