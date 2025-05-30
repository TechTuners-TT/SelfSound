<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <main class="flex flex-col flex-grow overflow-auto">
      <NavBar />
      <div class="flex-grow max-h-full">
        <div class="relative flex items-start justify-center w-full h-full">
          <div
            class="relative flex w-full md:w-3/5 xl:w-1/3 bg-black/30 flex-col min-h-screen overflow-y-auto"
          >
            <section>
              <HomeSwitch
                :activeTab="activeTab"
                @update:activeTab="activeTab = $event"
              />
            </section>
            <section>
              <!-- Use PostsFeed for "For You" tab -->
              <Feed v-if="activeTab === 'forYou'" feedType="forYou" />
              <!-- Use ListenedToFeed for "Listened To" tab -->
              <ListenedToFeed v-else />
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavBar from "../components/Navigation/NavBar.vue";
import HomeSwitch from "@/components/HomePage/HomeSwitch.vue";
import Feed from "@/components/Posts_Feed_Components/PostsFeed.vue";
import ListenedToFeed from "@/components/Posts_Feed_Components/ListenedToFeed.vue";

const activeTab = ref("forYou");
</script>
