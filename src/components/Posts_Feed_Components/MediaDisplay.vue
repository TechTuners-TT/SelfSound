<template>
  <div class="w-full">
    <!-- Caption -->
    <div v-if="caption" class="mb-3 text-white text-sm">
      {{ caption }}
    </div>

    <!-- Media Grid -->
    <div
      :class="[
        'grid gap-2 rounded-lg overflow-hidden',
        getGridClass(content.items.length),
      ]"
    >
      <div
        v-for="(item, index) in content.items"
        :key="index"
        class="relative group cursor-pointer"
        @click="openModal(item)"
      >
        <!-- Image -->
        <img
          v-if="item.type === 'image'"
          :src="item.src"
          :alt="`Media ${index + 1}`"
          class="w-full h-full object-cover hover:opacity-90 transition-opacity"
          :class="getItemClass(content.items.length, index)"
        />

        <!-- Video -->
        <video
          v-else
          :src="item.src"
          class="w-full h-full object-cover"
          :class="getItemClass(content.items.length, index)"
          muted
          preload="metadata"
        >
          <source :src="item.src" type="video/mp4" />
        </video>

        <!-- Video Play Overlay -->
        <div
          v-if="item.type === 'video'"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"
        >
          <svg
            class="w-12 h-12 text-white opacity-80"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Modal for full-screen view -->
    <div
      v-if="selectedMedia"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="relative max-w-4xl max-h-full">
        <button
          @click="closeModal"
          class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center"
        >
          ×
        </button>

        <!-- Full-screen Image -->
        <img
          v-if="selectedMedia.type === 'image'"
          :src="selectedMedia.src"
          :alt="'Full size media'"
          class="max-w-full max-h-full object-contain rounded-lg"
        />

        <!-- Full-screen Video -->
        <video
          v-else
          :src="selectedMedia.src"
          controls
          autoplay
          class="max-w-full max-h-full object-contain rounded-lg"
        >
          <source :src="selectedMedia.src" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface MediaItem {
  src: string;
  type: "image" | "video";
  id?: string;
}

interface MediaContent {
  mediaType: "media";
  items: MediaItem[];
}

defineProps<{
  content: MediaContent;
  caption?: string;
}>();

const selectedMedia = ref<MediaItem | null>(null);

const openModal = (item: MediaItem) => {
  selectedMedia.value = item;
};

const closeModal = () => {
  selectedMedia.value = null;
};

// Grid layout based on number of items
const getGridClass = (count: number) => {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2";
  if (count === 4) return "grid-cols-2";
  return "grid-cols-3";
};

// Item styling based on position and count
const getItemClass = (count: number, index: number) => {
  const baseClass = "aspect-square";

  if (count === 1) return "aspect-video max-h-96";
  if (count === 2) return baseClass;
  if (count === 3) {
    return index === 0 ? "col-span-2 aspect-video" : baseClass;
  }
  if (count === 4) return baseClass;

  // For 5+ items, show first 4 and indicate more
  if (index < 4) return baseClass;
  return "hidden";
};
</script>
