<template>
  <header
    class="bg-gray-950 text-white w-full"
    style="height: var(--header-height);"
  >
    <div
      class="flex justify-between items-center relative"
      style="padding: 0 5%; height: 100%;"
    >
      <!-- Логотип -->
      <h1
        class="bebas_neue-font"
        style="font-size: var(--logo-font-size);"
      >
        SelfSound
      </h1>

      <!-- Іконка гамбургер-меню -->
      <button
        class="block lg:hidden text-white focus:outline-none cursor-pointer"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <!-- Навігація -->
      <nav
        class="font-inter hidden lg:flex items-center space-x-10 h-full"
        aria-label="Main navigation"
      >
        <a href="#premium" class="hover:custom-hover font-normal text-[24px]">Premium</a>
        <a href="#support" class="hover:custom-hover font-normal text-[24px]">Support</a>
        <div class="w-px h-6 bg-white" aria-hidden="true"></div>
        <a href="#guest" class="hover:custom-hover font-normal text-[24px]">Guest mode</a>
        <a href="#login" class="hover:custom-hover font-normal text-[24px]">Log in</a>
        <a
          href="#signup"
          class="w-[140px] h-[50px] flex items-center justify-center px-6 py-2 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-200 text-[24px]"
        >
          Sign up
        </a>
      </nav>
    </div>

    <!-- Мобільне меню -->
    <div
      v-if="isMenuOpen"
      class="bg-gray-950 text-white px-10 py-5 space-y-4 lg:hidden"
      style="position: absolute; top: var(--header-height); left: 0; width: 100%; z-index: 9999;"
    >
      <a href="#premium" class="block hover:custom-hover">Premium</a>
      <a href="#support" class="block hover:custom-hover">Support</a>
      <a href="#guest" class="block hover:custom-hover">Guest mode</a>
      <a href="#login" class="block hover:custom-hover">Log in</a>
      <a href="#signup" class="block hover:custom-hover">Sign up</a>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Стан для відстеження відкриття мобільного меню
const isMenuOpen = ref(false);

// Функція для перемикання меню
const toggleMenu = () => {
  console.log("Toggle menu clicked");
  isMenuOpen.value = !isMenuOpen.value;
  console.log("Menu state:", isMenuOpen.value);
};
</script>

<style>
/* Змінні для висоти хедера та розміру тексту */
:root {
  --header-height: 100px;
  --logo-font-size: 48px;
}

/* Адаптивні налаштування */
@media (max-width: 1100px) {
  :root {
    --header-height: 80px;
    --logo-font-size: 40px;
  }
}

@media (max-width: 768px) {
  :root {
    --header-height: 70px;
    --logo-font-size: 36px;
  }
}

/* Hover effect for all buttons except "Sign up" */
a:not([href="#signup"]):hover {
  color: #6D01D0;
}

/* Hover effect for "Sign up" button */
a[href="#signup"]:hover {
  background-color: #6D01D0;
  color: #FFFFFF;
}
</style>