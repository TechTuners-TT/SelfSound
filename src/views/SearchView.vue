<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->
    <main class="flex flex-col flex-grow overflow-auto">
      <!-- Nav Bar -->
      <NavBar />

      <!-- Search Content -->
      <div class="flex-grow max-h-full">
        <div class="relative flex items-start justify-center w-full h-full">
          <div
            class="relative flex w-full md:w-1/2 xl:w-1/3 bg-black/30 flex-col min-h-screen overflow-y-auto"
          >
            <UserSearch />
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import NavBar from "../components/Navigation/NavBar.vue";
import UserSearch from "@/components/Search/UserSearch.vue";
</script>
