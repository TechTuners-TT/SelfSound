<template>
  <!-- Content of this container will be full-screen -->
  <div class="relative w-full h-screen flex flex-col">
    <!-- Main content -->
    <main>
      <div>
        <SettingsCont />
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
