<template>
  <div class="flex gap-19 iteam-centere mt-10">
    <div
      class="relative w-[84px] h-[84px] max-sm:w-[60px] max-sm:h-[60px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] lg:w-[72px] lg:h-[72px] xl:w-[84px] xl:h-[84px]"
    >
      <img
        :src="user.avatarUrl"
        :alt="user.name"
        class="rounded-full w-full h-full"
      />
      <div
        class="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.5)]"
      ></div>
    </div>
    <div class="flex flex-col gap-2.5 text-center text-left">
      <p
        class="font-bold text-white w-full h-[30px] text-[30px] inter-font"
        style="font-weight: 700"
      >
        {{ user.name }}
      </p>
      <p
        class="text-base font-medium text-white w-full h-[12px] text-[16px] inter-font"
        style="font-weight: 500"
      >
        {{ user.login }}
      </p>
    </div>
  </div>

  <div class="flex gap-4 items-center gap-15 h-[54px]">
    <div
      class="h-8 text-sm sm:text-base text-white rounded-[5px] h-8 text-[16px] inter-font"
      style="font-weight: 400; background-color: rgba(2, 3, 61, 1)"
    >
      {{ user.tag }}
    </div>
    <p
      class="grow shrink self-stretch my-auto biographyinput text-white text-[16px] inter-font"
      style="font-weight: 400; line-height: 1.125"
    >
      {{ user.biography }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    biography: string;
    tag?: string | "add tag";
  };
}>();
</script>
<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
