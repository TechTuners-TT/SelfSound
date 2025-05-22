<template>
  <div class="relative">
    <!-- Карусель зі скролом у стилі прикладу -->
    <div class="scroll-wrapper">
      <div class="scroll-content">
        <div
          v-for="(item, index) in content.items"
          :key="index"
          class="media-item"
        >
          <template v-if="isImage(item.src)">
            <img :src="item.src" class="media" />
          </template>
          <template v-else>
            <div class="relative w-full h-[400px] rounded-xl overflow-hidden">
              <video
                :src="item.src"
                class="media"
                muted
                playsinline
                preload="metadata"
              />
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

    <!-- Модальне вікно для відео -->
    <div
      v-if="modalIndex !== null"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="max-w-5xl w-full px-4">
        <video
          :src="content.items[modalIndex].src"
          class="w-full max-h-[80vh] rounded-xl"
          controls
          autoplay
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  content: {
    items: { src: string; caption?: string }[];
  };
}>();

const modalIndex = ref<number | null>(null);

const openModal = (index: number) => {
  modalIndex.value = index;
};

const closeModal = () => {
  modalIndex.value = null;
};

const isImage = (src: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(src);
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

/* ✅ Кастомний скрол */
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
</style>
