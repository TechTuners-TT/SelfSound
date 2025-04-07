<template>
    <section>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8"
      >
        <article
          v-for="(item, index) in items"
          :key="item.id"
          class="relative rounded-xl bg-zinc-300 h-[180px] sm:h-[200px] md:h-[220px] lg:h-[230px] xl:h-[250px] w-full"
        >
          <div
            v-if="item.type"
            class="absolute top-3 h-5 text-xs text-white bg-purple-700 rounded-md right-[13px] w-[69px]"
          >
            {{ item.type }}
          </div>
        </article>
      </div>
      <div v-if="title || description" class="mt-3.5">
        <h3 v-if="title" class="text-lg sm:text-xl font-semibold text-white">
          {{ title }}
        </h3>
        <p v-if="description" class="text-base sm:text-xl text-white">
          {{ description }}
        </p>
      </div>
    </section>
  </template>
  
  <script lang="ts">
  import { defineComponent, type PropType } from "vue";
  
  // Define the type directly in this component to avoid import issues
  interface ContentItem {
    id: string;
    type?: "Lyrics" | "Audio" | "Video";
    imageUrl?: string;
  }
  
  export default defineComponent({
    name: "ContentGrid",
    props: {
      items: {
        type: Array as PropType<ContentItem[]>,
        required: true,
      },
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
    },
  });
  </script>
  