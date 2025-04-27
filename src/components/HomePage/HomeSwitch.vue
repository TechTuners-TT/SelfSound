<template>
  <div
    class="flex items-center justify-center 2xl:my-[22px] xl:my-[18px] lg:my-[14px] md:my-[12px] sm:my-[10px] my-[8px]"
  >
    <div class="flex justify-end flex-1">
      <h1
        class="2xl:text-[24px] xl:text-[24px] lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-white inter-font"
        :class="['tab', activeTab === 'forYou' ? 'active' : '']"
        @click="activeTab = 'forYou'"
      >
        For you
      </h1>
    </div>
    <!-- Divider -->
    <div class="mx-[30px] Divider border-l-1 border-white">
      <!-- Вертикальний Divider -->
    </div>
    <div class="flex justify-start flex-1">
      <h1
        class="2xl:text-[24px] xl:text-[24px] lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-white inter-font"
        :class="['tab', activeTab === 'listened' ? 'active' : '']"
        @click="activeTab = 'listened'"
      >
        Listened to
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeTab = ref("forYou"); // Спочатку активна вкладка "For you"
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
.Divider {
  height: 24px;
  width: 1px;
}

.tab {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.5);
  transition:
    background-color 0.3s,
    color 0.3s;
  cursor: pointer;
}

.active {
  color: rgba(109, 1, 208, 1);
}
</style>
