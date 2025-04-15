<template>
  <header
    class="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-14 lg:gap-16 xl:gap-20 items-center sm:items-start"
  >
    <div
      class="relative h-[70px] w-[70px] sm:h-[75px] sm:w-[75px] md:h-[80px] md:w-[80px] lg:h-[84px] lg:w-[84px]"
    >
      <img
        :src="profileData.avatarUrl"
        :alt="profileData.name + ' profile'"
        class="w-full h-full rounded-full"
      />
      <div
        class="absolute inset-0 rounded-full border border-solid border-white border-opacity-50"
      ></div>
    </div>
    <div class="flex flex-col gap-1 text-center sm:text-left">
      <h1
        class="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white"
      >
        {{ profileData.name }}
      </h1>
      <p class="text-sm sm:text-base font-medium text-white">
        {{ profileData.username }}
      </p>
    </div>
  </header>
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
  name: "ProfileHeader",
  props: {
    profileData: {
      type: Object as PropType<ProfileData>,
      required: true,
    },
  },
});
</script>
