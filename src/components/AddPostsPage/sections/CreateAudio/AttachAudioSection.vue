<template>
  <div class="2xl:m-[40px] xl:m-[30px] m-[20px]">
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Attach audio files
      </h1>
    </div>

    <!-- Інпут для файлів -->
    <input
      ref="fileInput"
      type="file"
      accept="audio/*"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Кнопка додавання -->
    <button
      @click="triggerFileInput"
      :disabled="files.length >= 1"
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6 ',
        files.length >= 1
          ? 'bg-white/5 cursor-not-allowed'
          : 'bg-[#000C9C]/40 hover:bg-[#000C9C]/60',
      ]"
    >
      <AddIcon
        class="2xl:w-[24px] 2xl:h-[24px] xl:w-[20px] xl:h-[20px] lg:w-[18px] lg:h-[18px] w-[16px] h-[16px]"
      />
    </button>

    <!-- Прев’ю файлів -->
    <div class="space-y-6 mb-6">
      <div
        v-for="(item, idx) in files"
        :key="idx"
        class="relative group cursor-pointer rounded-[5px] bg-[#000C9C]/20"
      >
        <!-- Кнопка для видалення файлу -->
        <button
          @click.stop="removeFile(idx)"
          class="absolute top-[-10px] right-[-10px] text-white bg-black/60 hover:bg-black/80 rounded-full w-7 h-7 flex items-center justify-center"
        >
          ✖
        </button>
        <div class="p-[15px] pt-[20px] pb-[20px]">
          <!-- Аватарка та назва пісні з автором на одному рівні -->
          <div class="flex items-left">
            <!-- Перевірка на наявність аватарки -->
            <div class="flex items-center gap-4">
              <img
                v-if="item.avatar"
                :src="item.avatar"
                alt="Avatar"
                class="w-20 h-20 mr-[15px] rounded-full object-cover"
                @error="item.avatar = null"
              />
              <!-- Якщо аватарка відсутня, відображається контейнер з текстом "+" -->
              <div
                v-else
                class="mr-[15px] w-20 h-20 rounded-lg bg-gray-400 flex items-center justify-center text-white text-2xl"
              >
                +
              </div>
            </div>

            <!-- Назва пісні та автор -->
            <div class="flex flex-col text-white text">
              <p class="font-bold">{{ item.title }}</p>
              <p class="text-sm">{{ item.artist }}</p>
            </div>
          </div>
        </div>
        <!-- Плеєр -->
        <audio
          :src="item.preview"
          controls
          class="w-full h rounded-[5px] bg-[#000C9C] text-white"
        ></audio>
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

// Масив для збереження файлів
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<
  {
    preview: string;
    file: File;
    type: string;
    title: string;
    artist: string;
    avatar: string;
  }[]
>([]);

// Тригер для вибору файлів
const triggerFileInput = () => {
  if (files.value.length < 1) {
    fileInput.value?.click();
  }
};

// Обробник для зміни файлів
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles) return;

  const newFiles = Array.from(selectedFiles).slice(0, 1 - files.value.length);

  for (const file of newFiles) {
    const preview = URL.createObjectURL(file);
    files.value.push({
      preview,
      file,
      type: file.type,
      title: file.name.replace(/\.[^/.]+$/, ""), // Витягуємо назву без розширення
      artist: "Unknown Artist", // Це може бути змінено, або ти можеш додавати інформацію про автора окремо
      avatar: "path_to_avatar_image.jpg", // Тут вказуємо шлях до аватарки
    });
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
</script>
