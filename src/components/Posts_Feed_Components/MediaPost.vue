<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="w-full max-w-4xl bg-[#111] rounded-lg p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl xl:text-3xl font-bold text-white inter-font">
          Create Media Post
        </h1>
        <button
          @click="goBack"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- File Upload Area -->
      <div class="mb-6">
        <div
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          :class="{
            'border-[#6D01D0] bg-[#6D01D0]/5': isDragging,
            'border-gray-600': !isDragging,
          }"
          class="border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer hover:border-[#6D01D0]/50"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/mov,video/avi,video/mkv,video/webm"
            multiple
            class="hidden"
            @change="handleFileChange"
          />

          <div v-if="files.length === 0">
            <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                class="w-full h-full"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p class="text-xl mb-2 text-white">
              Drop files here or click to upload
            </p>
            <p class="text-sm text-gray-400 mb-2">
              Images (10MB max) and videos (100MB max)
            </p>
            <p class="text-xs text-gray-500">
              Maximum 10 files per post • Total size limit: 200MB
            </p>
          </div>

          <div v-else class="text-green-400">
            <p class="text-lg">{{ files.length }} file(s) selected</p>
            <p class="text-sm text-gray-400 mt-1">Click to add more files</p>
          </div>
        </div>
      </div>

      <!-- File Preview Grid -->
      <div v-if="files.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold mb-4 text-white">Selected Files:</h3>
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto"
        >
          <div
            v-for="(item, idx) in files"
            :key="idx"
            class="relative group cursor-pointer"
            @click="previewFile(item)"
          >
            <!-- Image Preview -->
            <div
              v-if="item.type.startsWith('image/')"
              class="aspect-square rounded-lg overflow-hidden bg-gray-800"
            >
              <img
                :src="item.preview"
                :alt="item.file.name"
                class="zoomable-media w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>

            <!-- Video Preview -->
            <div
              v-else
              class="aspect-square rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center"
            >
              <div class="relative w-full h-full">
                <video
                  :src="item.preview"
                  class="w-full h-full object-cover"
                  muted
                />
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click.stop="removeFile(idx)"
              class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>

            <!-- File Info -->
            <p
              class="text-xs text-gray-400 mt-2 truncate"
              :title="item.file.name"
            >
              {{ item.file.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatFileSize(item.file.size) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Caption Input -->
      <div v-if="files.length > 0" class="mb-6">
        <label class="block text-sm font-medium mb-2 text-white"
          >Caption (optional)</label
        >
        <textarea
          v-model="caption"
          placeholder="Write a caption for your post..."
          rows="4"
          class="w-full p-4 bg-[#222] border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-[#6D01D0] focus:outline-none focus:ring-1 focus:ring-[#6D01D0]"
          :maxlength="500"
          :disabled="isUploading"
        ></textarea>
        <p class="text-xs text-gray-400 mt-1">{{ caption.length }}/500</p>
      </div>

      <!-- Upload Progress -->
      <div v-if="isUploading" class="mb-6">
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
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-600 text-white rounded-lg"
      >
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

      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <button
          @click="goBack"
          class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          :disabled="isUploading"
        >
          Cancel
        </button>

        <button
          v-if="files.length > 0"
          @click="submitPost"
          :disabled="isUploading"
          class="px-8 py-3 bg-[#6D01D0] hover:bg-[#5a0ba8] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
        >
          {{ isUploading ? "Publishing..." : "Publish Post" }}
        </button>
      </div>

      <!-- Modal Preview -->
      <div
        v-if="modalPreview"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        @click.self="modalPreview = null"
      >
        <div class="relative max-w-4xl max-h-full">
          <button
            @click="modalPreview = null"
            class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>

          <!-- Image Preview -->
          <img
            v-if="modalPreview?.type.startsWith('image/')"
            :src="modalPreview.preview"
            class="max-w-full max-h-full object-contain rounded-lg"
          />

          <!-- Video Preview -->
          <video
            v-else
            :src="modalPreview.preview"
            controls
            autoplay
            class="max-w-full max-h-full object-contain rounded-lg"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import mediumZoom from "medium-zoom";
import type { Zoom } from "medium-zoom";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

// Component state
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<{ preview: string; file: File; type: string }[]>([]);
const modalPreview = ref<{ preview: string; file: File; type: string } | null>(
  null,
);
const zoomInstance = ref<Zoom | null>(null);

// Form state
const caption = ref("");
const isDragging = ref(false);
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

// Navigation
const goBack = () => {
  if (isUploading.value) return;
  cleanupPreviewUrls();
  router.push("/");
};

// File handling
const triggerFileInput = () => {
  if (files.value.length < MAX_FILES && !isUploading.value) {
    fileInput.value?.click();
  }
};

// Drag and drop handlers
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  const target = event.currentTarget as Element;
  const relatedTarget = event.relatedTarget as Node | null;
  if (!target || !relatedTarget || !target.contains(relatedTarget)) {
    isDragging.value = false;
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

// Add files with validation
const addFiles = (newFiles: File[]) => {
  errorMessage.value = "";

  // Check total file count
  if (files.value.length + newFiles.length > MAX_FILES) {
    errorMessage.value = `Maximum ${MAX_FILES} files allowed per post`;
    return;
  }

  // Validate each file
  const validFiles: File[] = [];
  for (const file of newFiles) {
    const error = validateFile(file);
    if (error) {
      errorMessage.value = error;
      return;
    }

    // Check for duplicates (same name and size)
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
};

// File input change handler
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (!selectedFiles) return;

  addFiles(Array.from(selectedFiles));

  // Reset input to allow selecting the same files again
  target.value = "";
};

// Remove file
const removeFile = (idx: number) => {
  const item = files.value[idx];
  if (item && previewUrls.has(item.preview)) {
    window.URL.revokeObjectURL(item.preview);
    previewUrls.delete(item.preview);
  }
  files.value.splice(idx, 1);
};

// File size formatter
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Preview file in modal
const previewFile = (item: { preview: string; file: File; type: string }) => {
  modalPreview.value = item;
};

// Submit post to backend
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

    // Add caption if provided
    if (caption.value.trim()) {
      formData.append("caption", caption.value.trim());
    }

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
    successMessage.value = "Post created successfully! Redirecting...";

    // Clean up
    cleanupPreviewUrls();

    // Reset form and redirect after short delay
    setTimeout(() => {
      files.value = [];
      caption.value = "";
      successMessage.value = "";
      router.push("/");
    }, 2000);
  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value =
      error instanceof Error ? error.message : "Failed to create post";
    uploadProgress.value = 0;
  } finally {
    isUploading.value = false;
  }
};

// Initialize zoom functionality
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

// Clean up preview URLs
const cleanupPreviewUrls = () => {
  previewUrls.forEach((url) => window.URL.revokeObjectURL(url));
  previewUrls.clear();
};

// Lifecycle hooks
onMounted(setupZoom);
watch(files, setupZoom);
onUnmounted(() => {
  cleanupPreviewUrls();
});
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
