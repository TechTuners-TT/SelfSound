<template>
  <div class="m-[20px]">
    <!-- Debug toggle (remove after testing) -->
    <div
      v-if="showDebug"
      class="mb-4 p-3 bg-blue-900/30 rounded text-white text-sm"
    >
      <p><strong>DEBUG:</strong></p>
      <p>Files: {{ files.length }}</p>
      <p>Submitting: {{ isSubmitting }}</p>
      <p v-if="submitError" class="text-red-400">Error: {{ submitError }}</p>
      <p v-if="successMessage" class="text-green-400">
        Success: {{ successMessage }}
      </p>
    </div>

    <!-- Title -->
    <div class="flex items-center mb-6">
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
      >
        Attach audio files
      </h1>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="audio/*"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Audio Files Preview (only shows when files are selected) -->
    <div v-if="files.length > 0" class="space-y-6 mb-6">
      <div
        v-for="(item, idx) in files"
        :key="idx"
        class="relative group rounded-[5px] bg-[#000C9C]/40"
      >
        <!-- Remove button -->
        <button
          @click.stop="removeFile(idx)"
          class="absolute cursor-pointer top-[5px] sm:top-[6px] md:top-[7px] lg:top-[8px] xl:top-[9px] 2xl:top-[10px] right-[5px] sm:right-[6px] md:right-[7px] lg:right-[8px] xl:right-[9px] 2xl:right-[10px] text-white rounded-full h-[10px] sm:h-[12px] md:h-[14px] lg:h-[16px] xl:h-[18px] 2xl:h-[20px] w-[10px] sm:w-[12px] md:w-[14px] lg:w-[16px] xl:w-[18px] 2xl:w-[20px] flex items-center justify-center"
        >
          <MediaClose11 />
        </button>

        <div
          class="p-[10px] sm:p-[15px] md:p-[18px] lg:p-[20px] xl:p-[25.5px] 2xl:p-[28.5px] pt-[15px] sm:pt-[18px] md:pt-[20px] lg:pt-[24px] xl:pt-[27px] 2xl:pt-[30px] pb-[15px] sm:pb-[18px] md:pb-[20px] lg:pb-[24px] xl:pb-[27px] 2xl:pb-[30px]"
        >
          <!-- Avatar and song info with title/artist inputs -->
          <div class="flex items-center mb-4">
            <!-- Avatar check -->
            <div class="flex items-center gap-4">
              <img
                v-if="item.avatar"
                :src="item.avatar"
                alt="Avatar"
                class="h-[55px] sm:h-[60px] md:h-[65px] lg:h-[70px] xl:h-[75px] 2xl:h-[80px] w-[55px] sm:w-[60px] md:w-[65px] lg:w-[70px] xl:w-[75px] 2xl:w-[80px] mr-[15px] rounded-full object-cover"
                @error="item.avatar = ''"
              />
              <!-- If no avatar, show container with AudioPost icon -->
              <div
                v-else
                class="mr-[15px] h-[55px] sm:h-[60px] md:h-[65px] lg:h-[70px] xl:h-[75px] 2xl:h-[80px] w-[55px] sm:w-[60px] md:w-[65px] lg:w-[70px] xl:w-[75px] 2xl:w-[80px] rounded-lg bg-gray-400 flex items-center justify-center text-white text-2xl"
              >
                <AudioPost />
              </div>
            </div>

            <!-- Title and Artist inputs -->
            <div class="flex flex-col text-white w-1/2 space-y-2">
              <input
                v-model="item.title"
                type="text"
                placeholder="Song title"
                class="bg-transparent border-none outline-none font-bold truncate max-w-xs text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] placeholder-gray-400"
                required
              />
              <input
                v-model="item.artist"
                type="text"
                placeholder="Artist name"
                class="bg-transparent border-none outline-none truncate max-w-xs text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] placeholder-gray-400"
                required
              />
            </div>

            <!-- Play/Pause button -->
            <button
              @click="togglePlay(item)"
              class="ml-auto cursor-pointer h-[27px] sm:h-[32px] md:h-[34px] lg:h-[36px] xl:h-[38px] 2xl:h-[40px] w-[27px] sm:w-[32px] md:w-[34px] lg:w-[36px] xl:w-[38px] 2xl:w-[40px] rounded-full bg-[#6D01D0] flex items-center justify-center"
            >
              <PlayPauseIcon :isPlaying="item.isPlaying" />
            </button>
          </div>

          <!-- Custom audio player -->
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
              :style="getFillStyle(item)"
            />
            <span>{{ formatTime(item.duration || 0) }}</span>
          </div>

          <!-- Hidden audio element -->
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

    <!-- Main ADD button (always visible) -->
    <button
      @click="triggerFileInput"
      :disabled="files.length >= 10 || isSubmitting"
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6',
        files.length >= 10 || isSubmitting
          ? 'bg-white/5 cursor-not-allowed'
          : 'bg-[#000C9C]/40 hover:bg-[#6D01D0]',
      ]"
    >
      <AddIcon
        class="2xl:w-[24px] 2xl:h-[24px] xl:w-[20px] xl:h-[20px] lg:w-[18px] lg:h-[18px] w-[16px] h-[16px]"
      />
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
        Uploading... {{ uploadProgress }}%
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

    <!-- Publish button (only shows when files are selected) -->
    <div v-if="files.length > 0" class="flex justify-end mb-6">
      <button
        @click="submitPost"
        :disabled="isSubmitting || files.length === 0"
        class="cursor-pointer w-[75px] sm:w-[80px] md:w-[85px] lg:w-[95px] xl:w-[105px] 2xl:w-[119px] 2xl:h-[37px] bg-[#6D01D0]/20 xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center text-[#6D01D0] inter-font [@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? "Publishing..." : "Publish" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddIcon from "../../../SVG/AddPosts_Icons/AddIcon.vue";
import MediaClose11 from "@/components/SVG/AddPosts_Icons/AudioClose11.vue";
import PlayPauseIcon from "@/components/SVG/AddPosts_Icons/PlayPauseIcon.vue";
import AudioPost from "@/components/SVG/AddPosts_Icons/AudioCover.vue";
import { ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

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

// State
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<AudioFile[]>([]);
const isSubmitting = ref(false);
const submitError = ref("");
const successMessage = ref("");
const uploadProgress = ref(0);
const showDebug = ref(false);

// File input trigger
const triggerFileInput = () => {
  console.log("🎵 Triggering file input...");
  console.log("Files count:", files.value.length);
  console.log("Is submitting:", isSubmitting.value);
  console.log("File input element:", fileInput.value);

  if (files.value.length < 10 && !isSubmitting.value && fileInput.value) {
    fileInput.value.click();
    console.log("✅ File input clicked");
  } else {
    console.log("❌ Cannot trigger file input");
  }
};

// Handle file selection
const handleFileChange = async (event: Event) => {
  console.log("🎵 === FILE CHANGE EVENT ===");
  const input = event.target as HTMLInputElement;
  const selected = input.files;

  console.log("Selected files:", selected);
  console.log("Files count:", selected?.length || 0);

  if (!selected) {
    console.log("No files selected");
    return;
  }

  const availableSlots = 10 - files.value.length;
  const newFiles = Array.from(selected).slice(0, availableSlots);
  console.log("Processing files:", newFiles.length);

  for (const file of newFiles) {
    console.log(
      "📁 Processing file:",
      file.name,
      "Type:",
      file.type,
      "Size:",
      file.size,
    );

    if (!file.type.startsWith("audio/")) {
      submitError.value = `${file.name} is not an audio file`;
      console.error("❌ Invalid file type:", file.type);
      continue;
    }

    if (file.size > 50 * 1024 * 1024) {
      submitError.value = `${file.name} exceeds 50MB limit`;
      console.error("❌ File too large:", file.size);
      continue;
    }

    const preview = URL.createObjectURL(file);
    const newAudioFile: AudioFile = {
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
    };

    files.value.push(newAudioFile);
    console.log("✅ Added file to array:", newAudioFile.title);
  }

  console.log("Total files after processing:", files.value.length);

  await nextTick();

  // Set audio refs
  files.value.forEach((item, index) => {
    const audioEl = document.querySelectorAll<HTMLAudioElement>("audio")[index];
    if (audioEl) {
      item.audioRef = audioEl;
      console.log(`✅ Audio ref set for file ${index}`);
    } else {
      console.warn(`⚠️ No audio element found for file ${index}`);
    }
  });

  input.value = "";
  submitError.value = "";
};

// Remove file
const removeFile = (index: number) => {
  console.log("🗑️ Removing file at index:", index);
  const item = files.value[index];
  if (item.preview) {
    URL.revokeObjectURL(item.preview);
  }
  files.value.splice(index, 1);
  console.log("Files remaining:", files.value.length);
};

// Audio player functions
const togglePlay = (item: AudioFile) => {
  console.log("▶️ Toggle play for:", item.title);
  if (!item.audioRef) {
    console.warn("⚠️ No audio ref for:", item.title);
    return;
  }

  // Stop other players
  files.value.forEach((f) => {
    if (f !== item && f.audioRef && !f.audioRef.paused) {
      f.audioRef.pause();
      f.isPlaying = false;
    }
  });

  if (item.isPlaying) {
    item.audioRef.pause();
  } else {
    item.audioRef.play().catch((e) => {
      console.error("❌ Play failed:", e);
      submitError.value = "Failed to play audio";
    });
  }
  item.isPlaying = !item.isPlaying;
};

const updateTime = (item: AudioFile) => {
  if (item.audioRef) item.currentTime = item.audioRef.currentTime;
};

const loadMetadata = (item: AudioFile) => {
  if (item.audioRef) item.duration = item.audioRef.duration;
};

const seekAudio = (item: AudioFile, e: Event) => {
  const time = parseFloat((e.target as HTMLInputElement).value);
  if (item.audioRef) {
    item.audioRef.currentTime = time;
    item.currentTime = time;
  }
};

const formatTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const getFillStyle = (item: AudioFile) => {
  const dur = item.duration || 1;
  const cur = item.currentTime || 0;
  const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
  return {
    background: `linear-gradient(to right, #6d01d0 0%, #6d01d0 ${pct}%, #ffffff ${pct}%, #ffffff 100%)`,
  };
};

// Submit post
const submitPost = async () => {
  console.log("🚀 === SUBMIT POST ===");
  console.log("Files to submit:", files.value.length);

  if (files.value.length === 0) {
    submitError.value = "Please select at least one audio file";
    console.log("❌ No files selected");
    return;
  }

  // Validate titles and artists
  const invalidFiles = files.value.filter(
    (item) => !item.title.trim() || !item.artist.trim(),
  );
  if (invalidFiles.length > 0) {
    submitError.value = "Please fill in title and artist for all audio files";
    console.log("❌ Missing titles/artists:", invalidFiles);
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";
  successMessage.value = "";
  uploadProgress.value = 0;

  try {
    console.log("📦 Creating FormData...");
    const formData = new FormData();

    // Add audio files
    files.value.forEach((item, index) => {
      formData.append("audio_files", item.file);
      console.log(`📁 Added audio file ${index}:`, item.file.name);
    });

    // Add titles and artists
    files.value.forEach((item, index) => {
      formData.append("titles", item.title.trim());
      formData.append("artists", item.artist.trim());
      console.log(`📝 Added metadata ${index}:`, item.title, "-", item.artist);
    });

    // Debug FormData contents
    console.log("📋 === FORM DATA CONTENTS ===");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File
          ? `File: ${value.name} (${value.size} bytes)`
          : value,
      );
    }

    // Progress simulation
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 85) {
        uploadProgress.value += Math.random() * 15;
      }
    }, 300);

    console.log(`🌐 Making request to: ${API_URL}/posts/audio`);

    // Make API request
    const response = await fetch(`${API_URL}/posts/audio`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    clearInterval(progressInterval);

    console.log("📡 === RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("OK:", response.ok);

    if (!response.ok) {
      let errorMsg = "Failed to create audio post";
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

    console.log("✅ Audio post created successfully:", result);
    successMessage.value = "Audio post created successfully! Redirecting...";

    // Cleanup
    files.value.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });

    // Reset and redirect
    setTimeout(() => {
      files.value = [];
      successMessage.value = "";
      router.push("/");
    }, 2000);
  } catch (error) {
    console.error("❌ === ERROR CREATING AUDIO POST ===");
    console.error("Error:", error);
    submitError.value =
      error instanceof Error ? error.message : "Failed to create audio post";
    uploadProgress.value = 0;
  } finally {
    isSubmitting.value = false;
  }
};

// Cleanup
onUnmounted(() => {
  files.value.forEach((item) => {
    if (item.preview) URL.revokeObjectURL(item.preview);
  });
});

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
  background: #6d01d0;
  border-radius: 50%;
  cursor: pointer;
  margin-top: 0px;
}

.range-thumb-purple::-moz-range-thumb {
  height: 12px;
  width: 12px;
  background: #6d01d0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
