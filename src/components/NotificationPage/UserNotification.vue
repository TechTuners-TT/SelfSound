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
    <button
      @click="fetchNotifications"
      class="block mx-auto mt-2 text-[#6D01D0] hover:text-[#8B4CD8]"
    >
      Try Again
    </button>
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
      class="flex justify-between items-center text-white group hover:bg-white/5 rounded-lg p-2 transition-colors"
      :class="{ 'opacity-60': notification.read }"
      @click="handleNotificationClick(notification)"
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
              :fill="
                notification.read
                  ? '#666'
                  : getNotificationColor(notification.type)
              "
              rx="3"
            />
          </svg>
        </span>

        <!-- Username -->
        <span
          class="ml-[8px] md:ml-[10px] text-[#6D01D0] text-[12px] md:text-[13px] xl:text-[14px] font-medium truncate max-w-[120px] hover:text-[#8B4CD8] transition-colors"
          @click.stop="goToUserProfile(notification.sender_id)"
        >
          {{ notification.username }}
        </span>

        <!-- Enhanced Message with better handling -->
        <span
          v-if="isClickableNotification(notification)"
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px] underline underline-offset-2 decoration-white cursor-pointer hover:text-gray-300 transition-colors"
          @click.stop="handleNotificationAction(notification)"
        >
          {{ getNotificationMessage(notification) }}
        </span>

        <span
          v-else
          class="text-white text-[12px] md:text-[13px] xl:text-[14px] font-normal truncate flex-1 ml-[8px]"
        >
          {{ getNotificationMessage(notification) }}
        </span>

        <!-- Time -->
        <span
          class="text-white text-[10px] md:text-[11px] xl:text-[12px] font-normal whitespace-nowrap mr-[8px] md:mr-[10px] xl:mr-[12px]"
        >
          {{ formatTime(notification.timestamp) }}
        </span>
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

// FIXED: Helper function to get authentication token
const getAuthToken = () => {
  return localStorage.getItem('access_token') || 
         localStorage.getItem('authToken') ||
         sessionStorage.getItem('access_token') ||
         sessionStorage.getItem('authToken');
};

// FIXED: Helper function to get authenticated headers
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Using Authorization header for notifications API');
  } else {
    console.warn('⚠️ No token found for notifications request');
  }
  
  return headers;
};

// Get notification color based on type
const getNotificationColor = (type: string): string => {
  switch (type) {
    case "mention":
      return "#6D01D0"; // Purple for mentions
    case "comment":
      return "#000C9C"; // Blue for comments
    case "listening":
      return "#3BAA5F"; // Green for new listeners
    default:
      return "#6D01D0";
  }
};

// Get formatted notification message
const getNotificationMessage = (notification: Notification): string => {
  // Handle different notification types with better formatting
  switch (notification.type) {
    case "mention":
      return "mentioned you in a comment";
    case "comment":
      return "commented on your post";
    case "listening":
      return "now listens to you";
    default:
      return notification.message || "interacted with your content";
  }
};

// Check if notification is clickable (mentions and comments)
const isClickableNotification = (notification: Notification): boolean => {
  return ["mention", "comment"].includes(notification.type);
};

// Handle notification click
const handleNotificationClick = async (notification: Notification) => {
  // Mark as read
  await markAsRead(notification.id);

  // Handle click action
  handleNotificationAction(notification);
};

// Handle notification action based on type
const handleNotificationAction = (notification: Notification) => {
  console.log(`🔔 Handling notification action:`, notification);

  switch (notification.type) {
    case "mention":
    case "comment":
      // For mentions and comments, go to the user's profile who mentioned/commented
      // This allows users to see who interacted with them
      console.log(
        `✅ Navigating to profile of user who ${notification.type}ed: ${notification.sender_id}`,
      );
      goToUserProfile(notification.sender_id);
      break;

    case "listening":
      // For new listeners, go to their profile
      console.log(
        `✅ Navigating to new listener's profile: ${notification.sender_id}`,
      );
      goToUserProfile(notification.sender_id);
      break;

    default:
      // Default action: go to sender's profile
      console.log(
        `✅ Default action - navigating to sender profile: ${notification.sender_id}`,
      );
      goToUserProfile(notification.sender_id);
      break;
  }
};

// FIXED: Fetch notifications from backend with authentication
async function fetchNotifications(loadMore: boolean = false) {
  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = "";

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to view notifications.');
    }

    console.log("🔔 Fetching notifications...");
    const res = await fetch(
      `${API_URL}/notifications?limit=${limit}&offset=${offset.value}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: "include", // Keep for cookie fallback
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        // Clear invalid token
        localStorage.removeItem('access_token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('authToken');
        throw new Error("Session expired. Please sign in again.");
      }
      throw new Error(`Failed to fetch notifications: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("✅ Notifications loaded:", data.length, "items");

    if (loadMore) {
      notifications.value.push(...data);
    } else {
      notifications.value = data;
    }

    offset.value += limit;
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load notifications";
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
}

// FIXED: Mark notification as read with authentication
async function markAsRead(notificationId: string) {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('⚠️ No token available to mark notification as read');
      return;
    }

    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (res.ok) {
      // Update local state
      const notification = notifications.value.find(
        (n) => n.id === notificationId,
      );
      if (notification) {
        notification.read = true;
        console.log('✅ Notification marked as read:', notificationId);
      }
    } else {
      console.error('❌ Failed to mark notification as read:', res.status);
    }
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
  }
}

// Load more notifications
function loadMore() {
  fetchNotifications(true);
}

// Navigate to user profile
function goToUserProfile(userId: string) {
  if (userId) {
    router.push(`/user/${userId}`);
  }
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
