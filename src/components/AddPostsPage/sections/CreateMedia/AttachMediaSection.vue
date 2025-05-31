<template>
  <div class="m-[20px]">
    <!-- Title -->
    <div class="flex items-center mb-6">
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
      >
        Attach media files
      </h1>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/mov,video/avi,video/mkv,video/webm"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- File preview with zoom support -->
    <div class="space-y-6 mb-6">
      <div
        v-for="(item, idx) in files"
        :key="idx"
        class="relative group cursor-pointer"
        @click="previewFile(item)"
      >
        <!-- Image preview -->
        <img
          v-if="item.type.startsWith('image/')"
          :src="item.preview"
          :alt="`Preview ${idx + 1}`"
          class="zoomable-media w-full object-contain h-full rounded-lg"
        />

        <!-- Video preview -->
        <video
          v-else
          :src="item.preview"
          controls
          class="zoomable-media w-full object-contain max-h-[400px] rounded-lg"
        ></video>

        <button
          @click.stop="removeFile(idx)"
          class="bg-[#000000]/50 cursor-pointer absolute top-[8px] right-[8px] text-white text-[20px] rounded-[5px] w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] xl:w-[26px] xl:h-[26px] flex items-center justify-center"
        >
          <MediaClose />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-600 text-white rounded-lg">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button
          @click="errorMessage = ''"
          class="text-red-200 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-4 p-3 bg-green-600 text-white rounded-lg"
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

    <!-- Upload Progress -->
    <div v-if="isUploading" class="mb-4">
      <div class="bg-gray-700 rounded-full h-2 mb-2">
        <div
          class="bg-[#6D01D0] h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-sm text-gray-400">Uploading... {{ uploadProgress }}%</p>
    </div>

    <!-- Add button -->
    <button
      @click="triggerFileInput"
      :disabled="files.length >= 10 || isUploading"
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6',
        files.length >= 10 || isUploading
          ? 'bg-white/5 cursor-not-allowed'
          : 'bg-[#000C9C]/40 hover:bg-[#6D01D0]',
      ]"
    >
      <AddIcon
        class="2xl:w-[24px] 2xl:h-[24px] xl:w-[20px] xl:h-[20px] lg:w-[18px] lg:h-[18px] w-[16px] h-[16px]"
      />
    </button>

    <!-- Submit button (only shows when files are selected) -->
    <div v-if="files.length > 0" class="flex justify-end mb-6">
      <button
        @click="submitPost"
        :disabled="isUploading"
        :class="[
          'cursor-pointer w-[75px] sm:w-[80px] md:w-[85px] lg:w-[95px] xl:w-[105px] 2xl:w-[119px] 2xl:h-[37px] xl:h-[32px] lg:h-[28px] md:h-[24px] sm:h-[20px] h-[18px] 2xl:rounded-[10px] rounded-[5px] transition font-bold text-xl flex items-center justify-center inter-font [@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px]',
          isUploading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-[#6D01D0]/20 text-[#6D01D0] hover:bg-[#6D01D0] hover:text-white',
        ]"
      >
        <p>{{ isUploading ? "Uploading..." : "Publish" }}</p>
      </button>
    </div>

    <!-- Modal with zoom support -->
    <div
      v-if="modalPreview"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-auto"
      @click.self="modalPreview = null"
    >
      <!-- Modal with responsive sizes for screens -->
      <div
        class="relative max-w-[90%] max-h-[90%] xl:w-[50vw] xl:h-[50vh] overflow-auto p-4"
      >
        <!-- Image preview -->
        <img
          v-if="modalPreview?.type.startsWith('image/')"
          :src="modalPreview.preview"
          :alt="'Preview of ' + modalPreview.file.name"
          class="zoomable-media object-contain w-full h-full transform hover:scale-150 transition duration-300"
        />

        <!-- Video preview -->
        <video
          v-else
          :src="modalPreview.preview"
          controls
          autoplay
          class="zoomable-media object-contain w-full h-full transform hover:scale-125 transition duration-300"
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MediaClose from "@/components/SVG/AddPosts_Icons/MediaClose.vue";
import AddIcon from "@/components/SVG/AddPosts_Icons/AddIcon.vue";
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import mediumZoom from "medium-zoom";
import type { Zoom } from "medium-zoom";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<{ preview: string; file: File; type: string }[]>([]);
const modalPreview = ref<{ preview: string; file: File; type: string } | null>(
  null,
);
const zoomInstance = ref<Zoom | null>(null);

// Form state
const isUploading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref("");
const successMessage = ref("");

// Store preview URLs for cleanup
const previewUrls = new Set<string>();

// File validation constants (matching backend)
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/mkv",
  "video/webm",
]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB
const MAX_FILES = 10;

// Trigger file selection
const triggerFileInput = () => {
  if (files.value.length < MAX_FILES && !isUploading.value) {
    fileInput.value?.click();
  }
};

// File validation
const validateFile = (file: File): string | null => {
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

  if (!isImage && !isVideo) {
    return `${file.name}: Unsupported file type. Please use images (JPEG, PNG, GIF, WebP) or videos (MP4, MOV, AVI, MKV, WebM)`;
  }

  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `${file.name}: File size exceeds ${maxSizeMB}MB limit`;
  }

  return null;
};

// Handle file change
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles) return;

  errorMessage.value = "";

  // Check total file count
  if (files.value.length + selectedFiles.length > MAX_FILES) {
    errorMessage.value = `Maximum ${MAX_FILES} files allowed per post`;
    return;
  }

  const newFiles = Array.from(selectedFiles).slice(
    0,
    MAX_FILES - files.value.length,
  );

  // Validate each file
  const validFiles: File[] = [];
  for (const file of newFiles) {
    const error = validateFile(file);
    if (error) {
      errorMessage.value = error;
      return;
    }

    // Check for duplicates
    if (
      !files.value.some(
        (existing) =>
          existing.file.name === file.name && existing.file.size === file.size,
      )
    ) {
      validFiles.push(file);
    }
  }

  // Check total size
  const currentTotalSize = files.value.reduce(
    (sum, item) => sum + item.file.size,
    0,
  );
  const newTotalSize = validFiles.reduce((sum, file) => sum + file.size, 0);

  if (currentTotalSize + newTotalSize > MAX_TOTAL_SIZE) {
    errorMessage.value = "Total file size exceeds 200MB limit";
    return;
  }

  // Add valid files
  for (const file of validFiles) {
    const preview = window.URL.createObjectURL(file);
    previewUrls.add(preview);
    files.value.push({ preview, file, type: file.type });
  }

  // Reset input
  target.value = "";
};

// Remove file from list
const removeFile = (idx: number) => {
  const item = files.value[idx];
  if (item && previewUrls.has(item.preview)) {
    window.URL.revokeObjectURL(item.preview);
    previewUrls.delete(item.preview);
  }
  files.value.splice(idx, 1);
};

// Clean up preview URLs
const cleanupPreviewUrls = () => {
  previewUrls.forEach((url) => window.URL.revokeObjectURL(url));
  previewUrls.clear();
};

// Submit files to backend
const submitPost = async () => {
  if (files.value.length === 0 || isUploading.value) return;

  isUploading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  uploadProgress.value = 0;

  try {
    const formData = new FormData();

    // Add files
    files.value.forEach((item) => {
      formData.append("files", item.file);
    });

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 85) {
        uploadProgress.value += Math.random() * 15;
      }
    }, 300);

    const response = await fetch(`${API_URL}/posts/media`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      let errorMsg = "Failed to create post";
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const result = await response.json();
    uploadProgress.value = 100;

    console.log("Post created successfully:", result);
    successMessage.value = "Post created successfully!";

    // Clean up
    cleanupPreviewUrls();

    // Reset form after a short delay to show success message
    setTimeout(() => {
      files.value = [];
      successMessage.value = "";

      // Navigate back to home/feed
      router.push("/home");
    }, 1500);
  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value =
      error instanceof Error ? error.message : "Failed to create post";
    uploadProgress.value = 0;
  } finally {
    isUploading.value = false;
  }
};

// Show preview in modal
const previewFile = (item: { preview: string; file: File; type: string }) => {
  modalPreview.value = item;
  if (item.type.startsWith("image/") && !zoomInstance.value) {
    zoomInstance.value = mediumZoom(".zoomable-media", {
      background: "#000000e6",
      margin: 4,
      scrollOffset: 4,
    });
  }
};

// Initialize zoom
const setupZoom = () => {
  nextTick(() => {
    if (!zoomInstance.value) {
      zoomInstance.value = mediumZoom(".zoomable-media", {
        background: "#000000e6",
        margin: 24,
        scrollOffset: 40,
      });
    }
  });
};

// Restart zoom every time files are updated
onMounted(setupZoom);
watch(files, setupZoom);

// Cleanup on unmount
onUnmounted(() => {
  cleanupPreviewUrls();
  if (zoomInstance.value) {
    zoomInstance.value.detach();
  }
});

defineExpose({
  fileInput,
  files,
  modalPreview,
  zoomInstance,
  triggerFileInput,
  handleFileChange,
  removeFile,
  submitPost,
  previewFile,
});
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
