<template>
  <div class="m-[20px]">
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
      >
        Attach media files
      </h1>
    </div>

    <!-- Інпут для файлів -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*,video/*"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Прев’ю файлів з підтримкою зуму -->
    <div class="space-y-6 mb-6">
      <div
        v-for="(item, idx) in files"
        :key="idx"
        class="relative group cursor-pointer"
        @click="previewFile(item)"
      >
        <!-- Прев’ю зображення -->
        <img
          v-if="item.type.startsWith('image/')"
          :src="item.preview"
          class="zoomable-media w-full object-contain h-full rounded-lg"
        />

        <!-- Прев’ю відео -->
        <video
          v-else
          :src="item.preview"
          controls
          class="zoomable-media w-full object-contain max-h-[400px] rounded-lg"
        ></video>

        <button
          @click.stop="removeFile(idx)"
          class="bg-[#000000]/50 cursor-pointer absolute top-[8px] right-[8px] text-white text-[20px] rounded-[5px] w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] xl:w-[26px] xl:h-[26px] flex items-center justify-center"
        >
          <!--bg-white-->
          <MediaClose />
        </button>
      </div>
    </div>
    <!-- Кнопка додавання -->
    <button
      @click="triggerFileInput"
      :disabled="files.length >= 5"
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6 ',
        files.length >= 5
          ? 'bg-white/5 cursor-not-allowed'
          : 'bg-[#000C9C]/40 hover:bg-[#6D01D0]',
      ]"
    >
      <AddIcon
        class="2xl:w-[24px] 2xl:h-[24px] xl:w-[20px] xl:h-[20px] lg:w-[18px] lg:h-[18px] w-[16px] h-[16px]"
      />
    </button>
    <!-- Кнопка сабміту (відображається тільки якщо є файли) -->
    <div v-if="files.length > 0" class="flex justify-end mb-6">
      <button
        @click="submitPost"
        class="cursor-pointer w-[75px] sm:w-[80px] md:w-[85px] lg:w-[95px] xl:w-[105px] 2xl:w-[119px] 2xl:h-[37px] bg-[#6D01D0]/20 xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center text-[#6D01D0] inter-font [@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px]"
      >
        <a href="#home"> <p>Publish</p></a>
      </button>
    </div>

    <!-- Модалка з підтримкою зуму -->
    <div
      v-if="modalPreview"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-auto"
      @click.self="modalPreview = null"
    >
      <!-- Модалка, адаптивні розміри для екранів -->
      <div
        class="relative max-w-[90%] max-h-[90%] xl:w-[50vw] xl:h-[50vh] overflow-auto p-4"
      >
        <!-- Прев’ю зображення -->
        <img
          v-if="modalPreview?.type.startsWith('image/')"
          :src="modalPreview.preview"
          class="zoomable-media object-contain w-full h-full transform hover:scale-150 transition duration-300"
        />

        <!-- Прев’ю відео -->
        <video
          v-else
          :src="modalPreview.preview"
          controls
          autoplay
          class="zoomable-media object-contain w-full h-full transform hover:scale-125 transition duration-300"
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MediaClose from "@/components/SVG/AddPosts_Icons/MediaClose.vue";
import AddIcon from "@/components/SVG/AddPosts_Icons/AddIcon.vue";

import { ref, onMounted, watch, nextTick } from "vue";
import mediumZoom from "medium-zoom";
import type { Zoom } from "medium-zoom";

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<{ preview: string; file: File; type: string }[]>([]);
const modalPreview = ref<{ preview: string; file: File; type: string } | null>(
  null,
);
const zoomInstance = ref<Zoom | null>(null);

// Тригер для вибору файлів
const triggerFileInput = () => {
  if (files.value.length < 5) {
    fileInput.value?.click();
  }
};

// Обробник для зміни файлів
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles) return;

  const newFiles = Array.from(selectedFiles).slice(0, 5 - files.value.length);

  for (const file of newFiles) {
    const preview = URL.createObjectURL(file);
    files.value.push({ preview, file, type: file.type });
  }
};

// Видалення файлів з переліку
const removeFile = (idx: number) => {
  files.value.splice(idx, 1);
};

// Подача файлів
const submitPost = () => {
  console.log("Submitting post with files:", files.value);
};

// Показ прев'ю у модалці
const previewFile = (item: { preview: string; file: File; type: string }) => {
  modalPreview.value = item;
  // Ініціалізуємо zoom лише коли модалка відкрита
  if (item.type.startsWith("image/") && !zoomInstance.value) {
    zoomInstance.value = mediumZoom(".zoomable-media", {
      background: "#000000e6",
      margin: 4,
      scrollOffset: 4,
    });
  }
};

// Ініціалізація zoom
const setupZoom = () => {
  nextTick(() => {
    // Ініціалізуємо zoom для зображень та відео тільки один раз
    if (!zoomInstance.value) {
      zoomInstance.value = mediumZoom(".zoomable-media", {
        background: "#000000e6",
        margin: 24,
        scrollOffset: 40,
      });
    }
  });
};

// Перезапуск zoom кожного разу, коли файли оновлюються
onMounted(setupZoom);
watch(files, setupZoom);

defineExpose({
  fileInput,
  files,
  modalPreview,
  zoomInstance,
  triggerFileInput,
  handleFileChange,
  removeFile,
  submitPost,
  previewFile,
});
</script>
