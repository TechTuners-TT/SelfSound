<template>
  <div class="2xl:m-[40px] xl:m-[30px] m-[20px]">
    <h1
      class="2xl:text-[24px] xl:text-[24px] lg:text-[20px] text-[16px] font-bold text-white inter-font"
    >
      Blocked users
    </h1>
  </div>

  <!-- Checkbox -->
  <div class="">
    <CheckboxComponent />
  </div>
</template>

<script setup lang="ts">
// будь-яка логіка або навіть порожньо — головне, щоб шаблон був
import CheckboxComponent from "../components/CheckboxComponent.vue";
</script>
