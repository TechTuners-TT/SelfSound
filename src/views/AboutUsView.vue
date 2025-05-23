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
          TechTuners
        </div>

        <div
          class="inter-font text-white font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] mt-[15px] sm:mt-[20px]md:mt-[25px] lg:mt-[30px] xl:mt-[35px] 2xl:mt-[40px] mb-[50px] sm:mb-[70px] md:mb-[90px] lg:mb-[110px] xl:mb-[130px] 2xl:mb-[150px]"
        >
          We’re a small team of four people based in Ukraine.
          <br />
          We’re not a company with departments and roadmaps. We’re just a group
          of people learning, experimenting, and building digital things that
          feel worth making. <br />Sometimes that means tools, sometimes
          platforms — always something we’d want to use ourselves. <br />We
          don’t have investors or PR plans. We work at our own pace, figure
          things out as we go, and treat every project as a way to explore
          what’s possible, not just what’s profitable. <br />Our team: <br />
          – Team lead / frontend developer / designer <br />
          Focuses on product direction, interface design, and building UI
          components. <br />@leadname — portfolio / socials <br />– Backend
          developer <br />
          Handles core logic, API structure, database, and system behavior.
          <br />@backendguy — GitHub / LinkedIn <br />– DevOps & frontend
          developer <br />
          Works across deployment, system reliability, and contributes to
          frontend features. <br />@devopsdude — blog / GitHub <br />– Frontend
          developer <br />
          Focuses on implementing UI logic and refining user experience.
          <br />@frontendgal — personal site / Twitter <br />Our background is
          technical, but we care about the experience — how things feel, how
          people use them, and how they grow over time. <br />We started
          SelfSound as one of our first collaborative platforms, but it won’t be
          the last. <br />We’re building things slowly, carefully, and with
          purpose — because we enjoy it. <br />We know not everything will be
          perfect from the start. It doesn’t have to be. For us, progress means
          trying, adjusting, learning. <br />If something we make resonates with
          even a few people — that’s enough reason to keep going.
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
