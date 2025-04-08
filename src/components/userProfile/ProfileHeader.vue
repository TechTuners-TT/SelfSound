<template>
  <section class="flex flex-col gap-1">
    <div class="flex flex-col sm:flex-row gap-19 items-center sm:items-start">
      <div class="relative h-[84px] w-[84px]">
        <img
          :src="user.avatarUrl"
          :alt="user.name"
          class="w-[84px] h-[84px] rounded-full"
        />
        <div
          class="absolute inset-0 rounded-full border border-white border-opacity-50"
        ></div>
      </div>
      <div class="flex flex-col gap-2.5 text-center sm:text-left ">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          {{ user.name }}
        </h1>
        <p class="text-base font-medium text-white">{{ user.username }}</p>
      </div>
    </div>
    <div   
      class="flex gap-4 sm:gap-16 items-center justify-center sm:justify-start gap-15"
    >
      <button
        class=" h-8 text-sm sm:text-base text-white rounded-xl border bg-slate-900 border-white border-opacity-50 w-[100px]" style="background-color:rgba(2, 3, 61, 1)"
      >
        Add tag  
      </button>
      <p class="grow shrink self-stretch my-auto w-[380px] text-white">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis.
    </p> </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    username: string;
    avatarUrl: string;
  };
}>();
</script>
