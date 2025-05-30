<template>
  <div class="m-[20px]">
    <!-- Debug toggle (remove after testing) -->
    <button
      @click="showDebug = !showDebug"
      class="fixed bottom-4 right-4 bg-purple-600 text-white px-3 py-1 rounded text-xs z-50"
    >
      Lyrics Debug
    </button>

    <!-- Debug info -->
    <div
      v-if="showDebug"
      class="mb-4 p-3 bg-purple-900/30 rounded text-white text-sm"
    >
      <p><strong>LYRICS DEBUG:</strong></p>
      <p>Song Title: "{{ songTitle }}"</p>
      <p>Artist: "{{ artistName }}"</p>
      <p>Parts: {{ parts.length }}</p>
      <p>Can Submit: {{ canSubmit }}</p>
      <p>Submitting: {{ isSubmitting }}</p>
      <p v-if="submitError" class="text-red-400">Error: {{ submitError }}</p>
      <p v-if="successMessage" class="text-green-400">
        Success: {{ successMessage }}
      </p>
    </div>

    <!-- Заголовок -->
    <div class="flex items-center mb-6">
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
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
        class="w-full font-normal p-1 sm:p-1.5 md:p-2 lg:p-2.5 2xl:p-3 rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[16px] focus:bg-white/20"
        :disabled="isSubmitting"
        required
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
        class="w-full p-1 sm:p-1.5 md:p-2 lg:p-2.5 2xl:p-3 font-normal rounded-[5px] bg-white/10 text-white placeholder-gray-400 focus:outline-none text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[16px] focus:bg-white/20"
        :disabled="isSubmitting"
        required
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
            :disabled="isSubmitting"
            required
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

          <!-- Arrow Icon -->
          <div
            class="pointer-events-none absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1L6 6L11 1"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Кнопка видалення частини -->
        <div class="flex justify-end">
          <button
            @click="removePart(index)"
            :disabled="isSubmitting"
            class="absolute top-1/2 right-[0px] -translate-y-1/2 rounded-full h-[20px] w-[20px] flex items-center justify-center text-white hover:bg-red-500/20 disabled:opacity-50"
          >
            <span class="text-red-500 text-lg">×</span>
          </button>
        </div>
      </div>

      <textarea
        v-model="part.lyrics"
        placeholder="Enter lyrics..."
        class="w-full p-1 sm:p-1.5 md:p-2 lg:p-2.5 2xl:p-3 rounded-[5px] bg-white/10 text-white text-[12px] sm:text-[13px] 2xl:text-[14px] placeholder-gray-400 resize-none focus:outline-none focus:bg-white/20"
        rows="4"
        :disabled="isSubmitting"
        required
      ></textarea>
    </div>

    <!-- Кнопка додавання нової частини -->
    <button
      @click="addNewPart"
      :disabled="!canAddPart || isSubmitting"
      :class="[
        'w-full mb-6 mt-[8px] 2xl:h-[50px] h-[40px] rounded-[5px] transition text-white font-medium flex items-center justify-center',
        canAddPart && !isSubmitting
          ? 'bg-[#000C9C]/40 hover:bg-[#6D01D0]'
          : 'bg-white/5 cursor-not-allowed',
      ]"
    >
      Add New Part
    </button>

    <!-- Upload Progress -->
    <div v-if="isSubmitting" class="mb-6">
      <div class="bg-gray-700 rounded-full h-3 mb-3">
        <div
          class="bg-[#6D01D0] h-3 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-sm text-gray-400 text-center">
        Publishing... {{ uploadProgress }}%
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="submitError" class="mb-6 p-4 bg-red-600 text-white rounded-lg">
      <div class="flex items-center justify-between">
        <span>{{ submitError }}</span>
        <button @click="submitError = ''" class="text-red-200 hover:text-white">
          ×
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-green-600 text-white rounded-lg"
    >
      <div class="flex items-center justify-between">
        <span>{{ successMessage }}</span>
        <button
          @click="successMessage = ''"
          class="text-green-200 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Кнопка сабміту (відображається тільки якщо є частини) -->
    <div v-if="parts.length > 0" class="flex justify-end text-center mb-6">
      <button
        @click="submitLyrics"
        :disabled="!canSubmit || isSubmitting"
        class="cursor-pointer w-[75px] sm:w-[80px] md:w-[85px] lg:w-[95px] xl:w-[105px] 2xl:w-[119px] 2xl:h-[37px] bg-[#6D01D0]/20 xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center text-[#6D01D0] inter-font [@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? "Publishing..." : "Publish" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

// State
const songTitle = ref("");
const artistName = ref("");
const parts = ref<{ type: string; lyrics: string }[]>([]);
const isSubmitting = ref(false);
const submitError = ref("");
const successMessage = ref("");
const uploadProgress = ref(0);
const showDebug = ref(false);

// Варіанти частин пісні
const partOptions = [
  "intro",
  "verse",
  "pre-chorus",
  "chorus",
  "bridge",
  "outro",
];

// Computed properties
const canAddPart = computed(
  () => parts.value.length < 10 && !isSubmitting.value,
);

const canSubmit = computed(() => {
  return (
    songTitle.value.trim() !== "" &&
    artistName.value.trim() !== "" &&
    parts.value.length > 0 &&
    parts.value.every((p) => p.type && p.lyrics.trim() !== "") &&
    !isSubmitting.value
  );
});

// Додаємо нову частину
const addNewPart = () => {
  if (canAddPart.value) {
    parts.value.push({ type: "", lyrics: "" });
    console.log("📝 Added new lyrics part. Total parts:", parts.value.length);
  }
};

// Видаляємо частину
const removePart = (index: number) => {
  console.log("🗑️ Removing lyrics part at index:", index);
  parts.value.splice(index, 1);
  console.log("Lyrics parts remaining:", parts.value.length);
};

// Сабміт тексту
const submitLyrics = async () => {
  console.log("📝 === SUBMIT LYRICS POST ===");
  console.log("Song Title:", songTitle.value);
  console.log("Artist:", artistName.value);
  console.log("Parts:", parts.value.length);

  if (!canSubmit.value) {
    submitError.value = "Please fill in all required fields";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";
  successMessage.value = "";
  uploadProgress.value = 0;

  try {
    const lyricsData = {
      songTitle: songTitle.value.trim(),
      artistName: artistName.value.trim(),
      parts: parts.value.map((part) => ({
        type: part.type,
        lyrics: part.lyrics.trim(),
      })),
    };

    console.log("📝 Submitting lyrics data:", lyricsData);

    // Progress simulation
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 85) {
        uploadProgress.value += Math.random() * 15;
      }
    }, 200);

    console.log(` Making request to: ${API_URL}/posts/lyrics`);

    // Make API request
    const response = await fetch(`${API_URL}/posts/lyrics`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lyricsData),
    });

    clearInterval(progressInterval);

    console.log("📡 === RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("OK:", response.ok);

    if (!response.ok) {
      let errorMsg = "Failed to create lyrics post";
      const contentType = response.headers.get("content-type");

      console.log("Response content type:", contentType);

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          console.log("❌ Error data:", errorData);
          errorMsg = errorData.detail || errorData.message || errorMsg;
        } catch (e) {
          console.error("Failed to parse error response:", e);
          const textResponse = await response.text();
          console.log("Error response text:", textResponse);
          errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        }
      } else {
        const textResponse = await response.text();
        console.log("❌ Error response text:", textResponse);
        errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMsg);
    }

    const result = await response.json();
    uploadProgress.value = 100;

    console.log("✅ Lyrics post created successfully:", result);
    successMessage.value = "Lyrics post created successfully! Redirecting...";

    // Force home page refresh (same as other posts)
    setTimeout(() => {
      songTitle.value = "";
      artistName.value = "";
      parts.value = [];
      successMessage.value = "";

      const currentPath = window.location.pathname;
      const isAlreadyOnHome =
        currentPath === "/" || currentPath.includes("home");

      if (isAlreadyOnHome) {
        console.log("🔄 Already on home page, forcing reload...");
        window.location.reload();
      } else {
        console.log("🏠 Navigating to home...");
        router.push("/home").then(() => {
          setTimeout(() => {
            console.log("🔄 Forcing home page reload...");
            window.location.reload();
          }, 100);
        });
      }
    }, 1500);
  } catch (error) {
    console.error("❌ === ERROR CREATING LYRICS POST ===");
    console.error("Error:", error);
    submitError.value =
      error instanceof Error ? error.message : "Failed to create lyrics post";
    uploadProgress.value = 0;
  } finally {
    isSubmitting.value = false;
  }
};

defineExpose({
  submitLyrics,
  canSubmit,
  songTitle,
  artistName,
  parts,
});
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
  color: white !important; /* Текст у селекті білий */
  background-color: rgba(
    109,
    1,
    208,
    0.5
  ) !important; /* Фон в селекті фіолетовий */
}

/* Стиль тільки для placeholder (disabled) */
.custom-select option:disabled {
  color: rgba(255, 255, 255, 0.7) !important; /* трохи прозорий білий */
  font-style: italic;
}

textarea::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* світло-сірий */
  border-radius: 8px;
}

/* Для Firefox */
textarea {
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
