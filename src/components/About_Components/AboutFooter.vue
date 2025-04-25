<template>
  <footer
    class="w-full text-white px-16 py-28 max-lg:px-12 max-md:px-6 max-md:py-16"
  >
    <div
      class="w-full max-w-[1440px] mx-auto flex flex-col gap-28 max-md:gap-14"
    >
      <!-- Верхня частина -->
      <div
        class="flex justify-between flex-wrap gap-16 max-md:flex-col max-md:gap-12"
      >
        <!-- Логотип -->
        <div class="text-7xl bebas_neue-font max-md:text-5xl">SelfSound</div>

        <!-- Навігація -->
        <nav
          class="flex gap-24 flex-wrap max-md:flex-col max-md:gap-10"
          aria-label="Footer navigation"
        >
          <div>
            <h3 class="oswald-font text-3xl max-md:text-2xl">Creators</h3>
            <ul
              class="font-inter mt-8 space-y-4 text-xl max-md:mt-5 max-md:text-lg"
            >
              <li><a href="#about">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 class="oswald-font text-3xl max-md:text-2xl">Useful Links</h3>
            <ul
              class="font-inter mt-8 space-y-4 text-xl max-md:mt-5 max-md:text-lg"
            >
              <li><a href="#support">Support</a></li>
              <li><a href="#terms">Terms of Use</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 class="oswald-font text-3xl max-md:text-2xl">Communities</h3>
            <ul
              class="font-inter mt-8 space-y-4 text-xl max-md:mt-5 max-md:text-lg"
            >
              <li><a href="#advertisers">For Advertisers</a></li>
            </ul>
          </div>
        </nav>

        <!-- Соціальні -->
        <div class="flex gap-8 max-md:mt-8">
          <a href="#social1" aria-label="Discord" class="social-btn">
            <img
              src="@/components/SVG/About_SVG/Socials_Discord.svg"
              alt="Discord"
              class="w-[72px] h-[72px] rounded-2xl max-md:w-[54px] max-md:h-[54px]"
            />
          </a>
          <a href="#social2" aria-label="Instagram" class="social-btn">
            <img
              src="@/components/SVG/About_SVG/Socials_Instagram.svg"
              alt="Instagram"
              class="w-[72px] h-[72px] rounded-2xl max-md:w-[54px] max-md:h-[54px]"
            />
          </a>
        </div>
      </div>

      <!-- Роздільник -->
      <div class="border-t border-white/10"></div>

      <!-- Копірайт -->
      <div
        class="font-inter text-base text-white/80 leading-relaxed max-md:text-sm"
      >
        © 2025 SelfSound. <br />
        Illustration by Pablo Marquez Ouch!
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// Footer component
</script>

<style scoped>
/* Hover color for all links */
a:hover {
  color: #6d01d0;
}

/* Social buttons animation */
.social-btn {
  display: inline-block;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}
.social-btn:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}
</style>
