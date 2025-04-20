<template>
  <section
    class="flex gap-[50px] items-center mb-1.25 text-[12px] inter-font font-medium w-[500px] h-[12px]"
  >
    <p class="font-medium text-white inter-font text-[12px] w-[58px] h-[12px]" style="font-weight: 500">
      {{ stats.posts }} posts
    </p>
    <p class="font-medium text-white inter-font text-[12px] w-[90px] h-[12px]" style="font-weight: 500">
      Listeners: {{ stats.listeners }}
    </p>
    <p class="font-medium text-white inter-font text-[12px] w-[105px] h-[12px]" style="font-weight: 500">
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
@media (min-width: 1536px) {
  section {
    padding-left: 137px;
    padding-right: 0px;
  }
}
@media (min-width: 1280px) {
  section {
    padding-left: 134px;
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
  .text-\[12px\]{
    font-size: 11px;
  }
  section {
    padding-left: 112px;
    padding-right: 0px;
  }
}

@media (max-width: 1024px) {
  .gap-\[50px\] {
    gap: 42px;
  }
  .text-\[12px\]{
    font-size: 10px;
  }
  section {
    padding-left: 52px;
    padding-right: 0px;
  }
}

@media (max-width: 768px) {
  .gap-\[50px\] {
    gap: 38px;
  }
  .text-\[12px\]{
    font-size: 10px;
  }
}

@media (max-width: 640px) {
  .gap-\[50px\] {
    gap: 36px;
  }
  .text-\[12px\]{
    font-size: 10px;
  }
 
}

@media (max-width: 450px) {
  .gap-\[50px\] {
    gap: 32px;
  }
  .text-\[12px\]{
    font-size: 10px;
  }
  section {
    padding-left: 0px;
    padding-right: 0px;
    justify-content: center;
    text-align: center;
  }
}

@media (max-width: 350px) {
  .gap-\[50px\] {
    gap: 28px;
  }
  .text-\[12px\]{
    font-size: 10px;
  }
  section {
    padding-left: 0px;
    padding-right: 0px;
    justify-content: center;
    text-align: center;
  }
}

</style>
