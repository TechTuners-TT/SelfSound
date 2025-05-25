<template>
  <div class="mb-[20px]">
    <div
      class="flex items-center mt-[20px] [@media(min-width:1537px)]:gap-[46px] xl:gap-[40px] lg:gap-[36px] md:gap-[34px] sm:gap-[30px] gap-[26px]"
    >
      <button class="p-0">
        <a href="#settings">
          <close_premium
            class="cursor-pointer [@media(min-width:1537px)]:w-[25px] [@media(min-width:1537px)]:h-[25px] xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[18px] md:h-[18px] sm:w-[16px] sm:h-[16px] w-[14px] h-[14px]"
        /></a>
      </button>
      <!-- Заголовок -->
      <h1
        class="inter-font [@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Premium
      </h1>
    </div>
    <!-- Divider -->
    <div
      class="mt-[20px] -mx-[10px] sm:-mx-[50px] md:-mx-[20px] lg:-mx-[30px] xl:-mx-[30px] 2xl:-mx-[40px]"
    >
      <hr class="border-t-1 border-white/50" />
    </div>
  </div>

  <div>
    <div
      class="inter-font [@media(min-width:1537px)]:text-[20px] xl:text-[18px] lg:text-[16px] text-[14px] font-semibold text-white mb-[15px] sm:mb-[18px] md:mb-[20px] lg:mb-[24px] xl:mb-[26px] 2xl:mb-[30px]"
    >
      Premium features are currently under development
    </div>
    <div
      class="inter-font [@media(min-width:1537px)]:text-[16px] xl:text-[15px] lg:text-[14px] text-[12px] font-normal text-white mb-[20px] sm:mb-[24px] md:mb-[28px] lg:mb-[32px] xl:mb-[34px] 2xl:mb-[38px]"
    >
      We're working hard to bring you an enhanced experience with exclusive
      premium features. Stay tuned for updates!
    </div>
    <div
      class="bg-[#000C9C]/40 border-[1px] border-[#FFFFFF]/10 rounded-[8px] h-[31px] sm:h-[33px] md:h-[35px] lg:h-[37px] xl:h-[39px] 2xl:h-[41px] flex items-center justify-start px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-4.5 2xl:px-5"
    >
      <div
        class="text-white [@media(min-width:1537px)]:text-[14px] xl:text-[13px] lg:text-[12px] text-[11px] font-normal inter-font"
      >
        Expected release: Coming soon
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import close_premium from "../SVG/Premium_Close/close_premium.vue";
</script>

<style scoped>
/* Додаткові стилі для контейнера, якщо потрібно */
.flex {
  display: flex;
  align-items: center; /* Вертикальне вирівнювання по центру */
}
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
