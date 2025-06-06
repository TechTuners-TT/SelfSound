<template>
  <div class="md:h-[0px] h-[50px] z-[9999]">
    <!-- Mobile top navigation - only visible on mobile -->
    <span class="hidden max-md:block">
      <nav
        class="fixed top-0 left-0 w-full h-[50px] px-2 flex justify-between items-center bg-[#060310] z-30"
        style="background-color: rgba(6, 3, 16, 1)"
      >
        <!-- Centered Header containing the 'S' -->
        <header
          class="text-[34px] h-[34px] text-center text-white capitalize w-full flex justify-center items-center"
        >
          <span class="hidden max-md:block bebas_neue-font"
            ><router-link to="/home">S</router-link></span
          >
        </header>

        <!-- Right-aligned NavIcon -->
        <div
          class="max-md:order-3 max-md:absolute max-md:top-1/2 max-md:right-4 transform max-md:-translate-y-1/2"
        >
          <router-link to="/settings">
            <span class="hidden max-md:block">
              <NavIcon
                :svg="settingsIcon"
                :isActive="currentPage === 'settings'"
              />
            </span>
          </router-link>
        </div>
      </nav>
    </span>

    <span class="max-md:hidden"></span>

    <!-- Main navigation - sidebar on desktop, bottom bar on mobile -->
    <nav
      class="fixed left-0 h-screen [@media(min-width:1537px)]:w-[100px] [@media(min-width:1537px)]:px-6.25 [@media(min-width:1537px)]:py-7.75 xl:w-[70px] xl:px-3.5 xl:py-5 lg:w-[60px] lg:px-3 lg:py-4 flex justify-center max-md:w-full max-md:h-auto md:w-[60px] max-md:bottom-0 max-md:left-0 md:px-3 md:py-3 max-md:z-50 [@media(max-width:767.5px)]:h-[60px]"
      style="background-color: rgba(6, 3, 16, 1)"
    >
      <div
        class="flex flex-col justify-between items-center h-full w-[50px] min-h-full max-md:w-full max-md:h-auto max-md:flex-row max-md:items-center max-md:justify-center sm:w-[0px] md:w-[50px] max-md:gap-0"
      >
        <!-- Logo: Hidden on small screens but panel maintains height -->
        <header
          class="flex items-center justify-center w-[50px] h-[34px] 2xl:text-[46px] xl:text-[40px] lg:text-[38px] md:text-[36px] text-white leading-none max-md:w-0 max-md:h-0"
        >
          <span class="hidden max-md:block"></span>
          <span class="max-md:hidden bebas_neue-font cursor-pointer"
            ><router-link to="/home">S</router-link></span
          >
        </header>

        <!-- Center: buttons centered at bottom (only for mobile) -->
        <section
          class="flex flex-col gap-[30px] items-center max-md:flex-row max-md:bottom-3 max-md:order-2"
        >
          <router-link to="/search">
            <NavIcon :svg="searchIcon" :isActive="currentPage === 'search'" />
          </router-link>

          <router-link to="/home">
            <NavIcon :svg="homeIcon" :isActive="currentPage === 'home'" />
          </router-link>

          <button
            :class="[
              'nav-button flex items-center justify-center w-full border rounded-[5px]',
              isAddPostOpen ? 'bg-[#000C9C] ' : 'bg-[#6D01D0]',
            ]"
            @click="openAddPost"
          >
            <NavIcon :svg="addPostIcon" :isActive="isAddPostOpen" />
          </button>

          <router-link to="/notifications">
            <NavIcon
              :svg="notificationsIcon"
              :isActive="currentPage === 'notifications'"
            />
          </router-link>

          <router-link to="/profile">
            <NavIcon :svg="profileIcon" :isActive="currentPage === 'profile'" />
          </router-link>
        </section>

        <div
          class="mb-0 max-md:order-3 max-md:absolute max-md:bottom-3 max-md:right-4"
        >
          <span class="hidden max-md:block"></span>
          <span class="max-md:hidden">
            <router-link to="/settings">
              <NavIcon
                :svg="settingsIcon"
                :isActive="currentPage === 'settings'"
              />
            </router-link>
          </span>
        </div>
      </div>
    </nav>
  </div>

  <!-- Modal itself -->
  <NavBarAddPostModal :isOpen="isAddPostOpen" @close="closeAddPost" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavIcon from "@/components/Navigation/NavIcon.vue";
import NavBarAddPostModal from "./NavBarAddPostModal.vue";
import {
  searchIcon,
  homeIcon,
  addPostIcon,
  notificationsIcon,
  profileIcon,
  settingsIcon,
} from "@/components/SVG/Nav_Bar_Icon/NavBarIcon";

import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const isAddPostOpen = ref(false);
const router = useRouter();
const route = useRoute();

const currentPage = ref(route.name || "home");

watch(
  () => route.name,
  (newName) => {
    if (newName) {
      currentPage.value = newName.toString();
      localStorage.setItem("currentPage", newName.toString());
    }
  },
  { immediate: true },
);

const openAddPost = () => {
  isAddPostOpen.value = !isAddPostOpen.value;
};

const closeAddPost = () => {
  isAddPostOpen.value = false;
};
</script>
<style scoped>
@media (max-width: 1536px) {
  .gap-\[30px\] {
    gap: 28px;
  }
}

@media (max-width: 1280px) {
  .gap-\[30px\] {
    gap: 26px;
  }
}

@media (max-width: 1024px) {
  .gap-\[30px\] {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .gap-\[30px\] {
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .gap-\[30px\] {
    gap: 30.2px;
  }
}
</style>
