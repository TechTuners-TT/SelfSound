<template>
  <section
    class="flex gap-[50px] items-center mb-1.25 text-[12px] inter-font font-medium w-[500px] h-[12px]"
  >
    <p class="font-medium text-white inter-font" style="font-weight: 500">
      {{ stats.posts }} posts
    </p>
    <p class="font-medium text-white inter-font" style="font-weight: 500">
      Listeners: {{ stats.listeners }}
    </p>
    <p class="font-medium text-white inter-font" style="font-weight: 500">
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
@media (min-width: 768px) {
  section {
    padding-left: 140px;
    padding-right: 0px;
  }
}
@media (max-width: 768px) {
  section {
    justify-content: center;
  }
}
@media (max-width: 640px) {
  section {
    justify-content: center;
  }
}

@media (max-width: 1536px) {
  .gap-\[50px\] {
    gap: 48px;
  }
}

@media (max-width: 1280px) {
  .gap-\[50px\] {
    gap: 46px;
  }
}

@media (max-width: 1024px) {
  .gap-\[50px\] {
    gap: 42px;
  }
}

@media (max-width: 768px) {
  .gap-\[50px\] {
    gap: 38px;
  }
}

@media (max-width: 640px) {
  .gap-\[50px\] {
    gap: 36px;
  }
}

@media (max-width: 450px) {
  .gap-\[50px\] {
    gap: 32px;
  }
}
</style>
