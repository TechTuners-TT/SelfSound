<template>
  <svg
    v-if="!isPlaying"
    class="w-5 h-5 text-white"
    fill="white"
    viewBox="0 0 20 20"
  >
    <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
  </svg>
  <svg v-else class="w-5 h-5 text-white" fill="white" viewBox="0 0 20 20">
    <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
  </svg>
</template>

<script setup>
defineProps({
  isPlaying: Boolean,
});
</script>
