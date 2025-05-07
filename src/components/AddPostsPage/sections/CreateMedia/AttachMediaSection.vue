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
          <MediaClose :iconColor="getIconColor(item)" />
        </button>
      </div>
    </div>

    <!-- Кнопка сабміту (відображається тільки якщо є файли) -->
    <div v-if="files.length > 0" class="flex justify-end mb-6">
      <button
        @click="submitPost"
        class="cursor-pointer w-full xl:w-1/2 2xl:h-[37px] xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-end justify-end text-[#6D01D0] inter-font 2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px]"
      >
        Publish
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
import AddIcon from "../../../SVG/AddPosts_Icons/AddIcon.vue";
import MediaClose from "@/components/SVG/AddPosts_Icons/MediaClose.vue";

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

const iconColors = ref<Record<number, string>>({});
watch(files, async () => {
  for (let i = 0; i < files.value.length; i++) {
    const file = files.value[i];
    const color = await getIconColor(file);
    iconColors.value[i] = color;
  }
});
function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1: number, l2: number): number {
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}

function getContrastColor(bgHex: string): string {
  const candidates = ["#FFFFFF", "#000000", "#6D01D0", "#000C9C"];
  const bgLum = getLuminance(bgHex);
  let bestColor = "#000000";
  let maxContrast = 0;

  for (const color of candidates) {
    const lum = getLuminance(color);
    const c = contrastRatio(bgLum, lum);
    if (c > maxContrast) {
      maxContrast = c;
      bestColor = color;
    }
  }

  return bestColor;
}

async function getIconColor(file: {
  preview: string;
  file: File;
  type: string;
}): Promise<string> {
  if (!file.type.startsWith("image/")) return "#FFFFFF"; // default for non-images
  const cornerColor = await getAverageCornerColor(file.preview);
  return getContrastColor(cornerColor); // Контрастний колір для іконки
}

async function getAverageCornerColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Дозволяє читати пікселі, якщо це дозволено CORS

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("#000000"); // Fallback
        return;
      }

      ctx.drawImage(img, 0, 0);

      const size = 30;
      const startX = img.width - size;
      const startY = 0;

      try {
        const imageData = ctx.getImageData(startX, startY, size, size);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; // R
          g += data[i + 1]; // G
          b += data[i + 2]; // B
        }

        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
        resolve(hex);
      } catch (e) {
        console.error("getImageData error:", e);
        resolve("#000000");
      }
    };

    img.onerror = () => {
      console.error("Image load error");
      resolve("#000000");
    };

    img.src = imageUrl;
  });
}
</script>
