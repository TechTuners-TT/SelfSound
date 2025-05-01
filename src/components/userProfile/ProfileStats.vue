<template>
  <section
    class="flex gap-[50px] items-center mb-1.25 text-[12px] inter-font font-medium h-[12px]"
  >
    <p
      class="font-medium text-white inter-font text-[12px] h-[12px]"
      style="font-weight: 500"
    >
      {{ stats.posts }} posts
    </p>
    <p
      class="font-medium text-white inter-font text-[12px] h-[12px]"
      style="font-weight: 500"
    >
      Listeners: {{ stats.listeners }}
    </p>
    <p
      class="font-medium text-white inter-font text-[12px] h-[12px]"
      style="font-weight: 500"
    >
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

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
