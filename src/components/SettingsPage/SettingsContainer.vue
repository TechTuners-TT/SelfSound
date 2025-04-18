<template>
  <!-- Виключаємо min-h-screen, використовуємо h-full, щоб зайняв доступну висоту -->
  <div class="relative flex items-start justify-center w-full h-full">
    <!-- Забираємо h-full / max-h-screen із внутрішнього контейнера або замінюємо їх на max-h-full -->
    <div
      class="relative flex w-full sm:w-1/2 md:w-1/3 bg-black/30 flex flex-col max-h-full h-screen"
    >
      <!-- Section 1 -->
      <section>
        <TitleSection />
      </section>

      <!-- Section 2 -->
      <section>
        <SubscribtionSection />
      </section>

      <!-- Section 3 -->
      <section>
        <BlockedUsrSection />
      </section>

      <!-- Section 4 -->
      <section>
        <LogOutSection />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleSection from "./sections/TitleSection.vue";
import SubscribtionSection from "./sections/SubscribtionSection.vue";
import BlockedUsrSection from "./sections/BlockedUsrSection.vue";
import LogOutSection from "./sections/LogOutSection.vue";
</script>
