<template>
  <section class="flex flex-col gap-15 mx-auto section_1">
    <div
      class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
    >
      <button
        @click="toggleListen"
        :disabled="isLoading"
        class="cursor-pointer w-full h-8 text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] text-white rounded-[5px] shadow-sm mx-auto block inter-font disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        :style="{
          backgroundColor: isListening
            ? 'rgba(109, 1, 208,0.5)'
            : 'rgba(0, 12, 156,0.4)',
          fontWeight: '500',
        }"
      >
        {{ isLoading ? "Loading..." : isListening ? "Unlisten" : "Listen" }}
      </button>
    </div>

    <div class="w-full h-px border border-[rgba(255,255,255,0.5)]"></div>

    <!-- Simple message since posts are handled by parent -->
    <p
      class="mt-10 sm:mt-47.5 text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] text-white text-center inter-font text_size"
      style="font-weight: 400"
    >
      Posts will appear below
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

// Define interfaces for type safety
interface ListenedUser {
  id: string;
  // Add other properties as needed
}

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const router = useRouter();
const userId = route.params.userId as string;

const isListening = ref(false);
const isLoading = ref(false);
const isGuest = ref(false);

// Add emit for stats update
const emit = defineEmits<{
  (e: "stats-updated"): void;
}>();

// Check if user is authenticated
async function checkAuthStatus() {
  try {
    const res = await fetch(`${API_URL}/authorization/me`, {
      method: "GET",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Check if currently listening to this user
async function checkListeningStatus() {
  try {
    console.log("Checking listening status for userId:", userId);
    const res = await fetch(`${API_URL}/profiles/listened`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Not authenticated, treating as guest");
      isGuest.value = true;
      return false;
    }

    const listenedUsers = (await res.json()) as ListenedUser[];
    console.log("All listened users:", listenedUsers);
    console.log("Looking for userId:", userId);

    const isCurrentlyListening = listenedUsers.some((user: ListenedUser) => {
      console.log("Comparing:", user.id, "with", userId);
      return user.id === userId;
    });

    console.log("Currently listening to user:", isCurrentlyListening);
    return isCurrentlyListening;
  } catch (error) {
    console.error("Error checking listening status:", error);
    isGuest.value = true;
    return false;
  }
}

// Function to refresh listening status (exposed to parent)
const refreshListeningStatus = async () => {
  console.log("Refreshing listening status...");
  console.log("Current isListening before refresh:", isListening.value);

  try {
    const newStatus = await checkListeningStatus();
    console.log("New status from API:", newStatus);

    // Force reactivity update
    isListening.value = false; // Reset first
    await nextTick(); // Wait for DOM update
    isListening.value = newStatus; // Then set the correct value

    console.log("Updated listening status:", isListening.value);
  } catch (error) {
    console.error("Error refreshing listening status:", error);
  }
};

// Toggle listen/unlisten
async function toggleListen() {
  // Check if user is authenticated
  const isAuthenticated = await checkAuthStatus();

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to sign-in");
    router.push("/sign-in");
    return;
  }

  if (isLoading.value) return;

  isLoading.value = true;

  try {
    const method = isListening.value ? "DELETE" : "POST";
    const url = `${API_URL}/profiles/listening/${userId}`;

    console.log(`${method} ${url}`);

    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiErrorResponse;
      console.error("API error:", errorData);

      if (response.status === 401) {
        // User not authenticated
        router.push("/sign-in");
        return;
      }

      if (response.status === 403) {
        alert(
          "Cannot listen to this user because either you have blocked them or they have blocked you.",
        );
        return;
      }

      throw new Error(errorData.detail || "Failed to update listening status");
    }

    // Toggle the state
    isListening.value = !isListening.value;

    const result = await response.json();
    console.log("Success:", result.message);

    // Emit event to update stats
    emit("stats-updated");
  } catch (error) {
    console.error("Error toggling listen:", error);
    // Only show generic error for non-403 errors
    alert("Failed to update listening status. Please try again.");
  } finally {
    isLoading.value = false;
  }
}

// Initialize component
onMounted(async () => {
  console.log("AnotherPersonContent mounted for userId:", userId);

  // Check current listening status
  isListening.value = await checkListeningStatus();

  console.log("Initial listening status:", isListening.value);
  console.log("Is guest:", isGuest.value);
});

// Expose the refresh function to parent component
defineExpose({
  refreshListeningStatus,
});
</script>

<style scoped>
/* Ignore any external margin from parent containers */
section {
  margin: 0 !important; /* Forces section to ignore any margins */
}
section .max-w {
  max-width: 640px;
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
