<template>
  <div class="2xl:m-[40px] xl:m-[30px] m-[20px]">
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Attach MusicXML files
      </h1>
    </div>

    <!-- Інпут для файлів -->
    <input
      ref="fileInput"
      type="file"
      accept=".musicxml,.xml,.mxl"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Кнопка додавання -->
    <button
      @click="triggerFileInput"
      :disabled="
        files.length >= 5 ||
        files.reduce((total, item) => total + item.file.size, 0) >= 1024 * 1024
      "
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6 ',
        files.length >= 5 ||
        files.reduce((total, item) => total + item.file.size, 0) >= 1024 * 1024
          ? 'bg-white/5 cursor-not-allowed'
          : 'bg-[#000C9C]/40 hover:bg-[#000C9C]/60',
      ]"
    >
      <AddIcon
        class="2xl:w-[24px] 2xl:h-[24px] xl:w-[20px] xl:h-[20px] lg:w-[18px] lg:h-[18px] w-[16px] h-[16px]"
      />
    </button>

    <!-- Прев’ю файлів -->
    <div class="relative" v-for="(item, idx) in files" :key="idx">
      <!-- Картка файлу -->
      <div
        class="p-[15px] pt-[20px] pb-[20px] hover:bg-[#6D01D0]/30 rounded-[5px] transition cursor-pointer"
      >
        <div class="flex items-left">
          <div class="flex items-center gap-4">
            <img
              v-if="item.avatar"
              :src="item.avatar"
              alt="Avatar"
              class="w-20 h-20 mr-[15px] rounded-full object-cover"
              @error="item.avatar = null"
            />
            <div
              v-else
              class="mr-[15px] w-20 h-20 rounded-lg bg-gray-400 flex items-center justify-center text-white text-2xl"
            >
              +
            </div>
          </div>
          <div class="flex flex-col text-white">
            <p class="font-bold">{{ item.title }}</p>
            <p class="text-sm">{{ item.artist }}</p>
          </div>
        </div>
      </div>

      <!-- Кнопка для видалення файлу -->
      <button
        @click.stop="removeFile(idx)"
        class="absolute top-[-10px] right-[-10px] text-white bg-black/60 hover:bg-black/80 rounded-full w-7 h-7 flex items-center justify-center"
      >
        ✖
      </button>

      <!-- Відображення використаного місця на диску -->
      <div class="text-xs text-white mt-2">
        <p>{{ getUsedMemory() }} / 1MB used</p>
      </div>
    </div>

    <!-- Кнопка сабміту -->
    <div class="flex justify-end mb-6">
      <button
        @click="submitPost"
        :disabled="files.length === 0"
        class="w-full xl:w-1/2 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center text-[#6D01D0] inter-font bg-[#6D01D0]/20 disabled:opacity-40 disabled:cursor-not-allowed 2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px]"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddIcon from "../../../SVG/AddPosts_Icons/AddIcon.vue";
import { ref } from "vue";

// Масив для збереження MusicXML файлів
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<
  {
    preview: string;
    file: File;
    title: string;
    artist: string;
    avatar: string;
  }[]
>([]);

// Тригер для відкриття діалогу вибору файлів
const triggerFileInput = () => {
  if (getUsedMemoryInBytes() < 1024 * 1024) {
    fileInput.value?.click();
  } else {
    alert("Максимальний ліміт пам’яті 1MB!");
  }
};

// Обробник вибору файлу
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles) return;

  const newFiles = Array.from(selectedFiles);
  const totalFileSize =
    getUsedMemoryInBytes() + newFiles.reduce((acc, file) => acc + file.size, 0);

  if (totalFileSize <= 1024 * 1024) {
    for (const file of newFiles) {
      // Перевірка типу файлів
      if (
        file.name.endsWith(".musicxml") ||
        file.name.endsWith(".xml") ||
        file.name.endsWith(".mxl") ||
        file.type === "application/xml"
      ) {
        const preview = URL.createObjectURL(file);
        files.value.push({
          preview,
          file,
          title: file.name.replace(/\.[^/.]+$/, ""), // Назва без розширення
          artist: "Unknown Artist",
          avatar: "path_to_avatar_image.jpg", // Можна замінити або згенерувати динамічно
        });
      } else {
        alert("Будь ласка, завантажте тільки MusicXML файл");
      }
    }
  } else {
    alert("Максимальний ліміт пам’яті 1MB!");
  }
};

// Функція для отримання загальної зайнятої пам'яті (в байтах)
const getUsedMemoryInBytes = () => {
  return files.value.reduce((acc, item) => acc + item.file.size, 0);
};

// Функція для отримання відформатованого значення зайнятої пам'яті
const getUsedMemory = () => {
  const usedMemory = getUsedMemoryInBytes();
  return `${(usedMemory / 1024).toFixed(2)} KB`; // Відображаємо в КБ
};

// Видалити файл з масиву
const removeFile = (idx: number) => {
  files.value.splice(idx, 1);
};

// Відкрити MusicXML файл у новій вкладці
const openFile = (fileUrl: string) => {
  window.open(fileUrl, "_blank");
};

// Подача (поки що просто лог)
const submitPost = () => {
  console.log("Submitting post with files:", files.value);
};
</script>
