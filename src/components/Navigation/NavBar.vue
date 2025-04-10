<template>
 

  <!-- Mobile top navigation - only visible on mobile -->
  <span class="hidden max-md:block">
    <nav
      class="fixed top-0 left-0 w-full h-[50px] px-2 py-3 flex justify-between items-center bg-[#060310] z-30"
      style="background-color: rgba(6, 3, 16, 1)"
    >
      <!-- Centered Header containing the 'S' -->
      <header
        class="text-[34px] w-[34px] h-[34px] text-center text-white capitalize  w-full flex justify-center items-center"
      >
        <span class="hidden max-md:block bebas_neue-font">S</span>
      </header>

      <!-- Right-aligned NavIcon -->
      <div
        class="max-md:order-3 max-md:absolute max-md:bottom-3 max-md:right-4"
      >
        <span class="hidden max-md:block"><NavIcon :svg="settingsIcon" /></span>
      </div>
    </nav>
  </span>

  <span class="max-md:hidden"></span>

  <!-- Main navigation - sidebar on desktop, bottom bar on mobile -->
  <nav      
    class="fixed left-0 h-screen [@media(min-width:1550px)]:w-[100px]  [@media(min-width:1550px)]:px-6.25 [@media(min-width:1550px)]:py-7.75  xl:w-[60px] xl:px-2.5 xl:py-5  lg:w-[60px] lg:px-2 lg:py-4    flex justify-center max-md:w-full max-md:h-auto md:w-[50px]  max-md:bottom-0 max-md:left-0 md:px-2 md:py-3 md:py-3 max-md:z-50 
         "
    style="background-color: rgba(6, 3, 16, 1);"
  >
    <div
      class="flex flex-col justify-between items-center h-full w-[50px] min-h-full max-md:w-full max-md:h-auto max-md:flex-row max-md:items-center max-md:justify-between - sm:w-[0px] md:w-[50px]"
    >
      <!-- Logo: Hidden on small screens but panel maintains height -->
      <header class="flex items-center justify-center w-[50px] h-[34px]  2xl:text-[46px] xl:text-[40px] lg:text-[38px] md:text-[36px]  text-white leading-none">
        
        <span class="hidden max-md:block"></span>
        <span class="  max-md:hidden  bebas_neue-font  ">S</span>
      </header>

      <!-- Center: buttons centered at bottom (only for mobile) -->
      <section
        class="flex flex-col gap-7.5 items-center max-md:flex-row max-md:gap-5 max-md:absolute max-md:bottom-3 max-md:left-1/2 max-md:-translate-x-1/2 max-md:order-2 max-sm:gap-5"
      >
        <NavIcon :svg="searchIcon" />
        <NavIcon :svg="homeIcon" />
        <NavIcon :svg="addPostIcon" />
        <NavIcon :svg="notificationsIcon" />
        <NavIcon :svg="profileIcon" />
      </section>

      <div
        class="mb-0 max-md:order-3 max-md:absolute max-md:bottom-3 max-md:right-4"
      >
        <span class="hidden max-md:block"></span>
        <span class="max-md:hidden"><NavIcon :svg="settingsIcon" /></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import NavIcon from "@/components/Navigation/NavIcon.vue";
import {
  searchIcon,
  homeIcon,
  addPostIcon,
  notificationsIcon,
  profileIcon,
  settingsIcon
} from "@/components/SVG/Authentication/NavBarIcon";
</script>
<style scoped>



</style>