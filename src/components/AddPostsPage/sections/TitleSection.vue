<template>
  <div
    class="2xl:m-[40px] xl:m-[35px] lg:m-[33px] md:m-[32px] sm:m-[30px] m-[28px]"
  >
    <!-- Контейнер для кнопки-закрити та заголовка -->
    <div
      class="flex items-center 2xl:gap-[46px] xl:gap-[42px] lg:gap-[38px] md:gap-[35px] sm:gap-[32px] gap-[28px]"
    >
      <!-- Контейнер для іконки з відступами, але без зміни її розміру -->
      <button @click="goBack" class="p-0">
        <CloseIcon
          class="cursor-pointer 2xl:w-[25px] 2xl:h-[25px] xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[18px] md:h-[18px] sm:w-[16px] sm:h-[16px] w-[14px] h-[14px]"
        />
      </button>
      <!-- Заголовок -->
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Add new post
      </h1>
    </div>
  </div>

  <!-- Divider -->
  <div class="">
    <hr class="border-t-1 border-white/50" />
  </div>
</template>

<script setup lang="ts">
import CloseIcon from "../../SVG/AddPosts_Icons/CloseIcon.vue";

function goBack() {
  window.history.back();
}
</script>

<style scoped>
/* Додаткові стилі для контейнера, якщо потрібно */
.flex {
  display: flex;
  align-items: center; /* Вертикальне вирівнювання по центру */
}
</style>
