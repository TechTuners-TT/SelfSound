<template>
  <main class="bg-[#060310] w-full h-full">
    <div
      class="px-[15px] sm:px-[20px] md:px-[25px] lg:px-[30px] xl:px-[40px] [@media(min-width:1537px)]:px-[50px]"
    >
      <div
        class="flex items-center mt-[35px] sm:mt-[40px] md:mt-[50px] lg:mt-[55px] xl:mt-[60px] [@media(min-width:1537px)]:mt-[70px] select-none w-[51.7px] sm:w-[59.4px] md:w-[67px] lg:w-[74.7px] xl:w-[82.4px] [@media(min-width:1537px)]:w-[90px] cursor-pointer"
        @click="goBack"
      >
        <div>
          <svg
            class="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] xl:w-[22px] xl:h-[22px] [@media(min-width:1537px)]:w-[24px] [@media(min-width:1537px)]:h-[24px]"
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
          class="inter-font text-white font-normal flex items-center justify-center leading-[14px] text-[14px] sm:leading-[16px] sm:text-[16px] md:leading-[18px] md:text-[18px] lg:leading-[20px] lg:text-[20px] xl:leading-[22px] xl:text-[22px] [@media(min-width:1537px)]:leading-[24px] [@media(min-width:1537px)]:text-[24px] ml-[5px] sm:ml-[6px] md:ml-[7px] lg:ml-[8px] xl:ml-[9px] [@media(min-width:1537px)]:ml-[10px]"
        >
          Back
        </div>
      </div>

      <div
        class="mt-[50px] sm:mt-[60px] md:mt-[70px] lg:mt-[80px] xl:mt-[90px] [@media(min-width:1537px)]:mt-[106px] mx-[20px] sm:mx-[59.4px] md:mx-[67px] lg:mx-[74.7px] xl:mx-[82.4px] [@media(min-width:1537px)]:mx-[90px]"
      >
        <div
          class="inter-font text-white font-semibold leading-[30px] text-[20px] sm:leading-[36px] sm:text-[24px] md:leading-[42px] md:text-[28px] lg:leading-[51px] lg:text-[34px] xl:leading-[57px] xl:text-[38px] [@media(min-width:1537px)]:leading-[63px] [@media(min-width:1537px)]:text-[42px]"
        >
          For Advertisers
        </div>

        <div
          class="inter-font text-white font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] [@media(min-width:1537px)]:text-[20px] mt-[15px] sm:mt-[20px] md:mt-[25px] lg:mt-[30px] xl:mt-[35px] [@media(min-width:1537px)]:mt-[40px] mb-[50px] sm:mb-[70px] md:mb-[90px] lg:mb-[110px] xl:mb-[130px] [@media(min-width:1537px)]:mb-[150px] text-justify"
        >
          SelfSound is a growing platform for musicians, learners, and listeners
          who value connection, creativity, and community. We're building a
          space where music is more than just content — it’s a conversation. Our
          users come here to share, support, and discover in ways that feel
          intentional and authentic.
          <br />As we continue developing the platform, we’re exploring
          thoughtful ways to collaborate with partners who align with our
          values. We understand that advertising doesn’t have to be disruptive —
          it can be relevant, respectful, and even inspiring when done right.
          <br />We're open to working with:
          <ul class="list-disc list-inside custom-list">
            <li>
              Tools, services, and brands that support creative expression
            </li>
            <li>Music-related products and platforms</li>
            <li>Educational content or initiatives within the music space</li>
            <li>Community-first ideas that genuinely benefit users</li>
          </ul>
          We’re a small team from Ukraine, still shaping how ads or partnerships
          might fit into SelfSound. If you’re interested in being part of that
          conversation, we’d love to hear from you.
          <br />For inquiries, please reach out to us at
          selfsoundtechnicalsup@gmail.com <br />Let’s explore possibilities
          together — without compromising the experience that brings people here
          in the first place.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
function goBack() {
  window.history.back();
}

import { onMounted } from "vue";

onMounted(() => {
  window.scrollTo({ top: 0, behavior: "auto" });
});
</script>
<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
.custom-list li::marker {
  font-size: 0; /* ховаємо маркер */
}

.custom-list li {
  position: relative;
  padding-left: 21px; /* загальний лівий відступ */
}

.custom-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: white;
  font-size: 1em;
  width: 6px;
  display: inline-block;
  text-align: center;
  margin-left: 7px;
}

/* Для екранів 768px і більше */
@media (min-width: 768px) {
  .custom-list li {
    padding-left: 25px;
  }

  .custom-list li::before {
    width: 7px;
    margin-left: 9px;
  }
}

/* Для екранів 1024px і більше */
@media (min-width: 1024px) {
  .custom-list li {
    padding-left: 30px;
  }

  .custom-list li::before {
    width: 8px;
  }
}
</style>
