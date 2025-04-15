<template>
  <main
    class="flex flex-col md:flex-row w-full bg-gray-950 min-h-screen relative"
  >
    <NavBar />
    <section
      class="flex flex-col flex-1 px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-16 md:ml-[100px] max-md:ml-0 max-md:pt-20 max-md:pb-24"
    >
      <!-- Profile information -->
      <div class="w-full max-w-8xl mx-auto">
        <ProfileHeader :profileData="profileData" />
        <ProfileStats :profileData="profileData" />

        <!-- About Me section for mobile/tablet - only visible on smaller screens -->
        <div class="md:hidden mt-10">
          <h2 class="text-base text-white font-semibold">ABOUT ME</h2>
          <p class="mt-4 text-base text-white">
            {{ profileData.aboutMe }}
          </p>
          <div
            class="mt-6 h-2 rounded-xl bg-[linear-gradient(270deg,#060310_16.17%,#000C9C_51.13%,#000C9C_61.01%,#6D01D0_92.17%)] w-full"
          ></div>
        </div>

        <!-- Content grids -->
        <ContentGrid
          :items="firstGridItems"
          title="All of Us"
          description="Photo included with lyrics........."
          class="mt-16 sm:mt-24 md:mt-36"
        />

        <ContentGrid
          :items="secondGridItems"
          class="mt-8 sm:mt-11 mb-20 md:mb-0"
        />
      </div>
    </section>

    <!-- About Me section for desktop - hidden on mobile/tablet -->
    <AboutMeSection :aboutText="profileData.aboutMe" class="hidden md:block" />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
import ProfileStats from "@/components/userProfile/ProfileStats.vue";
import ContentGrid from "@/components/userProfile/ContentGrid.vue";
import AboutMeSection from "@/components/userProfile/AboutMeSection.vue";

// Define types directly in this component to avoid import issues
interface ProfileData {
  name: string;
  username: string;
  avatarUrl: string;
  postsCount: number;
  listenersCount: number;
  listenedToCount: number;
  aboutMe: string;
}

interface ContentItem {
  id: string;
  type?: "Lyrics" | "Audio" | "Video";
  imageUrl?: string;
}

const profileData = ref<ProfileData>({
  name: "User Name",
  username: "user login",
  avatarUrl: "https://placehold.co/84x84/6D01D0/6D01D0",
  postsCount: 0,
  listenersCount: 0,
  listenedToCount: 0,
  aboutMe:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
});

// Create mock data for the content grids
const createGridItems = (count: number): ContentItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    type: i === 0 ? "Lyrics" : undefined,
  }));
};

const firstGridItems = ref<ContentItem[]>(createGridItems(5));
const secondGridItems = ref<ContentItem[]>(createGridItems(5));
</script>
