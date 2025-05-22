<template>
  <div class="text-white font-inter">
    <!-- Назва та автор -->
    <div class="mb-5">
      <h2 class="text-[18px]">{{ content.title }}</h2>
      <p class="text-[16px]">{{ content.artist }}</p>
    </div>

    <!-- Текст лірики -->
    <div class="text-[16px] mb-4 whitespace-pre-wrap">
      {{ content.lyricsText }}
    </div>

    <!-- Кнопка Read more -->
    <button
      class="inline-flex items-center gap-[5px] px-[13px] py-[8px] bg-[#6D01D0]/20 text-[#6D01D0] hover:bg-[#000C9C]/40 text-[16px] font-medium rounded-[5px] transition"
    >
      Read more
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.86084 5.18829H9.6452M9.6452 5.18829L5.253 0.796143M9.6452 5.18829L5.253 9.58046"
          stroke="#6D01D0"
          stroke-width="1.2549"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  content: {
    title: string;
    artist: string;
    lyricsText: string;
  };
}>();
</script>
