<template>
  <div class="pt-4 group">
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

    <!-- Comment text section with enhanced mention support -->
    <div class="flex mt-2.5">
      <div
        class="text-white text-sm leading-relaxed break-words whitespace-pre-line flex-1"
        @click="handleTextClick"
      >
        {{ formattedText }}
      </div>
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

    <!-- Timestamp and actions -->
    <div class="mt-3 flex items-center justify-between">
      <div
        class="text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
        :title="formatFullTimestamp(comment.created_at)"
      >
        {{ formatTimestamp(comment.created_at) }}
      </div>

      <!-- Action buttons -->
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

    <!-- Comment Input Section with Purple Mentions -->
    <div v-if="showCommentInput" class="mt-4 relative">
      <!-- Content-editable comment input -->
      <div
        ref="commentInputRef"
        contenteditable="true"
        @input="onInput"
        @keydown="onKeyDown"
        @paste="onPaste"
        class="w-full min-h-[80px] p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-[#6D01D0] focus:outline-none resize-none transition-colors overflow-y-auto"
        style="max-height: 200px"
        data-placeholder="What's on your mind?"
        :class="{ 'border-red-500': inputError }"
      ></div>

      <!-- Submit button -->
      <button
        @click="submitComment"
        :disabled="!hasContent || isSubmitting"
        class="absolute bottom-2 right-2 bg-[#6D01D0] text-white px-4 py-1 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8B4CD8] transition-colors"
      >
        {{ isSubmitting ? "Publishing..." : "Publish" }}
      </button>

      <!-- Error message -->
      <div v-if="inputError" class="text-red-400 text-sm mt-1">
        {{ inputError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
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

const props = withDefaults(
  defineProps<{
    comment: Comment;
    showActions?: boolean;
    showCommentInput?: boolean;
    postId?: string;
  }>(),
  {
    showActions: false,
    showCommentInput: false,
  },
);

const emit = defineEmits<{
  reply: [comment: Comment];
  report: [comment: Comment];
  mentionClick: [userId: string];
  commentAdded: [comment: Comment];
  error: [message: string];
}>();

// Comment input state
const commentInputRef = ref<HTMLDivElement>();
const hasContent = ref(false);
const isSubmitting = ref(false);
const inputError = ref("");

// Map role IDs to display names
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[role] || role || "User";
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

  // Enhanced mention replacement with better regex
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  text = text.replace(mentionRegex, (match, username) => {
    const mention = props.comment.mentions?.find((m) => m.login === username);

    if (mention) {
      return `<span class="mention-link" data-user-id="${mention.user_id}" data-username="${username}" title="@${username} (${mention.name})">@${username}</span>`;
    } else {
      // Still style unmapped mentions
      return `<span class="mention-link mention-unknown" data-username="${username}" title="@${username}">@${username}</span>`;
    }
  });

  return text;
});

// Enhanced click handler for mentions
const handleTextClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("mention-link")) {
    const userId = target.dataset.userId;
    const username = target.dataset.username;

    if (userId) {
      console.log(`Mention clicked: @${username} (${userId})`);
      emit("mentionClick", userId);
      goToProfile(userId);
    } else if (username) {
      // Try to find user by username in mentions
      const mention = props.comment.mentions?.find((m) => m.login === username);
      if (mention) {
        console.log(
          `Found mention by username: @${username} -> ${mention.user_id}`,
        );
        emit("mentionClick", mention.user_id);
        goToProfile(mention.user_id);
      } else {
        console.warn(`User @${username} not found in mentions`);
      }
    }
  }
};

// Process mentions in input and make them purple
const processMentions = (element: HTMLDivElement) => {
  const html = element.innerHTML;

  // Replace @username with styled spans (but preserve existing styled mentions)
  const mentionRegex = /@([a-zA-Z0-9_-]+)(?!<\/span>)/g;
  const newHtml = html.replace(mentionRegex, (match, username) => {
    // Check if this mention is already styled
    if (
      html.includes(`<span class="mention-input" data-username="${username}"`)
    ) {
      return match; // Already styled, don't replace
    }
    return `<span class="mention-input" data-username="${username}" contenteditable="false">@${username}</span>`;
  });

  if (newHtml !== html) {
    // Save cursor position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const cursorPos = range.startOffset;

    // Update content
    element.innerHTML = newHtml;

    // Restore cursor position
    try {
      const newRange = document.createRange();
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
      );

      let currentPos = 0;
      let targetNode: Node = element;
      let targetOffset = 0;

      let node: Node | null;
      while ((node = walker.nextNode())) {
        const nodeLength = (node as Text).textContent?.length || 0;
        if (currentPos + nodeLength >= cursorPos) {
          targetNode = node as Text;
          targetOffset = cursorPos - currentPos;
          break;
        }
        currentPos += nodeLength;
      }

      newRange.setStart(
        targetNode,
        Math.min(targetOffset, (targetNode as Text).textContent?.length || 0),
      );
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } catch {
      // Fallback: place cursor at end
      const newRange = document.createRange();
      newRange.selectNodeContents(element);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
};

// Handle input changes in comment input
const onInput = async (event: Event) => {
  const target = event.target as HTMLDivElement;
  const content = target.innerHTML;

  // Check if there's actual content
  const textContent = target.textContent || target.innerText || "";
  hasContent.value = textContent.trim().length > 0;

  // Process mentions in real-time
  await nextTick();
  processMentions(target);
  inputError.value = "";
};

// Handle paste events in comment input
const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const text = event.clipboardData?.getData("text") || "";
  document.execCommand("insertText", false, text);
};

// Handle keyboard events in comment input
const onKeyDown = (event: KeyboardEvent) => {
  // Handle Enter for submission (if not in dropdown)
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitComment();
  }
};

// Submit comment
const submitComment = async () => {
  if (!commentInputRef.value || !hasContent.value || isSubmitting.value) return;

  const content =
    commentInputRef.value.textContent || commentInputRef.value.innerText;
  if (!content.trim()) return;

  isSubmitting.value = true;
  inputError.value = "";

  try {
    console.log(`📝 Submitting comment:`, content);

    // If postId is provided, this is a comment on a post
    if (props.postId) {
      const response = await fetch(
        `${API_URL}/posts/${props.postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: content.trim(),
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to comment");
        }

        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to post comment");
      }

      const newComment = await response.json();
      console.log("✅ Comment posted successfully:", newComment);

      emit("commentAdded", newComment);
    } else {
      // This might be a regular post
      console.log("📝 Creating post with content:", content);
      // You can add post creation logic here if needed
    }

    // Clear input after successful submit
    if (commentInputRef.value) {
      commentInputRef.value.innerHTML = "";
      hasContent.value = false;
    }

    // Focus back on input
    await nextTick();
    if (commentInputRef.value) {
      commentInputRef.value.focus();
    }
  } catch (err) {
    console.error("❌ Error submitting:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to submit";
    inputError.value = errorMessage;
    emit("error", errorMessage);
  } finally {
    isSubmitting.value = false;
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

/* Enhanced mention link styling with purple effect for displayed comments */
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

/* Add a subtle glow effect */
:deep(.mention-link:active) {
  background-color: rgba(109, 1, 208, 0.3);
  transform: scale(0.98);
}

/* Style for unknown mentions */
:deep(.mention-unknown) {
  opacity: 0.7;
  color: #9ca3af;
  border-color: rgba(156, 163, 175, 0.3);
  background-color: rgba(156, 163, 175, 0.1);
}

:deep(.mention-unknown:hover) {
  opacity: 0.9;
  background-color: rgba(156, 163, 175, 0.2);
  box-shadow: 0 0 4px rgba(156, 163, 175, 0.3);
}

/* Style for mentions in the input area */
:deep(.mention-input) {
  color: #6d01d0 !important;
  font-weight: 600;
  background-color: rgba(109, 1, 208, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid rgba(109, 1, 208, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  margin: 0 1px;
}

:deep(.mention-input:hover) {
  background-color: rgba(109, 1, 208, 0.2);
  border-color: rgba(109, 1, 208, 0.5);
  color: #8b4cd8 !important;
  box-shadow: 0 0 4px rgba(109, 1, 208, 0.3);
}

/* Placeholder styling for comment input */
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #6b7280;
  font-style: italic;
}

[contenteditable]:focus:before {
  content: "";
}

[contenteditable]:focus {
  outline: none;
}

/* Custom scrollbar for input */
[contenteditable] {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 #374151;
}

[contenteditable]::-webkit-scrollbar {
  width: 6px;
}

[contenteditable]::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 3px;
}

[contenteditable]::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

[contenteditable]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Better text wrapping */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>
