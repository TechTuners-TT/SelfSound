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
          Terms of use
        </div>

        <div
          class="inter-font text-white font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] mt-[15px] sm:mt-[20px]md:mt-[25px] lg:mt-[30px] xl:mt-[35px] 2xl:mt-[40px] mb-[50px] sm:mb-[70px] md:mb-[90px] lg:mb-[110px] xl:mb-[130px] 2xl:mb-[150px]"
        >
          These Terms of Use govern your access to and use of SelfSound, a
          platform developed to support music creators, learners, and listeners.
          By using the platform, you agree to comply with these terms. If you do
          not agree with them, please do not use the service.
          <br />
          <br />1. Account & Access <br />To use core features of SelfSound
          (such as posting, commenting, or following others), you must create an
          account. You are responsible for keeping your credentials secure and
          for all activity that occurs under your account. <br />
          <br />2. Age Requirement <br />You must be at least 13 years old to
          create an account or use SelfSound. By registering, you confirm that
          you meet this requirement. <br />
          <br />3. Content Ownership <br />You own the content you upload
          (audio, lyrics, sheet music, etc.). <br />
          By posting on SelfSound, you give us permission to host, display, and
          distribute your content within the platform to provide the service.
          <br />We do not claim ownership of your work, and we won’t reuse it
          outside of the platform without your consent. <br />
          <br />4. Allowed Content <br />You may only upload content that you
          have the legal right to share. This includes original work, or work
          where you have explicit permission or proper licensing. <br />Don’t
          post anything illegal, abusive, hateful, or that violates the rights
          of others. We reserve the right to remove content that breaks these
          rules. <br /><br />5. Community Behavior <br />Respect others. You may
          not: <br />
          – Harass or target users <br />
          – Impersonate someone else <br />
          – Spam or promote irrelevant content <br />
          – Misuse reporting or reaction systems <br />
          – Interfere with platform functionality <br />Our moderation may take
          action in response to content or behavior that disrupts the platform
          or other users' experience. <br />
          <br />6. Platform Changes <br />SelfSound is under active development.
          Features may change, be removed, or behave differently over time. Some
          parts of the service may be experimental or temporarily unavailable.
          <br />We’ll do our best to communicate significant changes, but
          functionality is not guaranteed. <br />
          <br />7. Account Suspension <br />We reserve the right to suspend or
          disable accounts that violate these terms, cause harm to the
          community, or misuse the platform. <br />
          <br />8. Copyright Policy <br />If you believe content on SelfSound
          violates your copyright, you can contact us at
          selfsoundtechnicalsup@gmail.com. We’ll review and respond to valid
          claims in line with applicable laws. <br /><br />9. Privacy <br />We
          respect your privacy. Details about how we handle data will be
          provided in our upcoming Privacy Policy. For now, we only collect data
          necessary to operate the service and never sell your information.
          <br />
          <br />10. Feedback <br />We welcome ideas, suggestions, and bug
          reports. If you send us feedback, we may use it to improve the
          platform, but this doesn’t grant you any rights over how it’s
          implemented. <br /><br />11. Termination <br />You can delete your
          account at any time. If you do, your public content may remain visible
          unless explicitly removed. We may retain minimal data as required for
          platform integrity and legal purposes.
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
