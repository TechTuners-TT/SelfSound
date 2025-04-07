<template>
    <section>
      <div
        class="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-16 items-center mt-5"
      >
        <button
          class="px-5 py-2.5 h-8 text-sm sm:text-base text-white rounded-xl border bg-slate-900 border-white border-opacity-50 w-[100px]"
        >
          Add tag
        </button>
        <div
          class="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center"
        >
          <span class="text-sm sm:text-base font-medium text-white"
            >{{ profileData.postsCount }} posts</span
          >
          <span class="text-sm sm:text-base font-medium text-white"
            >Listeners: {{ profileData.listenersCount }}</span
          >
          <span class="text-sm sm:text-base font-medium text-white"
            >Listened to: {{ profileData.listenedToCount }}</span
          >
        </div>
      </div>
      <button
        class="px-5 py-2.5 mt-6 sm:mt-7 md:mt-8 lg:mt-9 h-8 text-sm sm:text-base text-white rounded-xl border shadow-sm bg-gray-950 border-white border-opacity-50 w-full max-w-[400px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[513px]"
      >
        Edit profile
      </button>
      <div
        class="mt-10 sm:mt-12 md:mt-16 lg:mt-18 xl:mt-20 w-full h-px bg-white bg-opacity-50"
      ></div>
    </section>
  </template>
  
  <script lang="ts">
  import { defineComponent, type PropType } from "vue";
  
  // Define the type directly in this component to avoid import issues
  interface ProfileData {
    name: string;
    username: string;
    avatarUrl: string;
    postsCount: number;
    listenersCount: number;
    listenedToCount: number;
    aboutMe: string;
  }
  
  export default defineComponent({
    name: "ProfileStats",
    props: {
      profileData: {
        type: Object as PropType<ProfileData>,
        required: true,
      },
    },
  });
  </script>
  