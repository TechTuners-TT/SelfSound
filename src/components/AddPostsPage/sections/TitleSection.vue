<template>
  <div class="2xl:m-[40px] xl:m-[30px] m-[20px]">
    <!-- Контейнер для кнопки-закрити та заголовка -->
    <div class="flex items-center">
      <!-- Контейнер для іконки з відступами, але без зміни її розміру -->
      <button class="2xl:mr-[40px] xl:mr-[30px] mr-[20px] p-0">
        <CloseIcon
          class="2xl:w-[24px] 2xl:h-[24px] xl:w-[20px] xl:h-[20px] lg:w-[18px] lg:h-[18px] w-[16px] h-[16px]"
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
</script>

<style scoped>
/* Додаткові стилі для контейнера, якщо потрібно */
.flex {
  display: flex;
  align-items: center; /* Вертикальне вирівнювання по центру */
}

.mr-[20px] {
  margin-right: 20px; /* Відступ між іконкою та заголовком */
}

.py-[20px] {
  padding-top: 20px; /* Відступ зверху для іконки */
  padding-bottom: 20px; /* Відступ знизу для іконки */
}

.px-[20px] {
  padding-left: 20px; /* Відступ зліва для іконки */
  padding-right: 20px; /* Відступ справа для іконки */
}
</style>
