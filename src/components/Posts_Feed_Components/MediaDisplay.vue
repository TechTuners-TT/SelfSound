<template>
  <div class="w-full">
    <!-- Caption -->
    <div v-if="caption" class="mb-3 text-white text-sm">
      {{ caption }}
    </div>

    <!-- Media Container -->
    <div class="relative">
      <!-- Single item - full width -->
      <div v-if="props.content.items.length === 1" class="w-full">
        <div
          v-for="(item, index) in props.content.items"
          :key="index"
          class="w-full"
        >
          <!-- Image -->
          <template v-if="item.type === 'image'">
            <img
              :src="item.src"
              :alt="`Media ${index + 1}`"
              class="single-media cursor-pointer hover:opacity-90 transition-opacity"
              @click="openModal(index)"
            />
          </template>

          <!-- Video -->
          <template v-else>
            <div class="relative w-full h-[400px] rounded-xl overflow-hidden">
              <video
                :src="item.src"
                class="single-media"
                muted
                playsinline
                preload="metadata"
              >
                <source :src="item.src" type="video/mp4" />
              </video>
              <div
                class="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
              >
                <button
                  @click.stop="openModal(index)"
                  class="w-14 h-14 rounded-full bg-[#6D01D0]/70 hover:bg-[#000C9C]/70 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Multiple items - horizontal scroll -->
      <div v-else class="scroll-wrapper">
        <div class="scroll-content">
          <div
            v-for="(item, index) in props.content.items"
            :key="index"
            class="media-item"
          >
            <!-- Image -->
            <template v-if="item.type === 'image'">
              <img
                :src="item.src"
                :alt="`Media ${index + 1}`"
                class="media cursor-pointer hover:opacity-90 transition-opacity"
                @click="openModal(index)"
              />
            </template>

            <!-- Video -->
            <template v-else>
              <div class="relative w-full h-[400px] rounded-xl overflow-hidden">
                <video
                  :src="item.src"
                  class="media"
                  muted
                  playsinline
                  preload="metadata"
                >
                  <source :src="item.src" type="video/mp4" />
                </video>
                <div
                  class="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
                >
                  <button
                    @click.stop="openModal(index)"
                    class="w-14 h-14 rounded-full bg-[#6D01D0]/70 hover:bg-[#000C9C]/70 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for full-screen view -->
    <div
      v-if="modalIndex !== null"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="relative max-w-5xl w-full">
        <button
          @click="closeModal"
          class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
        >
          ×
        </button>

        <!-- Full-screen Image -->
        <img
          v-if="props.content.items[modalIndex]?.type === 'image'"
          :src="props.content.items[modalIndex].src"
          :alt="'Full size media'"
          class="w-full max-h-[80vh] object-contain rounded-xl"
        />

        <!-- Full-screen Video -->
        <video
          v-else
          :src="props.content.items[modalIndex]?.src"
          class="w-full max-h-[80vh] rounded-xl"
          controls
          autoplay
        >
          <source
            :src="props.content.items[modalIndex]?.src"
            type="video/mp4"
          />
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

const props = defineProps<{
  content: MediaContent;
  caption?: string;
}>();

const modalIndex = ref<number | null>(null);

const openModal = (index: number) => {
  modalIndex.value = index;
};

const closeModal = () => {
  modalIndex.value = null;
};
</script>

<style scoped>
.scroll-wrapper {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 12px;
}

.scroll-content {
  display: flex;
  gap: 8px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* Firefox */
}

.scroll-content::-webkit-scrollbar {
  display: none;
}

/* Custom scrollbar for the wrapper */
.scroll-wrapper::-webkit-scrollbar {
  height: 4px;
}

.scroll-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #000c9c;
  border-radius: 4px;
}

.media-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  max-width: 300px;
}

.media {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

/* Single media item takes full width */
.single-media {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  max-width: none; /* Override any max-width constraints */
}
</style>
