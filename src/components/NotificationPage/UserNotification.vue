<template>
  <div class="mb-[20px]">
    <div class="flex items-center mt-[20px]">
      <!-- Заголовок -->
      <h1
        class="[@media(min-width:1537px)]:text-[24px] xl:text-[20px] lg:text-[18px] text-[16px] font-bold text-white inter-font"
      >
        Notifications
      </h1>
    </div>
    <!-- Divider -->
    <div
      class="mt-[20px] -mx-[10px] sm:-mx-[50px] md:-mx-[20px] lg:-mx-[30px] xl:-mx-[30px] 2xl:-mx-[40px]"
    >
      <hr class="border-t-1 border-white/50" />
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="isLoading" class="text-white text-center py-4">
    Loading notifications...
  </div>

  <!-- Error State -->
  <div v-if="error" class="text-red-400 text-center py-4">
    {{ error }}
  </div>

  <!-- Empty State -->
  <div
    v-if="!isLoading && !error && notifications.length === 0"
    class="text-gray-400 text-center py-4"
  >
    No notifications yet
  </div>

  <!-- User List -->
  <div
    v-if="!isLoading && !error && notifications.length > 0"
    class="space-y-[3px]"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="flex justify-between items-center text-white"
      :class="{ 'opacity-60': notification.read }"
      @click="markAsRead(notification.id)"
    >
      <!-- Контейнер повідомлення -->
      <div
        class="flex items-center justify-between w-full h-[20px] md:h-[22px] xl:h-[24px] cursor-pointer"
      >
        <span>
          <svg width="6" height="7" fill="none" viewBox="0 0 6 7">
            <rect
              width="6"
              height="6"
              y=".5"
              :fill="notification.read ? '#666' : '#6D01D0'"
              rx="3"
            />
          </svg>
        </span>
        <!-- Username -->
        <span
          class="ml-[8px] md:ml-[10px] text-[#6D01D0] text-[12px] md:text-[13px] xl:text-[14px] font-medium truncate max-w-[120px]"
          @click.stop="goToUserProfile(notification.sender_id)"
          >{{ notification.username }}</span
        >

        <!-- Message - Updated to handle backend mention messages -->
        <span
          v-if="
            notification.type === 'mention' ||
            notification.message.includes('mentioned you')
          "
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px] underline underline-offset-2 decoration-white cursor-pointer"
          @click.stop="goToTaggedPost(notification)"
        >
          {{ notification.message }}
        </span>

        <span
          v-else-if="
            notification.type === 'comment' ||
            notification.message.includes('commented on')
          "
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px] underline underline-offset-2 decoration-white cursor-pointer"
          @click.stop="goToTaggedPost(notification)"
        >
          {{ notification.message }}
        </span>

        <span
          v-else
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px]"
        >
          {{ notification.message }}
        </span>
        <!-- Time -->
        <span
          class="text-white text-[10px] md:text-[11px] xl:text-[12px] font-normal whitespace-nowrap mr-[8px] md:mr-[10px] xl:mr-[12px]"
          >{{ formatTime(notification.timestamp) }}</span
        >
      </div>
    </div>
  </div>

  <!-- Load More Button -->
  <div
    v-if="
      !isLoading && notifications.length > 0 && notifications.length >= limit
    "
    class="text-center mt-4"
  >
    <button
      @click="loadMore"
      :disabled="isLoadingMore"
      class="text-[#6D01D0] hover:text-[#8B4CD8] text-sm font-medium disabled:opacity-50"
    >
      {{ isLoadingMore ? "Loading..." : "Load More" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

type Notification = {
  id: string;
  name: string;
  username: string;
  message: string;
  timestamp: string;
  type: string;
  read: boolean;
  sender_id: string;
  post_id?: string;
};

const router = useRouter();

const notifications = ref<Notification[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");
const currentTime = ref(Date.now());
const limit = 20;
const offset = ref(0);

let timeInterval: ReturnType<typeof setTimeout> | null = null;

// Fetch notifications from backend
async function fetchNotifications(loadMore: boolean = false) {
  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = "";

  try {
    console.log("Fetching notifications...");
    const res = await fetch(
      `${API_URL}/notifications?limit=${limit}&offset=${offset.value}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Please sign in to view notifications");
      }
      throw new Error(`Failed to fetch notifications: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Notifications data:", data);

    if (loadMore) {
      notifications.value.push(...data);
    } else {
      notifications.value = data;
    }

    offset.value += limit;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load notifications";
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
}

// Mark notification as read
async function markAsRead(notificationId: string) {
  try {
    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      credentials: "include",
    });

    if (res.ok) {
      // Update local state
      const notification = notifications.value.find(
        (n) => n.id === notificationId,
      );
      if (notification) {
        notification.read = true;
      }
    }
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
}

// Load more notifications
function loadMore() {
  fetchNotifications(true);
}

// Navigate to user profile
function goToUserProfile(userId: string) {
  router.push(`/user/${userId}`);
}

function formatTime(timestamp: string): string {
  const notificationTime = new Date(timestamp).getTime();
  const diffMs = currentTime.value - notificationTime;
  const diffMin = Math.floor(diffMs / (60 * 1000));

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

async function goToTaggedPost(notification: Notification) {
  console.log(`🔍 Navigating for notification:`, notification);

  // For mentions and comments, navigate to the user's profile who mentioned/commented
  // This way users can see who interacted with them and find the post in their feed

  try {
    console.log(
      `✅ Navigating to profile of user who interacted: ${notification.sender_id}`,
    );
    router.push(`/user/${notification.sender_id}`);
  } catch (error) {
    console.error("❌ Error navigating to user profile:", error);
    // Ultimate fallback: go to home feed
    console.log(`ℹ️ Fallback: navigating to home feed`);
    router.push("/");
  }
}

// Update time every minute
onMounted(() => {
  fetchNotifications();

  timeInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 60 * 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
