<template>
  <section
    class="flex gap-10 items-center self-end mb-1.25 mr-29.25 text-base font-medium max-md:mr-10 "
  >
  
    <p class="text-base font-medium text-white">  {{ stats.posts }} posts </p>
    <p class="text-base font-medium text-white">
      Listeners: {{ stats.listeners }}
    </p>
    <p class="text-base font-medium text-white">
      Listened to: {{ stats.listenedTo }}
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    posts: number;
    listeners: number;
    listenedTo: number;
  };
}>();
</script>
