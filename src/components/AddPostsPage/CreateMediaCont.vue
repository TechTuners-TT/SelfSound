<template>
  <!-- Виключаємо min-h-screen, використовуємо h-full, щоб зайняв доступну висоту -->
  <div class="relative flex items-start justify-center w-full h-full">
    <!-- Забираємо h-full / max-h-screen із внутрішнього контейнера або замінюємо їх на max-h-full -->

    <div
      class="relative flex w-full md:w-1/2 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
    >
      <!-- Section 1 -->
      <section>
        <TitleSection />
      </section>

      <!-- Section 2 -->
      <section>
        <AtachMediaSection />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleSection from "./sections/CreateMedia/TitleSection.vue";
import AtachMediaSection from "./sections/CreateMedia/AttachMediaSection.vue";
</script>
