<template>
  <div class="m-[20px]">
    <div class="flex items-center gap-[20px] mb-[20px]">
      <h1 class="lg:text-[20px] text-[16px] font-bold text-white inter-font">
        Blocked users
      </h1>
      <label class="container size-var cursor-pointer">
        <input type="checkbox" v-model="isChecked" />
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

    <!-- Список заблокованих користувачів -->
    <div v-if="isChecked" class="space-y-4 max-w-[600px]">
      <div
        v-for="user in blockedUsers"
        :key="user.username"
        class="flex items-center justify-between bg-transparent"
      >
        <div class="flex items-center gap-4 min-w-0 cursor-pointer">
          <!-- Аватар -->
          <div
            class="w-[60px] h-[60px] flex-shrink-0 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-500"
          >
            {{ user.name.charAt(0) }}
          </div>
          <!-- Інформація -->
          <div class="min-w-0">
            <p class="text-white font-medium leading-5 truncate">
              {{ user.name }}
            </p>
            <p class="text-gray-400 text-sm truncate">@{{ user.username }}</p>
          </div>
        </div>
        <!-- Кнопка розблокування -->
        <button
          @click="toggleBlock(user.username)"
          class="text-white px-5 py-1 rounded-md bg-[#D0202F] cursor-pointer"
        >
          Unblock
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const isChecked = ref(false);

// Масив користувачів
const users = ref([
  { name: "Marcus Chen", username: "mchen", blocked: true },
  { name: "Elena Rodriguez", username: "elenarodz", blocked: true },
  { name: "Some User", username: "someuser", blocked: true },
]);

// Всі заблоковані
const blockedUsers = computed(() => users.value.filter((u) => u.blocked));

// Функція розблокування
const toggleBlock = (username: string) => {
  const user = users.value.find((u) => u.username === username);
  if (user) user.blocked = false;
};
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
</style>
