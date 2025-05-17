<template>
  <div
    class="mb-[25px] sm:mb-[30px] md:mb-[35px] lg:mb-[40px] xl:mb-[45px] 2xl:mb-[50px]"
  >
    <div
      class="flex items-center mt-[15px] sm:mt-[20px] md:mt-[28px] lg:mt-[32px] xl:mt-[38px] 2xl:mt-[43px]"
    >
      <!-- Заголовок -->
      <h1
        class="2xl:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Notifications
      </h1>
    </div>
    <!-- Divider -->
    <div
      class="mt-[20px] sm:mt-[24px] md:mt-[28px] lg:mt-[32px] xl:mt-[35px] 2xl:mt-[40px] -mx-[10px] sm:-mx-[50px] md:-mx-[20px] lg:-mx-[30px] xl:-mx-[30px] 2xl:-mx-[40px]"
    >
      <hr class="border-t-1 border-white/50" />
    </div>
  </div>

  <!-- User List -->
  <div class="space-y-[5px]">
    <div
      v-for="user in visibleUsers"
      :key="user.id"
      class="flex justify-between items-center text-white"
    >
      <!-- Контейнер повідомлення -->
      <div
        class="flex items-center justify-between w-full h-[25px] sm:h-[28px] md:h-[32px] lg:h-[36px] xl:h-[40px] 2xl:h-[45px]"
      >
        <span>
          <svg width="6" height="7" fill="none" viewBox="0 0 6 7">
            <rect width="6" height="6" y=".5" fill="#6D01D0" rx="3" />
          </svg>
        </span>
        <!-- Username -->
        <span
          class="ml-[8px] md:ml-[10px] text-[#6D01D0] text-[12px] md:text-[13px] xl:text-[14px] font-medium truncate max-w-[120px]"
          >{{ user.username }}</span
        >

        <!-- Message -->
        <span
          v-if="user.message === 'tagged you'"
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px] underline underline-offset-2 decoration-white cursor-pointer"
          @click="goToTaggedPost(user)"
        >
          {{ user.message }}
        </span>

        <span
          v-else
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px]"
        >
          {{ user.message }}
        </span>
        <!-- Time -->
        <span
          class="text-white text-[10px] md:text-[11px] xl:text-[12px] font-normal whitespace-nowrap mr-[8px] md:mr-[10px] xl:mr-[12px]"
          >{{ formatTime(user.timestamp) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

type Notification = {
  id: number;
  name: string;
  username: string;
  message: string;
  timestamp: Date;
};

const users = ref<Notification[]>([
  {
    id: 1,
    name: "Alex Smith",
    username: "Alex_smith",
    message: "now listens you",
    timestamp: new Date(new Date().getTime() - 0 * 60 * 1000),
  },

  {
    id: 2,
    name: "Maria Chen",
    username: "maria_chen",
    message: "now listens you",
    timestamp: new Date(new Date().getTime() - 1 * 60 * 1000),
  },
  {
    id: 3,
    name: "John Doe",
    username: "john_doe",
    message: "tagged you",
    timestamp: new Date(new Date().getTime() - 5 * 60 * 1000),
  },
  {
    id: 4,
    name: "John Doe",
    username: "john_doe",
    message: "now listens you",
    timestamp: new Date(new Date().getTime() - 5 * 60 * 1000),
  },
  {
    id: 5,
    name: "Old_-1 Notification",
    username: "old-1_user",
    message: "now listens you",
    timestamp: new Date(new Date().getTime() - 29 * 60 * 1000), // старше == 30 хв — зникне
  },
  {
    id: 6,
    name: "Old Notification",
    username: "old_user",
    message: "now listens you",
    timestamp: new Date(new Date().getTime() - 30 * 60 * 1000), //  30 хв — зникне
  },
]);

const currentTime = ref(Date.now());

onMounted(() => {
  const interval = setInterval(() => {
    currentTime.value = Date.now();
  }, 60 * 1000);

  onUnmounted(() => clearInterval(interval));
});

const visibleUsers = computed(() => {
  const thirtyMinutesAgo = currentTime.value - 30 * 60 * 1000;
  return users.value.filter(
    (user) => user.timestamp.getTime() > thirtyMinutesAgo,
  );
});

function formatTime(timestamp: Date): string {
  const diffMs = currentTime.value - timestamp.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

function goToTaggedPost(user: Notification) {
  // Тут можна зробити перехід на сторінку з позначеним постом
  // Наприклад:
  console.log(`Go to post where ${user.name} tagged you`);
  // Або, якщо у вас є ID поста:
  // router.push(`/posts/${user.postId}`) — за наявності router
}
</script>

<style scoped>
/* Додаткові стилі для контейнера, якщо потрібно */
.flex {
  display: flex;
  align-items: center; /* Вертикальне вирівнювання по центру */
}
</style>
