<template>
  <main class="bg-[#060310] w-full h-full">
    <div
      class="px-[15px] sm:px-[20px] md:px-[25px] lg:px-[30px] xl:px-[40px] 2xl:px-[50px]"
    >
      <div
        class="flex items-center mt-[35px] sm:mt-[40px] md:mt-[50px] lg:mt-[55px] xl:mt-[60px] 2xl:mt-[70px] select-none w-[51.7px] sm:w-[59.4px] md:w-[67px] lg:w-[74.7px] xl:w-[82.4px] 2xl:w-[90px] cursor-pointer"
        @click="goBack"
      >
        <div>
          <svg
            class="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] xl:w-[22px] xl:h-[22px] 2xl:w-[24px] 2xl:h-[24px]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 22 7 12 17 2"
            />
          </svg>
        </div>

        <div
          class="inter-font text-white font-normal flex items-center justify-center leading-[14px] text-[14px] sm:leading-[16px] sm:text-[16px] md:leading-[18px] md:text-[18px] lg:leading-[20px] lg:text-[20px] xl:leading-[22px] xl:text-[22px] 2xl:leading-[24px] 2xl:text-[24px] ml-[5px] sm:ml-[6px] md:ml-[7px] lg:ml-[8px] xl:ml-[9px] 2xl:ml-[10px]"
        >
          Back
        </div>
      </div>

      <div
        class="mt-[50px] sm:mt-[60px]md:mt-[70px] lg:mt-[80px] xl:mt-[90px] 2xl:mt-[106px] mx-[51.7px] sm:mx-[59.4px] md:mx-[67px] lg:mx-[74.7px] xl:mx-[82.4px] 2xl:mx-[90px]"
      >
        <div
          class="inter-font text-white font-semibold leading-[30px] text-[20px] sm:leading-[36px] sm:text-[24px] md:leading-[42px] md:text-[28px] lg:leading-[51px] lg:text-[34px] xl:leading-[57px] xl:text-[38px] 2xl:leading-[63px] 2xl:text-[42px]"
        >
          Premium feature
        </div>

        <div
          class="inter-font text-white font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] mt-[15px] sm:mt-[20px]md:mt-[25px] lg:mt-[30px] xl:mt-[35px] 2xl:mt-[40px] mb-[50px] sm:mb-[70px] md:mb-[90px] lg:mb-[110px] xl:mb-[130px] 2xl:mb-[150px] xl:pr-5 2xl:pr-10 [@media(min-width:1750px)]:pr-15 [@media(min-width:1800px)]:pr-21"
        >
          Premium is not a destination — not yet. It’s more like a horizon:
          always present, not always in reach, but constantly influencing the
          direction in which we move. We’ve reserved this space for something
          that doesn’t exist in full just yet. That may sound vague — and it is,
          intentionally. Because this isn’t about a checklist of perks or
          features. It’s about possibility, about designing a layer of
          experience that speaks in quieter ways.
          <br />What makes something feel elevated? Maybe it’s not more buttons,
          but less noise. Not more content, but clearer presence. We’re
          interested in exploring those kinds of questions. Premium, for us, is
          a frame — not the painting itself. And frames evolve depending on what
          they’re meant to hold. <br />Some things take shape quickly. Others
          require space to breathe before they reveal themselves. This is one of
          those others. We’re sitting with ideas, testing fragments, letting
          intentions settle before we name them out loud. <br />We know that
          Premium can mean access, priority, advantage — and maybe, eventually,
          it will. But right now, Premium is the placeholder for depth. For
          things that aren’t always easy to define, but are felt when they
          arrive. <br />So if you’ve found this page and wondered what you’re
          missing — the answer is: nothing yet. And maybe that’s the point.
          You’re here early. That’s worth something. <br />In time, this space
          will grow into itself. And when it does, we hope it will feel not like
          a product we made, but like a decision we arrived at — together.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
function goBack() {
  window.history.back();
}
</script>
<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
