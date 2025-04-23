<template>
  <section
    class="flex overflow-hidden relative flex-col justify-center items-start w-full text-white hero-section"
    aria-labelledby="hero-heading"
  >
    <!-- Background Image -->
    <img
      src="@/components/SVG/About_SVG/HeroBackground.svg"
      alt="SelfSound hero background"
      class="object-cover absolute inset-0 w-full h-full"
      loading="lazy"
    />

    <!-- Content -->
    <div class="flex flex-col max-w-full z-10 content-container">
      <div class="w-full max-md:max-w-full text-container">
        <!-- Title -->
        <h2
          id="hero-heading"
          class="horizon-font font-bold text-left hero-title"
        >
          Self<br />Sound
        </h2>

        <!-- Subtitle -->
        <p class="mt-4 oswald-font uppercase hero-subtitle">
          a home for every voice in music
        </p>
      </div>

      <!-- Button -->
      <a
        href="#signup"
        class="overflow-hidden gap-2.5 text-2xl font-semibold bg-purple-700 flex justify-center rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300 hero-button"
      >
        Sign up for free
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const headerHeight = ref("0px");

onMounted(() => {
  const header = document.querySelector("header");
  if (header) {
    headerHeight.value = header.offsetHeight + "px";
  }

  window.addEventListener("resize", () => {
    if (header) {
      headerHeight.value = header.offsetHeight + "px";
    }
  });
});
</script>

<style scoped>
/* Font-face for Horizon */
@font-face {
  font-family: "Horizon";
  src: url("@/assets/fonts/horizon.otf") format("opentype");
  font-weight: normal;
  font-style: normal;
}

/* Hero Section */
.hero-section {
  height: calc(100vh - v-bind(headerHeight));
  position: relative;
  display: flex;
  box-sizing: border-box;
}

.hero-section img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

/* Content container */
.content-container {
  position: relative;
  max-width: 900px;
  width: 100%;
  z-index: 10;
  text-align: left;
  margin-left: 10vw;
}

/* Title styles */
.hero-title {
  font-size: clamp(48px, 8vw, 170px);
  line-height: 1;
  text-align: left;
}

/* Subtitle styles */
.hero-subtitle {
  font-size: clamp(18px, 2.6vw, 55px);
  line-height: 1.3;
  text-transform: uppercase;
}

/* Button styles */
.hero-button {
  font-size: clamp(16px, 1.3vw, 24px);
  padding: clamp(10px, 1.3vw, 16px) clamp(16px, 4vw, 28px);
  margin-top: clamp(12px, 2.6vw, 24px);
  width: fit-content;
}
</style>
