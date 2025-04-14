<template>
  <!-- Content of this container will be full-screen -->
  <div class="relative w-full h-screen flex flex-col">
    <!-- Main content -->
    <main>
      <div class="h-[40px]">
        <p
          class="2xl:text-[24px] xl:text-[24px] lg:text-[20px] text-[16px] font-bold text-white inter-font"
        >
          NavBar Top - 40px
        </p>

        <div class="relative h-full">
          <!-- Your other content here -->

          <hr
            class="absolute bottom-0 left-0 w-full border-t-2 border-red-500"
          />
        </div>
      </div>
      <div>
        <SettingsCont />
      </div>

      <div class="h-[80px]">
        <div class="relative h-full">
          <!-- Your other content here -->

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
import { onMounted, ref, computed } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import TitleSection from "../components/SettingsPage/TitleSection.vue";
import SettingsCont from "../components/SettingsPage/SettingsContainer.vue";
</script>
