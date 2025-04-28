<template>
  <div class="2xl:m-[40px] xl:m-[30px] m-[20px]">
    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Create Lyrics
      </h1>
    </div>

    <!-- Поля для вводу пісні -->
    <div class="mb-6 space-y-4">
      <input
        v-model="songTitle"
        type="text"
        placeholder="Song title"
        class="w-full p-3 rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none"
      />
      <input
        v-model="artistName"
        type="text"
        placeholder="Artist name"
        class="w-full p-3 rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none"
      />
    </div>

    <!-- Кнопка додавання нової частини -->
    <button
      @click="addNewPart"
      class="w-full mb-6 2xl:h-[50px] h-[40px] rounded-[5px] bg-[#000C9C]/40 hover:bg-[#000C9C]/60 transition text-white font-bold flex items-center justify-center"
    >
      Add New Part
    </button>

    <!-- Список частин -->
    <div
      v-for="(part, index) in parts"
      :key="index"
      class="mb-6 bg-[#000C9C]/20 p-4 rounded-[5px] space-y-4"
    >
      <select
        v-model="part.type"
        class="w-full p-3 rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none"
      >
        <option disabled value="">Select part</option>
        <option v-for="option in partOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <textarea
        v-model="part.lyrics"
        placeholder="Enter lyrics..."
        class="w-full p-3 rounded-[5px] bg-white/10 text-white placeholder-gray-400 resize-none focus:outline-none"
        rows="4"
      ></textarea>

      <!-- Кнопка видалення частини -->
      <div class="flex justify-end">
        <button
          @click="removePart(index)"
          class="text-sm text-red-500 hover:underline"
        >
          Remove Part
        </button>
      </div>
    </div>

    <!-- Кнопка сабміту -->
    <div class="flex justify-end">
      <button
        @click="submitLyrics"
        :disabled="!canSubmit"
        class="w-full xl:w-1/2 2xl:h-[50px] h-[40px] rounded-[5px] bg-[#6D01D0]/40 hover:bg-[#6D01D0]/60 transition font-bold text-xl text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

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
</script>

<style scoped>
/* Додаткові стилі за потреби */
</style>
