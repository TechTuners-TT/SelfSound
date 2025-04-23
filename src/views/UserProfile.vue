<!--
<template>
  <main
    class="flex flex-col md:flex-row w-full bg-gray-950 min-h-screen relative"
  >
    <NavBar />
    <section
      class="flex flex-col flex-1 px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-16 md:ml-[100px] max-md:ml-0 max-md:pt-20 max-md:pb-24"
    >
      Profile information
      <div class="w-full max-w-8xl mx-auto">
        <ProfileHeader :profileData="profileData" />
        <ProfileStats :profileData="profileData" />

         About Me section for mobile/tablet - only visible on smaller screens 
        <div class="md:hidden mt-10">
          <h2 class="text-base text-white font-semibold">ABOUT ME</h2>
          <p class="mt-4 text-base text-white">
            {{ profileData.aboutMe }}
          </p>
          <div
            class="mt-6 h-2 rounded-xl bg-[linear-gradient(270deg,#060310_16.17%,#000C9C_51.13%,#000C9C_61.01%,#6D01D0_92.17%)] w-full"
          ></div>
        </div>

         Content grids
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

     About Me section for desktop - hidden on mobile/tablet
    <AboutMeSection :aboutText="profileData.aboutMe" class="hidden md:block" />
  </main>
</template>
-->

<script setup lang="ts">
/*
// import { ref } from "vue";
// import NavBar from "../components/NavBar.vue";
// import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
// import ProfileStats from "@/components/userProfile/ProfileStats.vue";
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
*/
</script>
<template>
  <div></div>
  <!--
  <div
    class="relative w-full h-screen"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <main
      class="flex w-full h-screen overflow-x-hidden"
      style="background-color: rgba(6, 3, 16, 1)"
    >
      <NavBar />

      <section
        class="flex relative flex-col flex-1 [@media(min-width:1537px)]:mx-25 xl:mx-[70px] lg:mx-[60px] md:mx-[60px] sm:mx-[0px] h-screen"
        style="background-color: rgba(6, 3, 16, 1)"
      >
        <div
          class="items-center gap-10 flex flex-col h-full [@media(min-width:1537px)]:pt-16.25 xl:pt-14.25 lg:pt-12.25 md:pt-10.25 max-md:pt-22.25 mx-auto w-full max-w-[640px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[560px] 2xl:w-[640px]"
          style="background-color: rgba(0, 0, 0, 0.3)"
        >
          <ProfileHeader :user="user" />

          <ProfileStats :stats="stats" />
          <ProfileContent :user="user" @update:user="updateUser" />
        </div>
      </section>
    </main>
  </div>
    <div class="max-md:pb-20"></div> -->
</template>

<script setup lang="ts">
/*
import { reactive, ref, watch } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
import ProfileStats from "@/components/userProfile/ProfileStats.vue";
import ProfileContent from "@/components/userProfile/ProfileContent.vue";

interface User {
  name: string;
  login: string;
  avatarUrl: string;
  biography: string;
  tag?: string | null;
}

interface Stats {
  posts: number;
  listeners: number;
  listenedTo: number;
}

const user = reactive<User>({
  name: "User Name",
  login: "user login",
  avatarUrl:
    "https://cdn.builder.io/api/v1/image/assets/TEMP/3922534bd59dfe0deae8bd149c0b3cba46e3eb47?placeholderIfAbsent=true&apiKey=04fef95365634cc5973c2029f1fc78f5",
  biography: "Lorem ipsum dolor sit amet,consectetur adipiscing",
});

const stats = reactive<Stats>({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

const formData = reactive({
  name: user.name,
  login: user.login,
  biography: user.biography,
  selectedTag: user.tag || null,
});

const emit = defineEmits(["update:user"]);

const updateUser = (updatedUser: User) => {
  user.name = updatedUser.name;
  user.login = updatedUser.login;
  user.biography = updatedUser.biography;
  user.tag = updatedUser.tag;
};

const isModalOpen = ref(false);

const selectTag = (tag: string) => {
  formData.selectedTag = formData.selectedTag === tag ? null : tag;
};

const saveChanges = () => {
  emit("update:user", {
    ...user,
    name: formData.name,
    login: formData.login,
    biography: formData.biography,
    tag: formData.selectedTag,
  });
  isModalOpen.value = false;
};

watch(
  () => user,
  (newUser) => {
    formData.name = newUser.name || "";
    formData.login = newUser.login || "";
    formData.biography = newUser.biography || "";
    formData.selectedTag = newUser.tag || null;
  },
  { deep: true },
);
*/
</script>

<style scoped>
/* Ensure content is centered with equal margins */
@media (min-width: 768px) {
  section {
    max-width: calc(100% - 100px);
  }
}

.inter-font {
  font-family: "Inter", sans-serif;
}

/* Center the content container */
main {
  display: flex;
  justify-content: center;
}

@media (max-width: 1280px) {
  .gap-10 {
    gap: 2.25rem;
  }
}

@media (max-width: 1024px) {
  .gap-10 {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .gap-10 {
    gap: 1.8rem;
  }
}

@media (max-width: 640px) {
  section {
    max-width: 100%;
    margin: 0 10px; /* Adjust margin for small screens */
  }

  .py-4 {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .gap-10 {
    gap: 1.5rem;
  }
}

@media (max-width: 450px) {
  section {
    margin: 0 5px;
  }

  .py-4 {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .gap-10 {
    gap: 1.5rem;
  }
}
</style>
