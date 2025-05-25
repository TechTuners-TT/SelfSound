<template>
  <div class="m-[20px]">
    <!-- Контейнер для кнопки-закрити та заголовка -->
    <div
      class="flex items-center [@media(min-width:1537px)]:gap-[46px] xl:gap-[40px] lg:gap-[36px] md:gap-[34px] sm:gap-[30px] gap-[26px]"
    >
      <!-- Контейнер для іконки з відступами, але без зміни її розміру -->
      <button class="p-0">
        <a href="#home">
          <CloseIcon
            class="cursor-pointer [@media(min-width:1537px)]:w-[25px] [@media(min-width:1537px)]:h-[25px] xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[18px] md:h-[18px] sm:w-[16px] sm:h-[16px] w-[14px] h-[14px]"
        /></a>
      </button>
      <!-- Заголовок -->
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
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
/*
@click="goBack"
function goBack() {
  window.history.back();
}
  */
</script>

<style scoped>
/* Додаткові стилі для контейнера, якщо потрібно */
.flex {
  display: flex;
  align-items: center; /* Вертикальне вирівнювання по центру */
}
</style>
