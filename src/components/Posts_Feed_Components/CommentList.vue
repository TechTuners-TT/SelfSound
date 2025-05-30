<template>
  <div class="space-y-4">
    <!-- Empty state -->
    <div v-if="comments.length === 0" class="text-center py-8 text-gray-400">
      <svg
        class="w-12 h-12 mx-auto mb-3 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        ></path>
      </svg>
      <p class="text-sm">No comments yet</p>
      <p class="text-xs mt-1">Be the first to leave a comment!</p>
    </div>

    <!-- Comments -->
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors group"
    >
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <img
          :src="comment.user.avatar_url || '/placeholder-avatar.jpg'"
          :alt="comment.user.name"
          class="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#6D01D0] transition-all"
          @click="navigateToProfile(comment.user.id)"
          @error="handleAvatarError"
        />
      </div>

      <!-- Comment Content -->
      <div class="flex-1 min-w-0">
        <!-- User Info -->
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span
            class="font-semibold text-white text-sm cursor-pointer hover:text-[#6D01D0] transition-colors"
            @click="navigateToProfile(comment.user.id)"
          >
            {{ comment.user.name }}
          </span>
          <span
            class="text-gray-400 text-sm cursor-pointer hover:text-gray-300 transition-colors"
            @click="navigateToProfile(comment.user.id)"
          >
            @{{ comment.user.login }}
          </span>
          <span
            class="px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-all hover:scale-105"
            :class="getBadgeStyle(comment.user.role)"
            @click="navigateToProfile(comment.user.id)"
          >
            {{ mapRole(comment.user.role) }}
          </span>
          <span
            class="text-gray-400 text-xs"
            :title="formatFullTimestamp(comment.created_at)"
          >
            {{ formatTimestamp(comment.created_at) }}
          </span>
        </div>

        <!-- Comment Text with Mention Highlighting -->
        <div
          class="text-white text-sm leading-relaxed break-words"
          v-html="highlightMentions(comment.text, comment.mentions)"
          @click="handleMentionClick"
        ></div>

        <!-- Mentions Preview (if any) -->
        <div
          v-if="comment.mentions && comment.mentions.length > 0"
          class="mt-2 flex flex-wrap gap-1"
        >
          <div
            v-for="mention in comment.mentions.slice(0, 3)"
            :key="mention.user_id"
            class="flex items-center gap-1 bg-[#6D01D0]/10 border border-[#6D01D0]/30 rounded-full px-2 py-1 text-xs cursor-pointer hover:bg-[#6D01D0]/20 transition-colors"
            @click="navigateToProfile(mention.user_id)"
          >
            <img
              :src="mention.avatar_url || '/placeholder-avatar.jpg'"
              :alt="mention.name"
              class="w-4 h-4 rounded-full object-cover"
              @error="handleAvatarError"
            />
            <span class="text-[#6D01D0] font-medium">{{ mention.name }}</span>
          </div>
          <span
            v-if="comment.mentions.length > 3"
            class="text-gray-400 text-xs px-2 py-1"
          >
            +{{ comment.mentions.length - 3 }} more
          </span>
        </div>
      </div>

      <!-- Comment Actions (visible on hover) -->
      <div
        class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="flex gap-1">
          <button
            class="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            @click="replyToComment(comment)"
            title="Reply"
          >
            <svg
              class="w-4 h-4"
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
            class="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            @click="reportComment(comment)"
            title="Report"
          >
            <svg
              class="w-4 h-4"
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
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

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
  mentions?: Array<{
    user_id: string;
    login: string;
    name: string;
    avatar_url: string;
  }>;
}

interface Props {
  comments: Comment[];
}

defineProps<Props>();
const router = useRouter();

// Emit events for parent component to handle
const emit = defineEmits<{
  userClick: [userId: string];
  mentionClick: [username: string];
  reply: [comment: Comment];
  report: [comment: Comment];
}>();

// Role mapping for display
const mapRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[role] || role || "User";
};

const getBadgeStyle = (role: string) => {
  const mappedRole = mapRole(role);
  if (mappedRole === "Musician")
    return "bg-[#6D01D0] text-white hover:bg-[#5a0ba8]";
  if (mappedRole === "Learner")
    return "bg-[#000C9C] text-white hover:bg-[#000a7a]";
  if (mappedRole === "Listener") return "bg-white text-black hover:bg-gray-200";
  return "bg-gray-500 text-white hover:bg-gray-600";
};

const formatTimestamp = (timestamp: string): string => {
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

const highlightMentions = (
  text: string,
  mentions?: Array<{
    user_id: string;
    login: string;
    name: string;
    avatar_url: string;
  }>,
) => {
  let escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Highlight @mentions with data attributes for click handling
  escapedText = escapedText.replace(/@(\w+)/g, (match, username) => {
    const mentionUser = mentions?.find((m) => m.login === username);
    const title = mentionUser ? mentionUser.name : username;
    const userId = mentionUser?.user_id || "";

    return `<span class="mention-highlight" data-username="${username}" data-user-id="${userId}" title="${title}">@${username}</span>`;
  });

  return escapedText;
};

// Navigation functions
const navigateToProfile = (userId: string) => {
  if (userId) {
    emit("userClick", userId);
    router.push(`/user/${userId}`);
  }
};

const handleMentionClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("mention-highlight")) {
    const username = target.dataset.username;
    const userId = target.dataset.userId;

    if (username) {
      emit("mentionClick", username);
    }

    if (userId) {
      navigateToProfile(userId);
    }
  }
};

// Action handlers
const replyToComment = (comment: Comment) => {
  emit("reply", comment);
};

const reportComment = (comment: Comment) => {
  emit("report", comment);
};

// Error handlers
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/placeholder-avatar.jpg";
};
</script>

<style scoped>
:deep(.mention-highlight) {
  color: #6d01d0;
  font-weight: 600;
  background-color: rgba(109, 1, 208, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
  border: 1px solid rgba(109, 1, 208, 0.3);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.mention-highlight:hover) {
  background-color: rgba(109, 1, 208, 0.2);
  border-color: rgba(109, 1, 208, 0.5);
  transform: scale(1.02);
}

.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
