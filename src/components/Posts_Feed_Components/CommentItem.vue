<template>
  <div class="pt-4">
    <!-- User info section -->
    <div class="flex items-center gap-3">
      <img
        :src="comment.user.avatar_url || '/default-avatar.png'"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#6D01D0] transition-all"
        @click="goToProfile(comment.user.id)"
        @error="handleAvatarError"
      />
      <div
        @click="goToProfile(comment.user.id)"
        class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div class="flex flex-col leading-tight">
          <div
            class="text-white font-semibold text-[clamp(12px,0.833vw,16px)] font-inter"
          >
            {{ comment.user.name }}
          </div>
          <div
            class="text-gray-400 font-normal text-[clamp(10px,0.729vw,14px)] mt-1 font-inter hover:text-[#6D01D0] transition-colors"
          >
            @{{ comment.user.login }}
          </div>
        </div>
        <span
          :style="getBadgeStyle(comment.user.role)"
          class="ml-2 whitespace-nowrap font-semibold font-inter hover:scale-105 transition-transform cursor-pointer"
        >
          {{ getRoleDisplayName(comment.user.role) }}
        </span>
      </div>
    </div>

    <!-- Comment text section -->
    <div class="flex mt-2.5">
      <div
        class="text-white text-sm leading-relaxed break-words whitespace-pre-line flex-1"
        v-html="formattedText"
        @click="handleTextClick"
      ></div>
    </div>

    <!-- Mentioned users section -->
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
            {{ mention.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Timestamp and actions -->
    <div class="mt-3 flex items-center justify-between">
      <div
        class="text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
        :title="formatFullTimestamp(comment.created_at)"
      >
        {{ formatTimestamp(comment.created_at) }}
      </div>

      <!-- Action buttons (optional, can be hidden via prop) -->
      <div
        v-if="showActions"
        class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="$emit('reply', comment)"
          class="text-gray-400 hover:text-[#6D01D0] p-1 rounded transition-colors"
          title="Reply"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            ></path>
          </svg>
        </button>
        <button
          @click="$emit('report', comment)"
          class="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
          title="Report"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

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

const props = withDefaults(
  defineProps<{
    comment: Comment;
    showActions?: boolean;
  }>(),
  {
    showActions: false,
  },
);

// Emits for parent component
const emit = defineEmits<{
  reply: [comment: Comment];
  report: [comment: Comment];
  mentionClick: [userId: string];
}>();

// Map role IDs to display names
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[role] || role || "User";
};

// Format comment text with proper mention highlighting
const formattedText = computed(() => {
  let text = props.comment.text;

  // Escape HTML to prevent XSS
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Replace @username with styled mentions
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  text = text.replace(mentionRegex, (match, username) => {
    const mention = props.comment.mentions?.find((m) => m.login === username);
    const userId = mention?.user_id || "";
    const displayName = mention?.name || username;

    return `<span class="mention-link" data-user-id="${userId}" data-username="${username}" title="@${username} (${displayName})">@${username}</span>`;
  });

  return text;
});

// Handle clicks on mention links
const handleTextClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("mention-link")) {
    const userId = target.dataset.userId;
    const username = target.dataset.username;

    if (userId) {
      emit("mentionClick", userId);
      goToProfile(userId);
    } else if (username) {
      // Fallback: try to find user by username in mentions
      const mention = props.comment.mentions?.find((m) => m.login === username);
      if (mention) {
        emit("mentionClick", mention.user_id);
        goToProfile(mention.user_id);
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

// Navigation
function goToProfile(userId: string) {
  if (userId) {
    router.push(`/user/${userId}`);
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

/* Hover effect for the entire comment */
.pt-4:hover {
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

/* Mention link styling */
:deep(.mention-link) {
  color: #6d01d0;
  font-weight: 600;
  background-color: rgba(109, 1, 208, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
  border: 1px solid rgba(109, 1, 208, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

:deep(.mention-link:hover) {
  background-color: rgba(109, 1, 208, 0.2);
  border-color: rgba(109, 1, 208, 0.5);
  color: #8b4cd8;
  transform: scale(1.02);
}

/* Better text wrapping */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>
