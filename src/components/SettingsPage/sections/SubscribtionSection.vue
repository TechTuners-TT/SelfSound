<template>
  <div class="m-[20px]">
    <h1 class="lg:text-[20px] text-[16px] font-bold text-white inter-font">
      My subscription
    </h1>
  </div>

  <!-- Subscribtion Card -->
  <div class="m-[20px] grid grid-cols-2 gap-[15px]">
    <div class="w-full h-full">
      <FreeSubscribtionCard />
    </div>
    <div class="w-full h-full">
      <PremiumSubscribtionCard />
    </div>
  </div>
</template>

<script setup lang="ts">
// будь-яка логіка або навіть порожньо — головне, щоб шаблон був
import FreeSubscribtionCard from "../components/FreeSuscriptionCard.vue";
import PremiumSubscribtionCard from "../components/PremiumSubscription.vue";
</script>
