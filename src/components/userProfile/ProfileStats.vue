<template>
  <section
    class="flex gap-[50px] items-center mb-1.25 text-[12px] inter-font font-medium w-[500px] h-[12px]"
  >
    <p
      class="font-medium text-white inter-font text-[12px] w-[58px] h-[12px]"
      style="font-weight: 500"
    >
      {{ stats.posts }} posts
    </p>
    <p
      class="font-medium text-white inter-font text-[12px] w-[90px] h-[12px]"
      style="font-weight: 500"
    >
      Listeners: {{ stats.listeners }}
    </p>
    <p
      class="font-medium text-white inter-font text-[12px] w-[105px] h-[12px]"
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
  .text-\[12px\] {
    font-size: 11px;
  }
  section {
    padding-left: 112px;
    padding-right: 0px;
  }
}

@media (max-width: 1024px) {
  .gap-\[50px\] {
    gap: 15px;
  }
  .text-\[12px\] {
    font-size: 9px;
  }
  section {
    padding-left: 120px;
    padding-right: 0px;
  }
}

@media (max-width: 768px) {
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 10px;
  }
  section {
    padding-left: 203px;
    padding-right: 95px;
    text-align: left;
  }
  .w-\[58px\] {
    width: 45px;
  }
  .w-\[90px\] {
    width: 65px;
  }
  .w-\[105px\] {
    width: 72px;
  }
}

@media (max-width: 640px) {
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 9px;
  }
  section {
    padding-left: 93px;
    padding-right: 5px;
    text-align: left;
  }
  .w-\[58px\] {
    width: 45px;
  }
  .w-\[90px\] {
    width: 65px;
  }
  .w-\[105px\] {
    width: 72px;
  }
}

@media (max-width: 480px) {
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 9px;
  }
  section {
    padding-left: 63px;
    padding-right: 5px;
    text-align: left;
  }
  .w-\[58px\] {
    width: 45px;
  }
  .w-\[90px\] {
    width: 65px;
  }
  .w-\[105px\] {
    width: 72px;
  }
}

@media (max-width: 479.5px) {
  section {
    padding-left: 136.5px;
    padding-right: 40px;
    justify-content: left;
    text-align: center;
  }
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 10px;
  }
}

@media (max-width: 450px) {
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 10px;
  }
  section {
    padding-left: 135px;
    padding-right: 50px;
    justify-content: left;
    text-align: center;
  }
}

@media (max-width: 400px) {
  section {
    padding-left: 126.5px;
    padding-right: 40px;
    justify-content: left;
    text-align: center;
  }
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 10px;
  }
}

@media (max-width: 380px) {
  section {
    padding-left: 115px;
    padding-right: 30px;
    justify-content: left;
    text-align: center;
  }
  .gap-\[50px\] {
    gap: 10px;
  }
  .text-\[12px\] {
    font-size: 10px;
  }
}

@media (max-width: 350px) {
  section {
    padding-left: 115px;
    padding-right: 30px;
    justify-content: left;
    text-align: center;
  }
  .gap-\[50px\] {
    gap: 9px;
  }
  .text-\[12px\] {
    font-size: 9px;
  }
}
</style>
