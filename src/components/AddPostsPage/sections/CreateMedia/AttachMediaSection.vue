<template>
  <div
    class="2xl:m-[40px] xl:m-[35px] lg:m-[33px] md:m-[32px] sm:m-[30px] m-[28px]"
  >
    <!-- Заголовок -->
    <div class="flex items-center mb-6 h-[17px]">
      <h1
        class="h-[17px] 2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
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
          class="absolute top-[10px] right-[10px] text-white text-[20px] rounded-full w-[20px] h-[20px] flex items-center justify-center"
        >
          <MediaClose :iconColor="iconColors[idx]" />
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
        class="cursor-pointer w-[75px] sm:w-[80px] md:w-[85px] lg:w-[95px] xl:w-[105px] 2xl:w-[119px] 2xl:h-[37px] bg-[#6D01D0]/20 xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center text-[#6D01D0] inter-font 2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px]"
      >
        <p @click="goBack">Publish</p>
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

        <!-- Кнопка закриття -->
        <button
          class="absolute top-4 right-4 bg-black/60 text-white rounded-full px-3 py-1 text-xl hover:bg-black"
          @click="modalPreview = null"
        >
          <MediaClose />
        </button>
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

function goBack() {
  window.history.back();
}

const iconColors = ref<string[]>([]); // Define iconColors as an array of strings

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

// Функція для отримання контрастного кольору для хрестика
async function getIconColor(file: {
  preview: string;
  file: File;
  type: string;
}): Promise<string> {
  if (!file.type.startsWith("image/")) return "#FFFFFF"; // колір для не зображень
  const cornerColor = await getAverageCornerColor(file.preview);
  return getContrastColor(cornerColor); // Контрастний колір для іконки
}

// Функція для отримання середнього кольору кута зображення
async function getAverageCornerColor(imageUrl: string): Promise<string> {
  const img = new Image();
  img.src = imageUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context is not available");
        return;
      }

      // Set the canvas dimensions to the image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Get pixel data from the four corners
      const corners = [
        { x: 0, y: 0 }, // top-left
        { x: img.width - 1, y: 0 }, // top-right
        { x: 0, y: img.height - 1 }, // bottom-left
        { x: img.width - 1, y: img.height - 1 }, // bottom-right
      ];

      let r = 0,
        g = 0,
        b = 0;

      corners.forEach(({ x, y }) => {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        r += pixel[0]; // red
        g += pixel[1]; // green
        b += pixel[2]; // blue
      });

      // Average the color values
      r = Math.round(r / 4);
      g = Math.round(g / 4);
      b = Math.round(b / 4);

      // Convert RGB to HEX
      const hex = rgbToHex(r, g, b);
      resolve(hex);
    };

    img.onerror = () => reject("Image loading error");
  });
}

// Перетворення RGB в HEX
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Функція для визначення контрастного кольору
function getContrastColor(hex: string): string {
  // Визначаємо, чи темний або світлий колір
  const hexColor = hex.startsWith("#") ? hex.slice(1) : hex;
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Обчислення контрасту за допомогою формули для визначення яскравості
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Якщо колір темний, повертаємо білий
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

// Оновлення кольору іконки після вибору файлів
watch(files, async () => {
  iconColors.value = await Promise.all(
    files.value.map((file) => getIconColor(file)),
  );
});
</script>
