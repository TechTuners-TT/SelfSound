<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->
    <main class="flex flex-col flex-grow overflow-auto">
      <!-- Nav Bar Top -->
      <div class="h-[40px]">
        <p
          class="2xl:text-[24px] xl:text-[24px] lg:text-[20px] text-[16px] font-bold text-white inter-font"
        >
          NavBar Top - 40px
        </p>
        <div class="relative h-full">
          <!-- Декоративна лінія -->
          <hr
            class="absolute bottom-0 left-0 w-full border-t-2 border-red-500"
          />
        </div>
      </div>

      <!-- MAIN CONTENT -->

      <div class="flex-grow">
        <SettingsCont />
      </div>

      <!-- Nav Bar Bottom -->
      <div class="h-[80px]">
        <div class="relative h-full">
          <!-- Декоративна лінія -->
          <hr class="absolute top-0 left-0 w-full border-t-2 border-red-500" />
          <p
            class="2xl:text-[24px] xl:text-[24px] lg:text-[20px] text-[16px] font-bold text-white inter-font"
          >
            NavBar Bottom - 80px
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SettingsCont from "../components/SettingsPage/SettingsContainer.vue";
</script>
