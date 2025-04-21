<template>
  <section class="flex flex-col items-center gap-5 max-w-[560px] w-full ">
    <div
      class="flex flex-row gap-19 items-center sm:items-start w-full h-[84px] "
    >
    <div class="relative w-[84px] h-[84px] max-sm:w-[60px] max-sm:h-[60px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] lg:w-[72px] lg:h-[72px] xl:w-[84px] xl:h-[84px]">
  <img
    :src="user.avatarUrl"
    :alt="user.name"
    class="rounded-full w-full h-full"
  />
        <div
          class="absolute inset-0 rounded-full border border-white border-opacity-50"
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
          class="text-base font-medium text-white w-full w-full h-[12px] text-[16px] inter-font"
          style="font-weight: 500"
        >
          {{ user.login }}
        </p>
      </div>
    </div>
    <div
      class="flex gap-4 items-center justify-center sm:justify-start gap-15 w-full h-[54px]"
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
    gap: 50px;
  }
  .gap-15 {
    gap: 52px;
  }
  .text-\[30px\] {
    font-size: 28px;
  }
  .text-\[16px\] {
    font-size: 15px;
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
    gap: 8px;
  }
  .gap-19 {
    gap: 41.5px;
  }
  .gap-15 {
    gap: 45px;
  }
  .text-\[30px\] {
    font-size: 24px;
  }
  .text-\[16px\] {
    font-size: 14px;
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
    gap: 6px;
  }

  .w-\[560px\] {
    width: 350px;
  }

  .gap-19 {
    gap: 53px;
  }
  .gap-15 {
    gap: 52px;
  }
  .w-\[100px\] {
    width: 149.5px;
  }
  .h-\[54px\] {
    height: 46px;
  }

  .text-\[30px\] {
    font-size: 20px;
  }
  .text-\[16px\] {
    font-size: 13px;
  }
  .h-8 {
    height: 30px;
  }
  .biographyinput{
    font-size: 12px;
  }

}

@media (max-width: 768px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
  }

  .w-\[560px\] {
    width: 100%;
  }

  .w-\[400px\] {
    width: 100%;
  }

  .h-\[54px\] {
    height: 44px;
  }

  .text-\[30px\] {
    font-size: 18px;
  }

  .text-\[16px\] {
    font-size: 12px;
  }
  .text-\[\30px\] {
    font-size: 24px;
  }

  .gap-19 {
    gap: 45px;
  }
  .gap-15 {
    gap: 44px;
  }
  .w-\[100px\] {
    width: 110px;
  }
  .biographyinput {
    width: 350px;
  }

  .text-base {
    font-size: 14px;
  }
  .gap-5 {
    gap: 4px;
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
    font-size: 11px;
  }

  .h-\[54px\] {
    height: 41px;
  }

  .gap-19 {
    gap: 38px;
  }

  .gap-5 {
    gap: 2px;
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
@media (max-width: 480px) {
  section {
    padding-left: 0px;
    padding-right: 0px;
  }
  .w-\[100px\] {
    width: 64px;
  }
}
@media (max-width: 479.5px) {
  section {
    padding-left: 40px;
    padding-right: 40px;
  }
  .w-\[100px\] {
    width: 64px;
  }
}

@media (max-width: 450px) {
  .gap-5 {
    gap: 1px;
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
  .text-\[16px\] {
    font-size: 10px;
  }
  .gap-15 {
    gap: 30px;
  }
  .w-\[100px\] {
    width: 60px;
  }
  .biographyinput {
    width: 190px;
  }
  .h-8 {
    height: 24px;
  }
  section {
    padding-left: 50px;
    padding-right: 50px;
  }
}


@media (max-width: 400px) {
  section {
    padding-left: 40px;
    padding-right: 40px;
  }
}
@media (max-width: 380px) {
  section {
    padding-left: 30px;
    padding-right: 30px;
  }
}


</style>
