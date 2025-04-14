<template>
  <section class="flex flex-col gap-5">
    <div
      class="flex flex-row gap-19 items-center sm:items-start w-[560px] h-[84px]"
    >
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
      <div class="flex flex-col gap-2.5 text-center text-left">
        <p
          class="font-bold text-white w-[400px] h-[30px] text-[30px] inter-font"
          style="font-weight: 700"
        >
          {{ user.name }}
        </p>
        <p
          class="text-base font-medium text-white w-[400px] h-[12px] text-[16px] inter-font"
          style="font-weight: 500"
        >
          {{ user.login }}
        </p>
      </div>
    </div>
    <div
      class="flex gap-4 items-center justify-center sm:justify-start gap-15 w-[560px] h-[54px]"
    >
      <button
        class="cursor-pointer h-8 text-sm sm:text-base text-white rounded-xl border bg-slate-900 border border-[rgba(255,255,255,0.5)] w-[100px] text-[16px] inter-font"
        style="font-weight: 400; background-color: rgba(2, 3, 61, 1)"
      >
        Add tag
      </button>
      <p
        class="grow shrink self-stretch my-auto w-[400px] biographyinput text-white text-[16px] inter-font"
        style="font-weight: 400; line-height: 1.125"
      >
        {{ user.biography }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    biography: string;
  };
}>();
</script>
<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}

@media (max-width: 1536px) {
  .gap-5 {
    gap: 18px;
  }
  .gap-19 {
    gap: 68px;
  }
  .gap-15 {
    gap: 52px;
  }
  .text-\[30px\] {
    font-size: 28px;
  }
  .text-\[16px\] {
    font-size: 15.5px;
  }
  .h-8 {
    height: 32px;
  }
  .h-\[54px\] {
    height: 50px;
  }
}

@media (max-width: 1280px) {
  .gap-5 {
    gap: 18px;
  }
  .gap-19 {
    gap: 61px;
  }
  .gap-15 {
    gap: 45px;
  }
  .text-\[30px\] {
    font-size: 24px;
  }
  .text-\[16px\] {
    font-size: 15px;
  }
  .h-8 {
    height: 30px;
  }
  .h-\[54px\] {
    height: 48px;
  }
}

@media (max-width: 1024px) {
  .gap-5 {
    gap: 16px;
  }
  .gap-19 {
    gap: 53px;
  }
  .gap-15 {
    gap: 47px;
  }
  .w-\[100px\] {
    width: 90px;
  }
  .h-\[54px\] {
    height: 46px;
  }

  .text-\[30px\] {
    font-size: 20px;
  }
  .text-\[16px\] {
    font-size: 14px;
  }
  .h-8 {
    height: 30px;
  }
}

@media (max-width: 768px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
  }
}

@media (max-width: 768px) {
  .w-\[560px\] {
    width: 100%;
  }

  .w-\[400px\] {
    width: 100%;
  }

  .h-\[84px\] {
    height: 84px;
  }

  .h-\[54px\] {
    height: 44px;
  }

  .text-\[30px\] {
    font-size: 18px;
  }

  .text-\[16px\] {
    font-size: 13px;
  }
  .text-\[\30px\] {
    font-size: 24px;
  }

  .gap-19 {
    gap: 45px;
  }
  .gap-15 {
    gap: 38px;
  }
  .w-\[100px\] {
    width: 90px;
  }
  .biographyinput {
    width: 350px;
  }

  .text-base {
    font-size: 14px;
  }
  .gap-5 {
    gap: 14px;
  }
  .h-8 {
    height: 28px;
  }
}

@media (max-width: 640px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
  }

  .w-\[400px\] {
    width: 300px;
  }

  .text-\[30px\] {
    font-size: 16px;
  }

  .text-\[16px\] {
    font-size: 12px;
  }

  .h-\[54px\] {
    height: 41px;
  }

  .gap-19 {
    gap: 38px;
  }

  .gap-5 {
    gap: 12px;
  }

  .gap-15 {
    gap: 38px;
  }
  .w-\[100px\] {
    width: 84px;
  }
  .biographyinput {
    width: 300px;
  }
  .h-8 {
    height: 26px;
  }
}

@media (max-width: 450px) {
  .gap-5 {
    gap: 10px;
  }
  .gap-19 {
    gap: 30px;
  }
  .w-\[400px\] {
    width: 190px;
  }
  .text-\[30px\] {
    font-size: 15px;
  }

  .gap-15 {
    gap: 30px;
  }
  .w-\[100px\] {
    width: 84px;
  }
  .biographyinput {
    width: 190px;
  }
  .h-8 {
    height: 24px;
  }
}
</style>
