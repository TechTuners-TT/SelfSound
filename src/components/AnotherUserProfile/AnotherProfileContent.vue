<template>
  <section class="flex flex-col gap-15 mx-auto section_1">
    <div
      class="px-[10px] sm:px-[50px] md:px-[20px] lg:px-[30px] xl:px-[30px] 2xl:px-[40px]"
    >
      <button
        class="cursor-pointer w-full h-8 text-sm sm:text-base text-white rounded-[5px] shadow-sm mx-auto block inter-font"
        :style="{
          backgroundColor: isClicked
            ? 'rgba(109, 1, 208,0.5)'
            : 'rgba(0, 12, 156,0.4)',
          fontWeight: '500',
        }"
        @click="toggleButton"
      >
        {{ isClicked ? "Listened" : "Listen" }}
      </button>
    </div>

    <div class="w-full h-px border border-[rgba(255,255,255,0.5)]"></div>
    <p
      class="mt-10 sm:mt-47.5 text-sm sm:text-base text-white text-center inter-font text_size"
      style="font-weight: 400"
    >
      There's nothing here yet, add your first post!
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isClicked = ref(false);

function toggleButton() {
  isClicked.value = !isClicked.value;
}
</script>
<style scoped>
/* Ignore any external margin from parent containers */
section {
  margin: 0 !important; /* Forces section to ignore any margins */
}
section .max-w {
  max-width: 640px;
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
