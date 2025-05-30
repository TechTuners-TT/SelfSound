<template>
  <div class="m-[20px]">
    <div class="flex items-center gap-[20px] mb-[20px]">
      <h1 class="lg:text-[20px] text-[16px] font-bold text-white inter-font">
        Blocked users
      </h1>
      <label class="container size-var cursor-pointer">
        <input type="checkbox" v-model="isChecked" @change="toggleSection" />
        <svg
          style="width: var(--size); height: var(--size); fill: var(--color)"
          viewBox="0 0 512 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
          class="chevron-down"
        >
          <path
            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
          ></path>
        </svg>
      </label>
    </div>

    <!-- Loading state -->
    <div v-if="isChecked && isLoading" class="text-white text-center py-4">
      Loading blocked users...
    </div>

    <!-- Error state -->
    <div v-if="isChecked && error" class="text-red-400 text-center py-4">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div
      v-if="isChecked && !isLoading && !error && blockedUsers.length === 0"
      class="text-gray-400 text-center py-4"
    >
      No blocked users
    </div>

    <!-- Список заблокованих користувачів -->
    <div
      v-if="isChecked && !isLoading && !error && blockedUsers.length > 0"
      class="space-y-4 max-w-[600px]"
    >
      <div
        v-for="user in blockedUsers"
        :key="user.id"
        class="flex items-center justify-between bg-transparent"
      >
        <div
          class="flex items-center gap-4 min-w-0 cursor-pointer"
          @click="navigateToProfile(user.id)"
        >
          <!-- Аватар -->
          <div
            class="w-[60px] h-[60px] flex-shrink-0 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center"
          >
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              :alt="user.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <span v-else class="text-white text-xl font-bold">
              {{ user.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <!-- Інформація -->
          <div class="min-w-0">
            <p class="text-white font-medium leading-5 truncate">
              {{ user.name || "Unknown User" }}
            </p>
            <p class="text-gray-400 text-sm truncate">
              @{{ user.login || "unknown" }}
            </p>
          </div>
        </div>
        <!-- Кнопка розблокування -->
        <button
          @click="unblockUser(user.id)"
          :disabled="unblockingUsers.has(user.id)"
          class="text-white px-5 py-1 rounded-md bg-[#D0202F] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ unblockingUsers.has(user.id) ? "Unblocking..." : "Unblock" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface BlockedUser {
  id: string;
  name: string;
  login: string;
  avatar_url?: string;
  description?: string;
  tag_id?: string;
}

const router = useRouter();
const isChecked = ref(false);
const blockedUsers = ref<BlockedUser[]>([]);
const isLoading = ref(false);
const error = ref("");
const unblockingUsers = ref(new Set<string>());

// Fetch blocked users from backend
async function fetchBlockedUsers() {
  isLoading.value = true;
  error.value = "";

  try {
    console.log("Fetching blocked users...");
    const res = await fetch(`${API_URL}/profiles/blocks`, {
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Please sign in to view blocked users");
      }
      throw new Error(`Failed to fetch blocked users: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Blocked users data:", data);

    blockedUsers.value = data || [];
  } catch (err) {
    console.error("Error fetching blocked users:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load blocked users";
  } finally {
    isLoading.value = false;
  }
}

// Unblock a user
async function unblockUser(userId: string) {
  if (unblockingUsers.value.has(userId)) return;

  unblockingUsers.value.add(userId);

  try {
    console.log(`Unblocking user: ${userId}`);
    const res = await fetch(`${API_URL}/profiles/blocks/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to unblock user");
    }

    // Remove user from blocked list
    blockedUsers.value = blockedUsers.value.filter(
      (user) => user.id !== userId,
    );

    console.log("User unblocked successfully");
  } catch (err) {
    console.error("Error unblocking user:", err);
    alert(
      `Failed to unblock user: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  } finally {
    unblockingUsers.value.delete(userId);
  }
}

// Navigate to user profile
function navigateToProfile(userId: string) {
  router.push(`/user/${userId}`);
}

// Handle image loading errors
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
}

// Toggle section and load data if needed
function toggleSection() {
  if (isChecked.value && blockedUsers.value.length === 0) {
    fetchBlockedUsers();
  }
}

// Load blocked users on component mount if section is already open
onMounted(() => {
  if (isChecked.value) {
    fetchBlockedUsers();
  }
});
</script>

<style scoped>
.container {
  --color: #a5a5b0;
  --size: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: var(--size);
  user-select: none;
  fill: var(--color);
  width: auto;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.container .chevron-down {
  position: absolute;
  animation: keyframes-return 0.5s;
}

.container input:checked ~ .chevron-down {
  animation: keyframes-rotate 0.5s;
  transform: rotate(180deg);
}

@keyframes keyframes-rotate {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: rotate(-180deg);
  }
}

@keyframes keyframes-return {
  0% {
    transform: rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg);
  }
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
