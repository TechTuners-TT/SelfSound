<template>
  <footer
    class="flex flex-col items-center mt-20 w-full max-md:mt-10 max-md:max-w-full"
  >
    <div class="px-5 py-0 max-w-full w-[1552px] max-md:px-4 max-md:py-0">
      <div
        class="flex flex-wrap gap-10 items-start text-white min-w-60 max-md:max-w-full"
      >
        <div class="text-7xl w-[278px] max-md:text-4xl">SelfSound</div>
        <nav
          class="flex flex-wrap gap-10 items-start min-w-60 max-md:grid max-md:gap-10 max-md:max-w-full max-md:grid-cols-[1fr]"
          aria-label="Footer navigation"
        >
          <div class="w-[109px]">
            <h3 class="text-4xl">Creators</h3>
            <a href="#about" class="mt-12 text-2xl block max-md:mt-10">
              About Us
            </a>
          </div>
          <div class="w-[158px]">
            <h3 class="text-4xl">Useful Links</h3>
            <div class="mt-12 w-full text-2xl max-md:mt-10">
              <a href="#support" class="block">Support</a>
              <a href="#terms" class="mt-4 block">Terms of Use</a>
              <a href="#privacy" class="mt-4 block">Privacy Policy</a>
            </div>
          </div>
          <div class="w-[174px]">
            <h3 class="text-4xl">Communities</h3>
            <a href="#advertisers" class="mt-12 text-2xl block max-md:mt-10">
              For Advertisers
            </a>
          </div>
        </nav>
      </div>
      <div
        class="flex justify-between items-center mt-20 w-full max-md:flex-col-reverse max-md:gap-8 max-md:items-start max-md:mt-10"
      >
        <p class="text-base text-white">
          <span> © 2025 SelfSound. </span><br />
          <span>Illustration by Pablo Marquez Ouch!</span>
        </p>
        <div class="flex gap-6 items-center">
          <a href="#social1" aria-label="SelfSound social media">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/0e5cd4cd4ea342f79af0ee55b490f863/01c2d471500de5296ad6689abf42153b8edf20e0?placeholderIfAbsent=true"
              alt="Social media icon"
              class="object-contain overflow-hidden shrink-0 rounded-2xl aspect-square w-[70px] max-md:w-[50px]"
            />
          </a>
          <a href="#social2" aria-label="SelfSound social media">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/0e5cd4cd4ea342f79af0ee55b490f863/4e5127dfb04b556af665fa36c15440854e13df55?placeholderIfAbsent=true"
              alt="Social media icon"
              class="object-contain overflow-hidden shrink-0 rounded-2xl aspect-square w-[70px] max-md:w-[50px]"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// Footer component for the About page
</script>
