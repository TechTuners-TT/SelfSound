<template>
  <div class="m-[20px]">
    <!-- Title -->
    <div class="flex items-center mb-6">
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-white inter-font"
      >
        Attach MusicXML files
      </h1>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".musicxml,.xml,.mxl"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- File preview -->
    <div
      v-if="files.length"
      class="bg-[#000C9C]/40 mb-6 rounded-[5px] pt-[20px] p-[10px] sm:pt-[25px] sm:p-[15px] 2xl:pt-[30px] 2xl:p-[20px]"
    >
      <div
        class="relative bg-white/10 mb-[12px] rounded-[5px]"
        v-for="(item, idx) in files"
        :key="idx"
      >
        <!-- File card -->
        <div
          class="p-[10px] sm:p-[12px] lg:p-[13px] xl:p-[14px] 2xl:p-[15px] rounded-[5px] transition"
        >
          <div class="flex items-center">
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

            <!-- File info with editable fields -->
            <div class="flex flex-col text-white w-3/5 space-y-2">
              <!-- Title input -->
              <input
                v-model="item.title"
                type="text"
                placeholder="Song/Piece title"
                class="bg-transparent border-b border-white/30 text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] [@media(min-width:1537px)]:text-[24px] font-bold text-white placeholder-gray-400 focus:border-[#6D01D0] focus:outline-none"
                :disabled="isSubmitting"
                required
                :aria-label="`Title for ${item.file.name}`"
              />
              <!-- Composer input -->
              <input
                v-model="item.composer"
                type="text"
                placeholder="Composer name"
                class="bg-transparent border-b border-white/30 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] [@media(min-width:1537px)]:text-[16px] text-white placeholder-gray-400 focus:border-[#6D01D0] focus:outline-none"
                :disabled="isSubmitting"
                required
                :aria-label="`Composer for ${item.file.name}`"
              />
              <!-- File size display -->
              <p
                class="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] [@media(min-width:1537px)]:text-[16px] text-white/50"
              >
                {{ fileSizeInKB(item.file) }} KB
              </p>
            </div>

            <!-- Remove file button -->
            <button
              @click.stop="removeFile(idx)"
              :disabled="isSubmitting"
              class="absolute top-1/2 right-[12px] sm:right-[15px] md:right-[17px] lg:right-[20px] xl:right-[22px] 2xl:right-[25.85px] transform -translate-y-1/2 h-[10px] sm:h-[12px] md:h-[14px] lg:h-[16px] xl:h-[18px] 2xl:h-[20px] w-[10px] sm:w-[12px] md:w-[14px] lg:w-[16px] xl:w-[18px] 2xl:w-[20px] rounded-full flex items-center justify-center disabled:opacity-50"
              :aria-label="`Remove ${item.file.name}`"
            >
              <AudioClose11 />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add button -->
    <button
      @click="triggerFileInput"
      :disabled="files.length >= 5 || isSubmitting"
      :class="[
        'w-full 2xl:h-[50px] h-[40px] 2xl:rounded-[10px] rounded-[5px] transition inter-font text-white font-bold text-xl flex items-center justify-center mb-6',
        files.length >= 5 || isSubmitting
          ? 'bg-white/5 cursor-not-allowed'
          : 'bg-[#000C9C]/40 hover:bg-[#6D01D0]',
      ]"
      aria-label="Add MusicXML files"
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
          role="progressbar"
          :aria-valuenow="uploadProgress"
          aria-valuemin="0"
          aria-valuemax="100"
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
        <button
          @click="submitError = ''"
          class="text-red-200 hover:text-white"
          aria-label="Close error message"
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
          aria-label="Close success message"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Submit button (only shows when files are selected) -->
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
import AudioClose11 from "@/components/SVG/AddPosts_Icons/AudioClose11.vue";
import XMLIcon from "@/components/SVG/AddPosts_Icons/XMLIcon.vue";
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

interface MusicXMLFile {
  preview: string;
  file: File;
  title: string;
  composer: string;
  avatar: string;
}

// State
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<MusicXMLFile[]>([]);
const isSubmitting = ref(false);
const submitError = ref("");
const successMessage = ref("");
const uploadProgress = ref(0);

// Trigger file input
const triggerFileInput = () => {
  console.log("📄 Triggering MusicXML file input...");
  if (files.value.length < 5 && !isSubmitting.value && fileInput.value) {
    fileInput.value.click();
  }
};

// Handle file change
const handleFileChange = (event: Event) => {
  console.log("📄 === MUSICXML FILE CHANGE EVENT ===");
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;

  if (!selectedFiles) {
    console.log("No files selected");
    return;
  }

  const newFiles = Array.from(selectedFiles);
  console.log("Selected files:", newFiles.length);

  // Check how many files are already added
  const remainingFilesCount = 5 - files.value.length;
  const filesToAdd = newFiles.slice(0, remainingFilesCount);

  if (filesToAdd.length > 0) {
    for (const file of filesToAdd) {
      console.log(
        "📁 Processing XML file:",
        file.name,
        "Type:",
        file.type,
        "Size:",
        file.size,
      );

      // Check file type
      const isValidXML =
        file.name.endsWith(".musicxml") ||
        file.name.endsWith(".xml") ||
        file.name.endsWith(".mxl") ||
        file.type === "application/xml" ||
        file.type === "text/xml";

      if (isValidXML) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          submitError.value = `${file.name} exceeds 10MB limit`;
          console.error("❌ File too large:", file.size);
          continue;
        }

        const preview = URL.createObjectURL(file);
        const newXMLFile: MusicXMLFile = {
          preview,
          file,
          title: file.name.replace(/\.[^/.]+$/, ""), // Name without extension
          composer: "Unknown Composer",
          avatar: "",
        };

        files.value.push(newXMLFile);
        console.log("✅ Added XML file to array:", newXMLFile.title);
      } else {
        submitError.value = `${file.name} is not a valid MusicXML file`;
        console.error("❌ Invalid file type:", file.type);
      }
    }
  }

  console.log("Total XML files after processing:", files.value.length);
  target.value = ""; // Clear input for reuse

  // Clear error if files were added successfully
  if (
    filesToAdd.some(
      (file) =>
        file.name.endsWith(".musicxml") ||
        file.name.endsWith(".xml") ||
        file.name.endsWith(".mxl") ||
        file.type === "application/xml",
    )
  ) {
    submitError.value = "";
  }
};

// Get file size in KB
const fileSizeInKB = (file: File) => {
  return (file.size / 1024).toFixed(2);
};

// Remove file from array
const removeFile = (idx: number) => {
  console.log("🗑️ Removing XML file at index:", idx);
  const item = files.value[idx];
  if (item.preview) {
    URL.revokeObjectURL(item.preview);
  }
  files.value.splice(idx, 1);
  console.log("XML files remaining:", files.value.length);
};

// Submit MusicXML post
const submitPost = async () => {
  console.log("🚀 === SUBMIT MUSICXML POST ===");
  console.log("Files to submit:", files.value.length);

  if (files.value.length === 0) {
    submitError.value = "Please select at least one MusicXML file";
    return;
  }

  // Validate titles and composers
  const invalidFiles = files.value.filter(
    (item) => !item.title.trim() || !item.composer.trim(),
  );
  if (invalidFiles.length > 0) {
    submitError.value =
      "Please fill in title and composer for all MusicXML files";
    console.log("❌ Missing titles/composers:", invalidFiles);
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";
  successMessage.value = "";
  uploadProgress.value = 0;

  try {
    console.log("📦 Creating FormData for MusicXML...");
    const formData = new FormData();

    // Add MusicXML files
    files.value.forEach((item, index) => {
      formData.append("musicxml_files", item.file);
      console.log(`📁 Added XML file ${index}:`, item.file.name);
    });

    // Add titles and composers
    files.value.forEach((item, index) => {
      formData.append("titles", item.title.trim());
      formData.append("composers", item.composer.trim());
      console.log(
        `📝 Added metadata ${index}:`,
        item.title,
        "-",
        item.composer,
      );
    });

    // Debug FormData contents
    console.log("📋 === FORM DATA CONTENTS ===");
    for (const [key, value] of formData.entries()) {
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

    console.log(`🌐 Making request to: ${API_URL}/posts/musicxml`);

    // Make API request
    const response = await fetch(`${API_URL}/posts/musicxml`, {
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
      let errorMsg = "Failed to create MusicXML post";
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

    console.log("✅ MusicXML post created successfully:", result);
    successMessage.value = "MusicXML post created successfully! Redirecting...";

    // Cleanup
    files.value.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });

    // Force home page refresh (same as audio posts)
    setTimeout(() => {
      files.value = [];
      successMessage.value = "";

      const currentPath = window.location.pathname;
      const isAlreadyOnHome =
        currentPath === "/" || currentPath.includes("home");

      if (isAlreadyOnHome) {
        console.log("🔄 Already on home page, forcing reload...");
        window.location.reload();
      } else {
        console.log("🏠 Navigating to home...");
        router.push("/").then(() => {
          setTimeout(() => {
            console.log("🔄 Forcing home page reload...");
            window.location.reload();
          }, 100);
        });
      }
    }, 1500);
  } catch (error) {
    console.error("❌ === ERROR CREATING MUSICXML POST ===");
    console.error("Error:", error);
    submitError.value =
      error instanceof Error ? error.message : "Failed to create MusicXML post";
    uploadProgress.value = 0;
  } finally {
    isSubmitting.value = false;
  }
};

// Open file on click
const openFile = (preview: string) => {
  window.open(preview, "_blank");
};

// Cleanup
onUnmounted(() => {
  files.value.forEach((item) => {
    if (item.preview) URL.revokeObjectURL(item.preview);
  });
});

defineExpose({
  fileInput,
  files,
  triggerFileInput,
  handleFileChange,
  fileSizeInKB,
  removeFile,
  submitPost,
  openFile,
});
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
