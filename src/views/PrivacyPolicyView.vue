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
          Privacy policy
        </div>

        <div
          class="inter-font text-white font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] mt-[15px] sm:mt-[20px]md:mt-[25px] lg:mt-[30px] xl:mt-[35px] 2xl:mt-[40px] mb-[50px] sm:mb-[70px] md:mb-[90px] lg:mb-[110px] xl:mb-[130px] 2xl:mb-[150px]"
        >
          This Privacy Policy describes how SelfSound (“we”, “us”, or “our”)
          collects, uses, and protects your personal information. By using
          SelfSound, you agree to the terms outlined here. We care about privacy
          — and we collect only the minimum data needed to make the platform
          work.
          <br />
          <br />1. What We Collect <br />We only collect information necessary
          to run SelfSound and improve your experience. <br />We collect:
          <ul class="list-disc list-inside custom-list">
            <li>
              Account info: email address, username, and password (hashed).
            </li>
            <li>
              Profile details: optional info you choose to add, like a bio, role
              tag (artist, learner, listener), profile picture.
            </li>
            <li>
              Content: posts, comments, media files, feedback, and other
              activity you voluntarily share.
            </li>
            <li>
              Usage data: logs of basic interactions (e.g. post views, likes),
              device type, browser type — to understand how people use the
              platform.
            </li>
          </ul>
          We do not:
          <ul class="list-disc list-inside custom-list">
            <li>Track you across other websites.</li>
            <li>Collect unnecessary personal data.</li>
            <li>Use third-party ads or trackers.</li>
          </ul>
          <br />2. Why We Collect It <br />We use your data to:
          <ul class="list-disc list-inside custom-list">
            <li>Let you sign in and use your account</li>
            <li>Display your content to others</li>
            <li>Personalize your feed and interactions</li>
            <li>Improve platform performance and usability</li>
            <li>Detect abuse or spam</li>
          </ul>
          Everything we collect is strictly related to platform functionality
          and community safety.
          <br />
          <br />
          3. Cookies <br />We use essential cookies only — mainly to keep you
          logged in and remember your preferences. <br />We don’t use tracking
          cookies for advertising or third-party analytics.
          <br />
          <br />4. Who Can See Your Information <br />Your public profile,
          posts, and interactions (like comments and likes) are visible to other
          users. <br />Your email and password are never shared or visible.
          <br />You can control what you share on your profile and in your
          posts. If you want to remove content, you can delete it at any time
          from your account.
          <br />
          <br />5. Data Sharing <br />We do not sell or share your data with
          third parties. <br />We may share limited data:
          <ul class="list-disc list-inside custom-list">
            <li>
              With service providers that help us run the platform (e.g.
              hosting)
            </li>
            <li>If legally required (e.g. valid law enforcement request)</li>
            <li>To protect SelfSound, its users, or others from harm</li>
          </ul>
          Our service providers must follow strict rules and can only use the
          data to support the platform.
          <br /><br />6. Data Security <br />We take reasonable technical and
          organizational steps to protect your data:
          <ul class="list-disc list-inside custom-list">
            <li>Passwords are hashed using secure algorithms</li>
            <li>Access to backend systems is limited and monitored</li>
            <li>We regularly monitor the system for vulnerabilities</li>
          </ul>
          No system is 100% secure, but we’re committed to doing our best to
          keep your data safe.
          <br />
          <br />7. Data Retention <br />We keep your account information and
          content for as long as your account is active. <br />
          If you delete your account, most of your data will be removed. Some
          logs or system backups may temporarily retain basic information for
          technical or legal reasons, but it will be purged regularly.
          <br />
          <br />8. Your Rights <br />Depending on your country or region, you
          may have the right to:
          <ul class="list-disc list-inside custom-list">
            <li>Access the personal data we hold about you</li>
            <li>Correct or update inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Object to certain types of processing</li>
          </ul>
          If you want to request any of these, contact us at:
          privacy@selfsound.dev (placeholder) <br />
          <br />9. Changes to This Policy <br />We may update this Privacy
          Policy as the platform evolves. <br />
          If we make significant changes, we’ll do our best to notify users
          through the platform or email. <br />
          The latest version will always be available here. By continuing to use
          SelfSound, you agree to the current version. <br />
          <br />10. Contact Us <br />If you have questions or concerns about
          your privacy, feel free to contact us:
          <br />selfsoundtechnicalsup@gmail.com <br />We’re a small team, but we
          take privacy seriously and will respond as soon as possible.
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
