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
            d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <!-- User List -->
      <div class="space-y-4">
        <div
          v-for="user in filteredUsers"
          :key="user.username"
          class="flex items-center justify-between bg-transparent"
        >
          <div class="flex items-center gap-4 min-w-0 cursor-pointer">
            <!-- Avatar -->
            <div
              class="w-[60px] h-[60px] flex-shrink-0 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-500"
            ></div>
            <!-- User Info -->
            <div class="min-w-0">
              <p class="text-white font-medium leading-5 truncate">
                {{ user.name }}
              </p>
              <p class="text-gray-400 text-sm truncate">@{{ user.username }}</p>
            </div>
          </div>
          <!-- Button -->
          <button
            @click="toggleActive(user.username)"
            :class="{
              'bg-[#6D01D080]': !user.active,
              'bg-[#000C9C80]': user.active,
            }"
            class="text-white px-5 py-1 rounded-md cursor-pointer"
          >
            Listen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchQuery = ref("");
const users = ref([
  { name: "Marcus Chen", username: "mchen", active: false },
  { name: "Elena Rodriguez", username: "elenarodz", active: false },
  { name: "Marcus Chen", username: "mchen1", active: false },
  { name: "Marcus Chen", username: "mchen2", active: false },
  { name: "Marcus Chen", username: "mchen3", active: false },
  { name: "Marcus Chen", username: "mchen4", active: false },
]);

const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Функція для перемикання активного стану
const toggleActive = (username: string) => {
  const user = users.value.find((u) => u.username === username);
  if (user) {
    user.active = !user.active;
  }
};
</script>
