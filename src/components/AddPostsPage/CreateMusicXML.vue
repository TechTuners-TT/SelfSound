<template>
  <!-- Виключаємо min-h-screen, використовуємо h-full, щоб зайняв доступну висоту -->
  <div class="relative flex items-start justify-center w-full h-full">
    <!-- Забираємо h-full / max-h-screen із внутрішнього контейнера або замінюємо їх на max-h-full -->

    <div
      class="relative w-full md:w-3/5 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
    >
      <!-- Section 1 -->
      <section>
        <TitleSection />
      </section>

      <!-- Section 2 -->
      <section>
        <AttachMediaXML />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleSection from "./sections/TitleSection.vue";
import AttachMediaXML from "./sections/CreateMusicXML/AttachMusicXML.vue";
</script>
