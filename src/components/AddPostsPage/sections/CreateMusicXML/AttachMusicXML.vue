<template>
  <div
    class="2xl:m-[40px] xl:m-[35px] lg:m-[33px] md:m-[32px] sm:m-[30px] m-[28px]"
  >
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
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

    <!-- Прев’ю файлів -->
    <div
      v-if="files.length"
      class="bg-[#000C9C]/40 mb-6 rounded-[5px] pt-[20px] p-[10px] sm:pt-[25px] sm:p-[15px] 2xl:pt-[30px] 2xl:p-[20px]"
    >
      <div
        class="relative bg-white/10 mb-[12px] rounded-[5px]"
        v-for="(item, idx) in files"
        :key="idx"
      >
        <!-- Картка файлу -->
        <div
          class="p-[10px] sm:p-[12px] lg:p-[13px] xl:p-[14px] 2xl:p-[15px] rounded-[5px] transition"
        >
          <div class="flex items-left">
            <div class="flex items-center gap-4">
              <img
                v-if="item.avatar"
                :src="item.avatar"
                alt="Avatar"
                class="w-10 h-10 mr-[15px] rounded-[3px] object-cover"
                @error="item.avatar = ''"
              />
              <div
                v-else
                class="mr-[15px] w-10 h-10 rounded-[3px] bg-[#6D01D0] flex items-center justify-center text-white text-2xl"
              >
                <XMLIcon />
              </div>
            </div>

            <div class="flex flex-col text-white w-3/5">
              <p
                class="font-bold truncate max-w-xs text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]"
              >
                {{ item.title }}
              </p>
              <!-- Додано w-full для обрізання -->
              <p
                class="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
              >
                {{ fileSizeInKB(item.file) }} KB
              </p>
            </div>
            <!-- Кнопка для видалення файлу -->
            <button
              @click.stop="removeFile(idx)"
              class="absolute top-1/2 left-[auto] right-[12px] sm:right-[15px] md:right-[17px] lg:right-[20px] xl:right-[22px] 2xl:right-[25.85px] transform -translate-y-1/2 h-[10px] sm:h-[12px] md:h-[14px] lg:h-[16px] xl:h-[18px] 2xl:h-[20px] w-[10px] sm:w-[12px] md:w-[14px] lg:w-[16px] xl:w-[18px] 2xl:w-[20px] rounded-full flex items-center justify-center"
            >
              <AudioClose11 />
            </button>
          </div>
        </div>
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
        <a href="#home"> <p>Publish</p></a>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddIcon from "../../../SVG/AddPosts_Icons/AddIcon.vue";
import { ref } from "vue";
import AudioClose11 from "@/components/SVG/AddPosts_Icons/AudioClose11.vue";
import XMLIcon from "@/components/SVG/AddPosts_Icons/XMLIcon.vue";
// Масив файлів
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
  fileInput.value?.click();
};

// Обробник вибору файлу
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles) return;

  const newFiles = Array.from(selectedFiles);

  // Перевірка, скільки файлів уже додано
  const remainingFilesCount = 5 - files.value.length;

  // Додаємо тільки стільки файлів, скільки ще можна додати
  const filesToAdd = newFiles.slice(0, remainingFilesCount);

  if (filesToAdd.length > 0) {
    for (const file of filesToAdd) {
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
        alert("Please, upload MusicXML file");
      }
    }
  }
};

// Функція для отримання загальної зайнятої пам'яті (в байтах)
const getUsedMemoryInBytes = () => {
  return files.value.reduce((acc, item) => acc + item.file.size, 0);
};

const fileSizeInKB = (file: File) => {
  return (file.size / 1024).toFixed(2); // Переведення в КБ
};

// Видалити файл з масиву
const removeFile = (idx: number) => {
  files.value.splice(idx, 1);
};

// Подача (поки що просто лог)
const submitPost = () => {
  console.log("Submitting post with files:", files.value);
};

// Відкриття файлу при натисканні на елемент
const openFile = (preview: string) => {
  window.open(preview, "_blank"); // Відкриває файл в новій вкладці
};

defineExpose({
  fileInput,
  files,
  triggerFileInput,
  handleFileChange,
  getUsedMemoryInBytes,
  fileSizeInKB,
  removeFile,
  submitPost,
  openFile,
});
</script>
