<template>
  <main class="bg-[#060310] w-full h-full">
    <div
      class="px-[15px] sm:px-[20px] md:px-[25px] lg:px-[30px] xl:px-[40px] 2xl:px-[50px]"
    >
      <div
        class="flex items-center mt-[70px] select-none w-[51.7px] sm:w-[59.4px] md:w-[67px] lg:w-[74.7px] xl:w-[82.4px] 2xl:w-[90px] cursor-pointer"
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
        class="mt-[50px] sm:mt-[60px]md:mt-[70px] lg:mt-[80px] xl:mt-[90px] 2xl:mt-[106px] ml-[51.7px] sm:ml-[59.4px] md:ml-[67px] lg:ml-[74.7px] xl:ml-[82.4px] 2xl:ml-[90px] mr-[53.7px] sm:mr-[61.4px] md:mr-[69px] lg:mr-[76.7px] xl:mr-[84.4px] 2xl:mr-[92px]"
      >
        <div
          class="inter-font text-white font-semibold leading-[30px] text-[20px] sm:leading-[36px] sm:text-[24px] md:leading-[42px] md:text-[28px] lg:leading-[51px] lg:text-[34px] xl:leading-[57px] xl:text-[38px] 2xl:leading-[63px] 2xl:text-[42px]"
        >
          Support
        </div>

        <div
          class="inter-font text-white font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] mt-[15px] sm:mt-[20px]md:mt-[25px] lg:mt-[30px] xl:mt-[35px] 2xl:mt-[40px] mb-[50px] sm:mb-[70px] md:mb-[90px] lg:mb-[110px] xl:mb-[130px] 2xl:mb-[150px]"
        >
          If you’re experiencing a technical issue, encountering unexpected
          behavior, or simply have a question related to the platform — this is
          the place to reach out.
          <br />You can contact us via email: selfsoundtechnicalsup@gmail.com
          <br />Please describe the issue clearly. Include details such as:
          <br />– What happened <br />
          – What you expected to happen <br />– Device, browser or app version
          (if relevant) <br />
          – Any screenshots or error messages <br />This helps us understand and
          respond more effectively. <br />We aim to reply within a reasonable
          timeframe, but actual response time may vary depending on the
          complexity and volume of inquiries. We do not guarantee immediate
          replies. <br />At this time, we do not offer live chat or phone
          support. All communication should go through the provided email
          address. <br />Note: Feature requests and general feedback are also
          welcome. While we cannot promise implementation or direct follow-up,
          all input is recorded and reviewed periodically. Please refrain from
          sending duplicate messages — this won’t accelerate the process and may
          cause further delays. <br />This support channel is dedicated to
          account-related matters, technical questions, and content concerns.
          For anything else, please wait for future updates or dedicated contact
          points. <br />Please keep in mind: we're currently a small team. We
          read everything, but we can't always respond as quickly as we’d like.
          Your patience is appreciated — and genuinely helps.
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
