<template>
  <div class="pt-4 group">
    <!-- User info section -->
    <div class="flex items-center gap-3">
      <img
        :src="comment.user.avatar_url || '/default-avatar.png'"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover"
        @error="handleAvatarError"
      />
      <div class="flex items-center gap-2">
        <div class="flex flex-col leading-tight">
          <div
            class="text-white font-semibold text-[clamp(12px,0.833vw,16px)] font-inter"
          >
            {{ comment.user.name }}
          </div>
          <div
            @click="goToProfile(comment.user.id)"
            class="text-gray-400 font-normal text-[clamp(10px,0.729vw,14px)] mt-1 font-inter hover:text-[#6D01D0] transition-colors cursor-pointer"
          >
            @{{ comment.user.login }}
          </div>
        </div>
        <span
          :style="getBadgeStyle(comment.user.role)"
          class="ml-2 whitespace-nowrap font-semibold font-inter"
        >
          {{ getRoleDisplayName(comment.user.role) }}
        </span>
      </div>
    </div>

    <!-- Comment text section with enhanced mention support - FIXED TO USE v-html -->
    <div class="flex mt-2.5">
      <div
        class="text-white text-sm leading-relaxed break-words whitespace-pre-line flex-1"
        v-html="formattedText"
        @click="handleTextClick"
      ></div>
    </div>

    <!-- Enhanced mentioned users section -->
    <div v-if="comment.mentions && comment.mentions.length > 0" class="mt-3">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="mention in comment.mentions"
          :key="mention.user_id"
          @click="goToProfile(mention.user_id)"
          class="flex items-center gap-1.5 bg-[#6D01D0]/10 border border-[#6D01D0]/30 rounded-full px-2 py-1 cursor-pointer hover:bg-[#6D01D0]/20 transition-all group"
        >
          <img
            :src="mention.avatar_url || '/default-avatar.png'"
            :alt="mention.name"
            class="w-4 h-4 rounded-full object-cover"
            @error="handleAvatarError"
          />
          <span
            class="text-[#6D01D0] text-xs font-medium group-hover:text-[#8B4CD8]"
          >
            @{{ mention.login }}
          </span>
        </div>
      </div>
    </div>

    <!-- Timestamp -->
    <div class="mt-3 flex items-center justify-between">
      <div
        class="text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
        :title="formatFullTimestamp(comment.created_at)"
      >
        {{ formatTimestamp(comment.created_at) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

// Get API URL for user lookup
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

// Enhanced comment interface
interface CommentMention {
  user_id: string;
  login: string;
  name: string;
  avatar_url: string;
}

interface Comment {
  id: string;
  text: string;
  content?: string; // Backend sends both text and content
  created_at: string;
  user: {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
    role: string;
  };
  mentions?: CommentMention[];
}

const props = defineProps<{
  comment: Comment;
  showActions?: boolean;
  showCommentInput?: boolean;
}>();

const emit = defineEmits<{
  mentionClick: [userId: string];
}>();

// Map role IDs to display names
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[role] || role || "Listener";
};

// Enhanced comment text formatting with better mention highlighting
const formattedText = computed(() => {
  // Use either text or content field from backend
  let text = props.comment.text || props.comment.content || "";

  // Escape HTML to prevent XSS
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Enhanced mention replacement - make ALL @mentions purple and clickable
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  text = text.replace(mentionRegex, (match, username) => {
    const mention = props.comment.mentions?.find((m) => m.login === username);

    if (mention) {
      // Known mention - has user data
      return `<span class="mention-link" data-user-id="${mention.user_id}" data-username="${username}" title="@${username} (${mention.name})">@${username}</span>`;
    } else {
      // Unknown mention - just the username, but still purple and clickable
      return `<span class="mention-link mention-clickable" data-username="${username}" title="Visit @${username}'s profile">@${username}</span>`;
    }
  });

  return text;
});

// Enhanced click handler for mentions - navigate to profile by username
const handleTextClick = async (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("mention-link")) {
    const userId = target.dataset.userId;
    const username = target.dataset.username;

    if (userId) {
      // We have the user ID, navigate directly
      console.log(`Mention clicked: @${username} (${userId})`);
      emit("mentionClick", userId);
      goToProfile(userId);
    } else if (username) {
      // Try to find user by username in mentions first
      const mention = props.comment.mentions?.find((m) => m.login === username);
      if (mention) {
        console.log(
          `Found mention by username: @${username} -> ${mention.user_id}`,
        );
        emit("mentionClick", mention.user_id);
        goToProfile(mention.user_id);
      } else {
        // Use the same search endpoint as CommentForm (this should fix the "User not found" error)
        console.log(`Looking up user by username: @${username}`);
        try {
          const response = await fetch(
            `${API_URL}/posts/users/search?q=${encodeURIComponent(username)}&limit=10`,
            {
              credentials: "include",
            },
          );

          if (response.ok) {
            const users = await response.json();
            // Find exact username match (case-insensitive)
            const user = users.find(
              (u: { login: string }) =>
                u.login.toLowerCase() === username.toLowerCase(),
            );
            if (user) {
              console.log(`Found user by username: @${username} -> ${user.id}`);
              emit("mentionClick", user.id);
              goToProfile(user.id);
            } else {
              console.warn(`User @${username} not found in search results`);
              // Show a more user-friendly message
              alert(
                `User @${username} is not found or may have changed their username.`,
              );
            }
          } else {
            console.warn(
              `Search API returned error: ${response.status} ${response.statusText}`,
            );
            alert(`Could not find user @${username}. Please try again later.`);
          }
        } catch (error) {
          console.error(`Error looking up user @${username}:`, error);
          alert(
            `Network error while looking up @${username}. Please check your connection.`,
          );
        }
      }
    }
  }
};

// Format timestamps
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const formatFullTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

// Badge styling with role mapping
function getBadgeStyle(role: string) {
  const displayRole = getRoleDisplayName(role);
  const base = {
    width: "clamp(50px, 3.229vw, 50px)",
    height: "clamp(21px, 1.354vw, 21px)",
    borderRadius: "5px",
    padding: "4px 8px",
    fontSize: "clamp(10px, 0.729vw, 12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (displayRole === "Musician")
    return { ...base, backgroundColor: "#6D01D0", color: "#FFFFFF" };
  if (displayRole === "Learner")
    return { ...base, backgroundColor: "#000C9C", color: "#FFFFFF" };
  if (displayRole === "Listener")
    return { ...base, backgroundColor: "#FFFFFF", color: "#000000" };
  return { ...base, backgroundColor: "#6B7280", color: "#FFFFFF" };
}

// Navigation - Updated to match PostCard.vue routing pattern
function goToProfile(userId: string) {
  if (userId) {
    console.log("Navigating to profile for user:", userId);
    router.push({ name: "Profile", params: { userId } });
  }
}

// Error handling
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/default-avatar.png";
};
</script>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif;
}

/* REMOVED: Grey hover effect for the entire comment */
/* 
.pt-4:hover {
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
*/

/* Enhanced mention link styling - ALL mentions are purple and clickable */
:deep(.mention-link) {
  color: #6d01d0;
  font-weight: 600;
  background-color: rgba(109, 1, 208, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(109, 1, 208, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  margin: 0 1px;
  position: relative;
}

:deep(.mention-link:hover) {
  background-color: rgba(109, 1, 208, 0.2);
  border-color: rgba(109, 1, 208, 0.5);
  color: #8b4cd8;
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(109, 1, 208, 0.4);
}

/* Active state for mentions */
:deep(.mention-link:active) {
  background-color: rgba(109, 1, 208, 0.3);
  transform: scale(0.98);
}

/* All mentions are clickable and purple - no gray styling */
:deep(.mention-clickable) {
  color: #6d01d0;
  font-weight: 600;
  background-color: rgba(109, 1, 208, 0.1);
  border: 1px solid rgba(109, 1, 208, 0.3);
}

:deep(.mention-clickable:hover) {
  background-color: rgba(109, 1, 208, 0.2);
  border-color: rgba(109, 1, 208, 0.5);
  color: #8b4cd8;
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(109, 1, 208, 0.4);
}

/* Better text wrapping */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>
