<template>
  <div class="flex items-center justify-center w-full h-screen">
    <div class="bg-black/30 h-full w-full sm:w-1/2 md:w-1/3">
      <!-- Content of the component -->

      <!-- Section 1 -->
      <!-- Settings Title -->
      <section class="">
        <TitleSection />
      </section>

      <!-- Section 2 -->
      <!-- Subscribtion -->
      <section class="">
        <SubscribtionSection />
      </section>

      <!-- Section 3 -->
      <!-- Blocked Users -->
      <section class="">
        <BlockedUsrSection />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { onMounted, ref, computed } from "vue";
import TitleSection from "./sections/TitleSection.vue";
import SubscribtionSection from "./sections/SubscribtionSection.vue";
import BlockedUsrSection from "./sections/BlockedUsrSection.vue";
</script>
