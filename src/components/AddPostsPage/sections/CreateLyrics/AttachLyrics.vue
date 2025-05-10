<template>
  <div
    class="2xl:m-[40px] xl:m-[35px] lg:m-[33px] md:m-[32px] sm:m-[30px] m-[28px]"
  >
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
      >
        Create Lyrics
      </h1>
    </div>

    <!-- Поля для вводу пісні -->
    <div
      class="mb-6 space-y-4 bg-[#000C9C]/40 p-3 pt-[18px] lg:p-4 lg:pt-[24px] 2xl:p-5 2xl:pt-[30px] rounded-[10px]"
    >
      <p
        class="text-[#FFFFFF] mb-[9px] font-normal text-[12px] sm:text-[13px] 2xl:text-[14px]"
      >
        Song title
      </p>
      <input
        v-model="songTitle"
        type="text"
        placeholder="Song title"
        class="w-full font-normal p-1 sm:p-1.5 md:p-2 lg:p-2.5 2xl:p-3 rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[16px]"
      />
      <p
        class="text-white mb-[9px] font-normal text-[12px] sm:text-[13px] 2xl:text-[14px]"
      >
        Artist name
      </p>
      <input
        v-model="artistName"
        type="text"
        placeholder="Artist name"
        class="w-full p-1 sm:p-1.5 md:p-2 lg:p-2.5 2xl:p-3 font-normal rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[16px]"
      />
    </div>

    <!-- Список частин -->
    <div
      v-for="(part, index) in parts"
      :key="index"
      class="mb-6 bg-[#000C9C]/40 p-3 pb-[18px] lg:p-4 lg:pb-[24px] 2xl:p-5 2xl:pb-[30px] rounded-[5px] space-y-4"
    >
      <div class="relative flex items-center gap-4">
        <p class="text-white text-[12px] 2xl:text-[14px] xl:text-[13px]">
          Part Type:
        </p>
        <div class="relative w-30/99 sm:w-25/99">
          <select
            v-model="part.type"
            class="appearance-none text-[14px] xl:text-[15px] 2xl:text-[16px] w-full h-[37px] items-center justify-center rounded-[5px] text-white placeholder-gray-400 focus:outline-none custom-select pl-2 pr-4"
          >
            <option
              disabled
              value=""
              class="text-[14px] xl:text-[15px] 2xl:text-[16px] font-normal"
            >
              Select part
            </option>
            <option
              v-for="option in partOptions"
              :key="option"
              :value="option"
              class="text-[14px] xl:text-[15px] 2xl:text-[16px] font-normal"
            >
              {{ option }}
            </option>
          </select>

          <!-- Використовуємо SVG як компонент -->
          <div
            class="pointer-events-none absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <ArrowIcon />
          </div>
        </div>

        <!-- Кнопка видалення частини -->
        <div class="flex justify-end">
          <button
            @click="removePart(index)"
            class="absolute top-1/2 right-[0px] -translate-y-1/2 rounded-full h-[10px] sm:h-[12px] md:h-[14px] lg:h-[16px] xl:h-[18px] 2xl:h-[20px] w-[10px] sm:w-[12px] md:w-[14px] lg:w-[16px] xl:w-[18px] 2xl:w-[20px] flex items-center justify-center text-white"
          >
            <MediaClose11 />
          </button>
        </div>
      </div>

      <textarea
        v-model="part.lyrics"
        placeholder="Enter lyrics..."
        class="w-full p-1 sm:p-1.5 md:p-2 lg:p-2.5 2xl:p-3 rounded-[5px] bg-white/10 text-white text-[12px] sm:text-[13px] 2xl:text-[14px] placeholder-gray-400 resize-none focus:outline-none"
        rows="4"
      ></textarea>
    </div>

    <!-- Кнопка додавання нової частини -->
    <button
      @click="addNewPart"
      :disabled="!canAddPart"
      :class="[
        'w-full mb-6 mt-[8px] 2xl:h-[50px] h-[40px] rounded-[5px] transition text-white font-medium flex items-center justify-center',
        canAddPart
          ? 'bg-[#000C9C]/40 hover:bg-[#6D01D0]'
          : 'bg-white/5 cursor-not-allowed',
      ]"
    >
      Add New Part
    </button>

    <!-- Кнопка сабміту (відображається тільки якщо є файли) -->
    <div v-if="parts.length > 0" class="flex justify-end text-center mb-6">
      <button
        @click="submitLyrics"
        :disabled="!canSubmit"
        class="cursor-pointer w-[75px] sm:w-[80px] md:w-[85px] lg:w-[95px] xl:w-[105px] 2xl:w-[119px] 2xl:h-[37px] bg-[#6D01D0]/20 xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center text-[#6D01D0] inter-font 2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px]"
      >
        <p @click="goBack">Publish</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import MediaClose11 from "@/components/SVG/AddPosts_Icons/AudioClose11.vue";
import ArrowIcon from "@/components/SVG/AddPosts_Icons/ArrowIcon.vue";
// Поля для назви пісні і виконавця
const songTitle = ref("");
const artistName = ref("");

// Варіанти частин пісні
const partOptions = [
  "intro",
  "verse",
  "pre-chorus",
  "chorus",
  "bridge",
  "outro",
];
const canAddPart = computed(() => parts.value.length < 10);
// Масив частин
const parts = ref<{ type: string; lyrics: string }[]>([]);

// Додаємо нову частину
const addNewPart = () => {
  parts.value.push({ type: "", lyrics: "" });
};

// Видаляємо частину
const removePart = (index: number) => {
  parts.value.splice(index, 1);
};

// Чи можна сабмітити
const canSubmit = computed(() => {
  return (
    songTitle.value.trim() !== "" &&
    artistName.value.trim() !== "" &&
    parts.value.length > 0 &&
    parts.value.every((p) => p.type && p.lyrics.trim() !== "")
  );
});

// Сабміт тексту
const submitLyrics = () => {
  const lyricsData = {
    songTitle: songTitle.value,
    artistName: artistName.value,
    parts: parts.value,
  };

  console.log("Submitting lyrics:", lyricsData);
  // Тут можна додати реальний запит на сервер
};

const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
/* Додаткові стилі за потреби */

.custom-select {
  color: white !important; /* Текст у селекті білий */
  background-color: rgba(
    109,
    1,
    208,
    1
  ) !important; /* Фон в селекті фіолетовий */
}

.custom-select option {
  color: rgb(0, 0, 0) !important; /* Текст у селекті білий */
  background-color: rgba(
    109,
    1,
    208,
    0.5
  ) !important; /* Фон в селекті фіолетовий */
}
textarea::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* світло-сірий */
  border-radius: 8px;
}

/* Для Firefox */
textarea {
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
</style>
