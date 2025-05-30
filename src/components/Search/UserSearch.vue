<template>
  <div class="w-full flex justify-center pt-[5vh] px-[5%]">
    <div class="w-full max-w-[600px] space-y-6">
      <!-- Search Input -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FFFFFF1a] text-white placeholder-white focus:outline-none"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#000C9C]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      </div>

      <!-- User List -->
      <div class="space-y-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between bg-transparent"
        >
          <!-- User clickable area -->
          <div
            class="flex items-center gap-4 min-w-0 cursor-pointer"
            @click="onUserClick(user)"
          >
            <img
              :src="user.avatar_url || defaultAvatar"
              alt="User Avatar"
              class="w-[60px] h-[60px] flex-shrink-0 bg-gray-300 rounded-full object-cover"
            />
            <div class="min-w-0">
              <p class="text-white font-medium leading-5 truncate">
                {{ user.name }}
              </p>
              <p class="text-gray-400 text-sm truncate">@{{ user.login }}</p>
            </div>
          </div>

          <button
            @click.stop="toggleActive(user)"
            :class="[
              'text-white px-5 py-1 rounded-md cursor-pointer transition-colors duration-200',
              user.active ? 'bg-[#000C9C80]' : 'bg-[#6D01D080]',
            ]"
          >
            {{ user.active ? "Unlisten" : "Listen" }}
          </button>
        </div>

        <p
          v-if="users.length === 0 && searchQuery.trim()"
          class="text-gray-400 text-center"
        >
          No results found.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface UserProfile {
  id: string;
  name: string;
  login: string;
  avatar_url?: string;
  active?: boolean;
}

const router = useRouter();

const searchQuery = ref("");
const users = ref<UserProfile[]>([]);
const defaultAvatar = "/default-avatar.png";
const isGuest = ref(false);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const fetchUsers = async (query = "") => {
  try {
    const url = new URL(`${API_URL}/profiles/search`);
    if (query.trim()) {
      url.searchParams.set("query", query.trim());
    }

    const searchRes = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });

    const profiles: UserProfile[] = (await searchRes.ok)
      ? await searchRes.json()
      : [];

    // Try fetching listened users (only for signed-in users)
    const listenedRes = await fetch(`${API_URL}/profiles/listened`, {
      method: "GET",
      credentials: "include",
    });

    let listenedIds = new Set<string>();

    if (listenedRes.ok) {
      const listened: UserProfile[] = await listenedRes.json();
      listenedIds = new Set(listened.map((u) => u.id));
      isGuest.value = false;
    } else {
      isGuest.value = true;
    }

    users.value = profiles.map((user) => ({
      ...user,
      active: listenedIds.has(user.id),
    }));
  } catch (err) {
    console.error("Error fetching users:", err);
    isGuest.value = true;
  }
};

const toggleActive = async (user: UserProfile) => {
  if (isGuest.value) {
    console.warn("Guest user detected. Redirecting to sign-in...");
    router.push("/sign-in"); // or { name: "SignIn" }
    return;
  }

  try {
    const url = `${API_URL}/profiles/listening/${user.id}`;
    const method = user.active ? "DELETE" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to toggle listen");

    user.active = !user.active;
  } catch (err) {
    console.error("Error toggling listen state:", err);
  }
};

const onUserClick = (user: UserProfile) => {
  router.push({ name: "AnotherUserProfile", params: { userId: user.id } });
};

watch(
  searchQuery,
  (query) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchUsers(query);
    }, 300);
  },
  { immediate: true },
);

onMounted(fetchUsers);

onBeforeUnmount(() => {
  if (searchTimeout) clearTimeout(searchTimeout);
});
</script>

<style scoped></style>
