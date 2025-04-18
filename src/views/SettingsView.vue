<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->
    <main class="flex flex-col flex-grow overflow-auto">
      <!-- MAIN CONTENT -->

      <!-- Nav Bar -->
      <div class="h-[0px]">
        <NavBar />
      </div>

      <!-- Settings Content -->
      <div class="flex-grow max-h-full">
        <SettingsCont />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SettingsCont from "../components/SettingsPage/SettingsContainer.vue";
import NavBar from "../components/Navigation/NavBar.vue";
</script>
