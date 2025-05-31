<template>
  <div class="flex flex-col gap-4 mb-20">
    <!-- Empty state -->
    <p
      v-if="comments.length === 0 && !isLoading"
      class="text-white/40 text-sm text-center pt-4 mt-20"
    >
      No comments yet. Be the first to comment!
    </p>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-4">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6D01D0] mx-auto"
      ></div>
      <p class="text-gray-400 text-sm mt-2">Loading comments...</p>
    </div>

    <!-- Comments list -->
    <div v-if="comments.length > 0">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="border-b border-gray-700/50 pb-4 last:border-b-0 hover:bg-white/5 transition-colors duration-200 rounded-lg p-3 -m-3 mb-4"
      >
        <div class="flex items-start space-x-3">
          <!-- User Avatar -->
          <img
            :src="comment.user.avatar_url || '/default-avatar.png'"
            :alt="`${comment.user.name}'s avatar`"
            class="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[#6D01D0] transition-all"
            @click="goToProfile(comment.user.id)"
            @error="handleAvatarError"
          />

          <!-- Comment Content -->
          <div class="flex-1 min-w-0">
            <!-- User Info -->
            <div class="flex items-center space-x-2 mb-1 flex-wrap">
              <span
                class="text-white font-medium text-sm cursor-pointer hover:text-[#6D01D0] transition-colors"
                @click="goToProfile(comment.user.id)"
              >
                {{ comment.user.name }}
              </span>
              <span
                class="text-gray-400 text-xs cursor-pointer hover:text-gray-300 transition-colors"
                @click="goToProfile(comment.user.id)"
              >
                @{{ comment.user.login }}
              </span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="getRoleColor(comment.user.role)"
              >
                {{ getRoleDisplayName(comment.user.role) }}
              </span>
              <span
                class="text-gray-500 text-xs cursor-pointer hover:text-gray-400 transition-colors"
                :title="formatFullTimestamp(comment.created_at)"
              >
                {{ formatTimestamp(comment.created_at) }}
              </span>
            </div>

            <!-- SECURE Comment Text with Purple Mentions -->
            <div
              class="text-white text-sm leading-relaxed break-words whitespace-pre-line"
            >
              <template
                v-for="(part, index) in parseCommentText(
                  comment.text,
                  comment.mentions,
                )"
                :key="index"
              >
                <!-- Mentioned user with PURPLE styling -->
                <span
                  v-if="part.type === 'mention'"
                  class="mention-display"
                  @click="handleMentionClick(part.username!)"
                  :title="`Go to @${part.username}'s profile`"
                >
                  @{{ part.username }}
                </span>

                <!-- URL link -->
                <a
                  v-else-if="part.type === 'url'"
                  :href="part.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-400 hover:text-blue-300 underline transition-colors"
                  :title="part.url"
                >
                  {{ part.url }}
                </a>

                <!-- Line break -->
                <br v-else-if="part.type === 'linebreak'" />

                <!-- Regular text -->
                <span v-else>{{ part.text }}</span>
              </template>
            </div>

            <!-- Mentioned Users Display (if any) -->
            <div
              v-if="comment.mentions && comment.mentions.length > 0"
              class="mt-2"
            >
              <div class="text-xs text-gray-400 mb-1">Mentioned:</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="mention in comment.mentions"
                  :key="mention.user_id"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#6D01D0]/20 text-[#6D01D0] cursor-pointer hover:bg-[#6D01D0]/30 transition-colors border border-[#6D01D0]/30"
                  @click="goToProfile(mention.user_id)"
                  :title="`Go to ${mention.name}'s profile`"
                >
                  <img
                    :src="mention.avatar_url || '/default-avatar.png'"
                    :alt="mention.name"
                    class="w-3 h-3 rounded-full object-cover mr-1"
                    @error="handleAvatarError"
                  />
                  {{ mention.name }}
                </span>
              </div>
            </div>

            <!-- Comment Actions (optional) -->
            <div
              class="flex items-center space-x-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="handleReply(comment)"
                class="text-gray-400 hover:text-[#6D01D0] text-xs transition-colors"
                title="Reply to comment"
              >
                Reply
              </button>
              <button
                @click="handleReport(comment)"
                class="text-gray-400 hover:text-red-400 text-xs transition-colors"
                title="Report comment"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="text-red-400 text-center py-4">
      <p class="mb-2">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="text-[#6D01D0] hover:text-[#8B4CD8] text-sm transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

interface CommentUser {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
  role: string;
}

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
  user: CommentUser;
  mentions?: CommentMention[];
}

interface Props {
  comments: Comment[];
  isLoading?: boolean;
  error?: string;
}

interface TextPart {
  type: "text" | "mention" | "url" | "linebreak";
  text?: string;
  username?: string;
  url?: string;
}

const props = withDefaults(defineProps<Props>(), {
  comments: () => [],
  isLoading: false,
  error: "",
});

const emit = defineEmits<{
  (e: "mention-click", username: string): void;
  (e: "user-click", userId: string): void;
  (e: "reply", comment: Comment): void;
  (e: "report", comment: Comment): void;
  (e: "retry"): void;
}>();

// SECURE: Parse comment text into safe Vue components (NO XSS POSSIBLE)
const parseCommentText = (
  text: string,
  mentions?: CommentMention[],
): TextPart[] => {
  if (!text) return [{ type: "text", text: "" }];

  const parts: TextPart[] = [];

  // Create mention usernames map for quick lookup
  const mentionMap = new Map(
    mentions?.map((m) => [m.login.toLowerCase(), m]) || [],
  );

  // Regex patterns
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const lineBreakRegex = /\n/g;

  let lastIndex = 0;
  const allMatches: Array<{
    match: RegExpExecArray;
    type: "mention" | "url" | "linebreak";
  }> = [];

  // Find all mentions
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    // Only process if it's actually a mentioned user
    if (mentionMap.has(match[1].toLowerCase())) {
      allMatches.push({ match, type: "mention" });
    }
  }

  // Find all URLs
  urlRegex.lastIndex = 0; // Reset regex
  while ((match = urlRegex.exec(text)) !== null) {
    allMatches.push({ match, type: "url" });
  }

  // Find all line breaks
  lineBreakRegex.lastIndex = 0; // Reset regex
  while ((match = lineBreakRegex.exec(text)) !== null) {
    allMatches.push({ match, type: "linebreak" });
  }

  // Sort matches by position
  allMatches.sort((a, b) => a.match.index - b.match.index);

  // Build parts array
  for (const { match, type } of allMatches) {
    // Add text before match
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index);
      if (textContent) {
        parts.push({
          type: "text",
          text: textContent,
        });
      }
    }

    // Add the match
    if (type === "mention") {
      const username = match[1];
      parts.push({
        type: "mention",
        username: username,
      });
    } else if (type === "url") {
      parts.push({
        type: "url",
        url: match[0],
      });
    } else if (type === "linebreak") {
      parts.push({
        type: "linebreak",
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      parts.push({
        type: "text",
        text: remainingText,
      });
    }
  }

  // If no matches found, return the whole text
  if (parts.length === 0) {
    parts.push({
      type: "text",
      text: text,
    });
  }

  return parts;
};

// Map role IDs to display names
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[role] || role || "User";
};

// Get role-specific styling
const getRoleColor = (role: string): string => {
  const displayRole = getRoleDisplayName(role);

  switch (displayRole.toLowerCase()) {
    case "musician":
      return "bg-[#6D01D0] text-white";
    case "listener":
      return "bg-white text-black";
    case "learner":
      return "bg-[#000C9C] text-white";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

// Format timestamp for display
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

  return date.toLocaleDateString();
};

// Format full timestamp for tooltip
const formatFullTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

// Navigation functions
const goToProfile = (userId: string) => {
  if (userId) {
    router.push(`/user/${userId}`);
    emit("user-click", userId);
  }
};

// Event handlers
const handleMentionClick = (username: string) => {
  console.log(`Clicked mention: @${username}`);
  emit("mention-click", username);

  // Could navigate to user profile by username
  // router.push(`/user/@${username}`)
};

const handleReply = (comment: Comment) => {
  emit("reply", comment);
};

const handleReport = (comment: Comment) => {
  emit("report", comment);
};

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/default-avatar.png";
};
</script>

<style scoped>
/* Simple purple mention styling for displayed comments */
.mention-display {
  color: #6d01d0;
  cursor: pointer;
}

/* Safe styling for links and text */
a {
  word-break: break-all;
  max-width: 100%;
}

.break-words {
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Mention and user interaction hover effects */
.cursor-pointer:hover {
  transform: translateY(-1px);
}

/* Group hover for comment actions */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
