<template>
  <div
    class="2xl:m-[40px] xl:m-[35px] lg:m-[33px] md:m-[32px] sm:m-[30px] m-[28px]"
  >
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
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

    <!-- Прев’ю файлів -->
    <div class="space-y-6 mb-6">
      <div
        v-for="(item, idx) in files"
        :key="idx"
        class="relative group rounded-[5px] bg-[#000C9C]/40"
      >
        <!-- Кнопка для видалення файлу -->
        <button
          @click.stop="removeFile(idx)"
          class="absolute cursor-pointer top-[5px] sm:top-[6px] md:top-[7px] lg:top-[8px] xl:top-[9px] 2xl:top-[10px] right-[5px] sm:right-[6px] md:right-[7px] lg:right-[8px] xl:right-[9px] 2xl:right-[10px] text-white rounded-full h-[10px] sm:h-[12px] md:h-[14px] lg:h-[16px] xl:h-[18px] 2xl:h-[20px] w-[10px] sm:w-[12px] md:w-[14px] lg:w-[16px] xl:w-[18px] 2xl:w-[20px] flex items-center justify-center"
        >
          <MediaClose11 />
        </button>
        <div
          class="p-[10px] sm:p-[15px] md:p-[18px] lg:p-[20px] xl:p-[25.5px] 2xl:p-[28.5px] pt-[15px] sm:pt-[18px] md:pt-[20px] lg:pt-[24px] xl:pt-[27px] 2xl:pt-[30px] pb-[15px] sm:pb-[18px] md:pb-[20px] lg:pb-[24px] xl:pb-[27px] 2xl:pb-[30px]"
        >
          <!-- Аватарка та назва пісні з автором на одному рівні -->
          <div class="flex items-center">
            <!-- Перевірка на наявність аватарки -->
            <div class="flex items-center gap-4">
              <img
                v-if="item.avatar"
                :src="item.avatar"
                alt="Avatar"
                class="h-[55px] sm:h-[60px] md:h-[65px] lg:h-[70px] xl:h-[75px] 2xl:h-[80px] w-[55px] sm:w-[60px] md:w-[65px] lg:w-[70px] xl:w-[75px] 2xl:w-[80px] mr-[15px] rounded-full object-cover"
                @error="item.avatar = ''"
              />
              <!-- Якщо аватарка відсутня, відображається контейнер з текстом "+" -->
              <div
                v-else
                class="mr-[15px] h-[55px] sm:h-[60px] md:h-[65px] lg:h-[70px] xl:h-[75px] 2xl:h-[80px] w-[55px] sm:w-[60px] md:w-[65px] lg:w-[70px] xl:w-[75px] 2xl:w-[80px] rounded-lg bg-gray-400 flex items-center justify-center text-white text-2xl"
              >
                <AudioPost />
              </div>
            </div>

            <!-- Назва пісні та автор -->
            <div class="flex flex-col text-white text w-1/2">
              <p
                class="font-bold truncate max-w-xs text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]"
              >
                {{ item.title }}
              </p>
              <p
                class="truncate max-w-xs text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
              >
                {{ item.artist }}
              </p>
            </div>

            <!-- Кнопка Play/Pause -->
            <button
              @click="togglePlay(item)"
              class="ml-auto cursor-pointer h-[27px] sm:h-[32px] md:h-[34px] lg:h-[36px] xl:h-[38px] 2xl:h-[40px] w-[27px] sm:w-[32px] md:w-[34px] lg:w-[36px] xl:w-[38px] 2xl:w-[40px] rounded-full bg-[#6D01D0] flex items-center justify-center"
            >
              <PlayPauseIcon :isPlaying="item.isPlaying" />
            </button>
          </div>
          <!-- Кастомний аудіо-плеєр -->
          <div
            class="mt-[10px] w-full flex items-center text-white text-sm gap-2"
          >
            <span>{{ formatTime(item.currentTime || 0) }}</span>
            <input
              type="range"
              class="w-full h-[4px] bg-white rounded appearance-none cursor-pointer range-thumb-purple"
              :max="item.duration || 0"
              :value="item.currentTime || 0"
              @input="(e) => seekAudio(item, e)"
            />
            <span>{{ formatTime(item.duration || 0) }}</span>
          </div>
          <!-- Прихований тег <audio> -->
          <audio
            :src="item.preview"
            @timeupdate="() => updateTime(item)"
            @loadedmetadata="() => loadMetadata(item)"
            @ended="item.isPlaying = false"
            class="hidden"
          />
        </div>
      </div>
    </div>

    <!-- Кнопка додавання -->
    <button
      @click="triggerFileInput"
      :disabled="files.length >= 2"
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6 ',
        files.length >= 2
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
import MediaClose11 from "@/components/SVG/AddPosts_Icons/AudioClose11.vue";
import PlayPauseIcon from "@/components/SVG/AddPosts_Icons/PlayPauseIcon.vue";
import AudioPost from "@/components/SVG/AddPosts_Icons/AudioPost.vue";
import { ref, nextTick } from "vue";

// Опис структури даних для файлів
interface AudioFile {
  preview: string;
  file: File;
  type: string;
  title: string;
  artist: string;
  avatar: string;
  audioRef?: HTMLAudioElement | null;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
}

// Файли
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<AudioFile[]>([]);

// Функція для виклику інпуту для файлів
const triggerFileInput = () => {
  if (files.value.length < 2) fileInput.value?.click();
};

// Обробник зміни файлів
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selected = input.files;
  if (!selected) return;

  const newFiles = Array.from(selected).slice(0, 2 - files.value.length);

  for (const file of newFiles) {
    const preview = URL.createObjectURL(file);
    files.value.push({
      preview,
      file,
      type: file.type,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      avatar: "",
      audioRef: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
  }

  await nextTick(); // дочекаємось оновлення DOM
  files.value.forEach((item, index) => {
    const audioEl = document.querySelectorAll<HTMLAudioElement>("audio")[index];
    item.audioRef = audioEl;
  });
};

// Функція для видалення файлу
const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

// Функція для перемикання стану відтворення/пауза
const togglePlay = (item: AudioFile) => {
  if (!item.audioRef) return;

  // Зупинимо інші плеєри
  files.value.forEach((f) => {
    if (f !== item && f.audioRef && !f.audioRef.paused) {
      f.audioRef.pause();
      f.isPlaying = false;
    }
  });

  if (item.isPlaying) {
    item.audioRef.pause();
  } else {
    item.audioRef.play();
  }
  item.isPlaying = !item.isPlaying;
};

// Функція для оновлення часу відтворення
const updateTime = (item: AudioFile) => {
  if (item.audioRef) item.currentTime = item.audioRef.currentTime;
};

// Функція для завантаження метаданих аудіофайлу
const loadMetadata = (item: AudioFile) => {
  if (item.audioRef) item.duration = item.audioRef.duration;
};

// Функція для перемотування аудіо
const seekAudio = (item: AudioFile, e: Event) => {
  const time = parseFloat((e.target as HTMLInputElement).value);
  if (item.audioRef) {
    item.audioRef.currentTime = time;
    item.currentTime = time;
  }
};

// Функція для форматування часу
const formatTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Функція для надсилання посту
const submitPost = () => {
  console.log("Submitting post with files:", files.value);
};

defineExpose({
  submitPost,
  triggerFileInput,
  files,
});
</script>

<style scoped>
.range-thumb-purple::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  background: #6d01d0; /* фіолетовий */
  border-radius: 50%;
  cursor: pointer;
  margin-top: 0px; /* вирівнювання по центру */
}

.range-thumb-purple::-moz-range-thumb {
  height: 12px;
  width: 12px;
  background: #6d01d0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
</style>
