<template>
 

  <!-- Mobile top navigation - only visible on mobile -->
  <span class="hidden max-md:block">
    <nav
      class="fixed top-0 left-0 w-full h-[50px] px-6 py-7.5 flex justify-between items-center bg-[#060310] z-30"
      style="background-color: rgba(6, 3, 16, 1)"
    >
      <!-- Centered Header containing the 'S' -->
      <header
        class="text-[34px] w-[50px] h-[34px] text-center text-white capitalize  w-full flex justify-center items-center"
      >
        <span class="hidden max-md:block bebas">S</span>
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
    class="fixed left-0 h-screen w-[60px] px-6 py-7.5 flex justify-center max-md:w-full max-md:h-auto max-md:bottom-0 max-md:left-0 max-md:px-3 max-md:py-3 max-md:z-50"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <div
      class="flex flex-col justify-between items-center h-full w-[50px] min-h-full max-md:w-full max-md:h-auto max-md:flex-row max-md:items-center max-md:justify-between"
    >
      <!-- Logo: Hidden on small screens but panel maintains height -->
      <header class="flex items-center justify-center w-[50px] h-[34px] text-[34px] text-white leading-none">
        
        <span class="hidden max-md:block"></span>
        <span class="  max-md:hidden  bebas  ">S</span>
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
} from "@/components/SVG/NavBarIcon";
</script>
<style scoped>

.add-post-icon {
    fill: #6D01D0; 
}

.add-post-icon:hover {
    fill: #007BFF; 
}

.add-post-icon:hover .cross {
    fill: white; 
}


@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.bebas {
  font-family: 'Bebas Neue', sans-serif;
}

</style>