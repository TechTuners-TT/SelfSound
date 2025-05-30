<template>
  <div class="relative" :style="{ marginLeft: side, marginRight: side }">
    <div
      class="flex flex-col"
      :style="{
        paddingLeft: inner,
        paddingRight: inner,
        paddingBottom: `calc(${inner} + 1px)`,
        paddingTop: inner,
      }"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-3 mb">
        <div class="flex items-center" style="gap: 12px">
          <div
            class="rounded-full overflow-hidden"
            :style="{
              width: 'clamp(35px, 2.083vw, 40px)',
              height: 'clamp(35px, 2.083vw, 40px)',
            }"
          >
            <img
              :src="post.avatarUrl || '/placeholder-avatar.jpg'"
              alt="avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="leading-tight flex flex-col">
            <div
              class="text-white font-semibold text-[clamp(12px,0.833vw,16px)] font-inter"
            >
              {{ post.displayName }}
            </div>
            <div
              @click="goToProfile"
              class="text-white font-normal text-[clamp(10px,0.729vw,14px)] mt-[4px] font-inter hover:text-[#6D01D0] transition-colors cursor-pointer"
            >
              @{{ post.username }}
            </div>
          </div>
          <span
            class="flex items-center justify-center font-medium"
            :style="getBadgeStyle(post.role)"
          >
            {{ post.role }}
          </span>
        </div>

        <!-- Options menu -->
        <button
          @click="toggleMenu"
          ref="menuBtnRef"
          class="relative flex items-center justify-center cursor-pointer"
          style="
            width: clamp(20px, 1.25vw, 24px);
            height: 18px;
            margin-left: auto;
          "
        >
          <svg
            width="4"
            height="18"
            viewBox="0 0 4 18"
            fill="currentColor"
            class="text-white"
          >
            <circle cx="2" cy="2" r="2" />
            <circle cx="2" cy="9" r="2" />
            <circle cx="2" cy="16" r="2" />
          </svg>
          <div
            v-if="showMenu"
            ref="modalRef"
            class="absolute bg-[#060310] rounded-[5px] border border-white/50 flex flex-col"
            :style="menuPosition"
          >
            <button
              @click="openReportModal"
              class="text-sm font-semibold text-[#D0202F] py-1 px-3 text-left cursor-pointer"
            >
              Report
            </button>
            <button
              @click="showMenu = false"
              class="text-sm font-medium text-white py-1 px-3 text-left cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </button>
      </div>

      <!-- Dynamic content -->
      <div>
        <component :is="getComponent(post.type)" v-bind="post" />
      </div>

      <!-- FOOTER -->
      <div class="flex items-center mt-3">
        <div
          class="flex items-center"
          :style="{ marginRight: 'auto', gap: '6px' }"
        >
          <!-- Like Button -->
          <button
            @click="toggleLike"
            :disabled="isLiking"
            :class="[
              liked ? 'text-[#6D01D0]' : 'text-white hover:text-[#6D01D0]',
              isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ]"
            class="flex items-center justify-center transition-colors"
            :style="{ width: '24px', height: '24px', borderRadius: '4px' }"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 23 21"
              :fill="liked ? 'currentColor' : 'none'"
              stroke="currentColor"
            >
              <path
                d="M11.5 19.35L10.05 18.03C4.9 13.36 1.5 10.28 1.5 6.5C1.5 3.42 3.92 1 7 1C8.74 1 10.41 1.81 11.5 3.09C12.59 1.81 14.26 1 16 1C19.08 1 21.5 3.42 21.5 6.5C21.5 10.28 18.1 13.36 12.95 18.04L11.5 19.35Z"
                stroke-width="2"
              />
            </svg>
          </button>
          <span :style="{ fontSize: '12px' }" class="text-white">{{
            likeCount
          }}</span>

          <!-- Comments Button -->
          <button
            @click="openCommentsModal"
            class="flex items-center justify-center cursor-pointer hover:text-[#6D01D0] transition-colors text-white"
            :style="{ width: '24px', height: '24px', borderRadius: '4px' }"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 21 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M19.1001 9.5C19.1035 10.8199 18.7952 12.1219 18.2001 13.3C17.4945 14.7118 16.4099 15.8992 15.0675 16.7293C13.7252 17.5594 12.1783 17.9994 10.6001 18C9.2802 18.0035 7.97822 17.6951 6.8001 17.1L1.1001 19L3.0001 13.3C2.40503 12.1219 2.09666 10.8199 2.1001 9.5C2.10071 7.92179 2.54071 6.37488 3.37082 5.03258C4.20093 3.69028 5.38835 2.6056 6.8001 1.90003C7.97822 1.30496 9.2802 0.996588 10.6001 1.00003H11.1001C13.1844 1.11502 15.1531 1.99479 16.6292 3.47089C18.1053 4.94699 18.9851 6.91568 19.1001 9V9.5Z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span :style="{ fontSize: '12px' }" class="text-white">{{
            commentCount
          }}</span>
        </div>

        <span :style="{ fontSize: '14px', color: '#9CA3AF' }">{{
          post.timestamp
        }}</span>
      </div>
    </div>

    <!-- Divider -->
    <div
      class="w-full"
      style="height: 1px; background-color: rgba(255, 255, 255, 0.1)"
    ></div>

    <!-- COMMENTS MODAL -->
    <div
      v-if="showCommentsModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="closeCommentsModal"
    >
      <div
        class="bg-[#060310] border border-white/50 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-white/10"
        >
          <h2 class="text-lg font-bold text-white">Comments</h2>
          <button
            @click="closeCommentsModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Comments Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Loading State -->
          <div
            v-if="isLoadingComments && comments.length === 0"
            class="flex justify-center py-8"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0]"
            ></div>
          </div>

          <!-- Error State -->
          <div v-if="commentsError" class="text-red-400 text-center py-8">
            <p>{{ commentsError }}</p>
            <button
              @click="loadComments(false)"
              class="mt-2 text-[#6D01D0] hover:text-[#8B4CD8] transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Comments List -->
          <div v-if="!isLoadingComments || comments.length > 0">
            <CommentList :comments="comments" />
          </div>

          <!-- Load More Button -->
          <div
            v-if="hasMoreComments && comments.length > 0"
            class="text-center py-4"
          >
            <button
              @click="loadMoreComments"
              :disabled="isLoadingMoreComments"
              class="bg-[#6D01D0] hover:bg-[#5a0ba8] disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {{ isLoadingMoreComments ? "Loading..." : "Load More" }}
            </button>
          </div>
        </div>

        <!-- Comment Form -->
        <div class="border-t border-white/10 p-4">
          <CommentForm
            @submit="handleSubmitComment"
            :disabled="isSubmittingComment"
          />

          <!-- Submitting indicator -->
          <div
            v-if="isSubmittingComment"
            class="flex items-center justify-center mt-2"
          >
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6D01D0] mr-2"
            ></div>
            <span class="text-sm text-gray-400">Posting comment...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORT MODAL -->
    <div
      v-if="showReportModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="closeReportModal"
    >
      <div
        class="bg-[#060310] border border-white/50 rounded-xl p-6 w-80 space-y-4"
      >
        <h2 class="text-lg font-bold text-white">Report Post</h2>
        <div class="space-y-2 text-white">
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              value="Spam"
              v-model="reportReason"
              style="accent-color: #6d01d0"
            />
            <span>Spam</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              value="Harassment"
              v-model="reportReason"
              style="accent-color: #6d01d0"
            />
            <span>Harassment</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              value="Hate speech"
              v-model="reportReason"
              style="accent-color: #6d01d0"
            />
            <span>Hate speech</span>
          </label>
          <label class="flex items-start space-x-2">
            <input
              type="radio"
              value="Other"
              v-model="reportReason"
              style="accent-color: #6d01d0"
            />
            <div class="flex-1">
              <span>Other:</span>
              <input
                v-if="reportReason === 'Other'"
                v-model="otherReason"
                type="text"
                placeholder="Enter your reason"
                class="mt-1 w-full px-2 py-1 rounded bg-white/10 text-white"
              />
            </div>
          </label>
        </div>
        <button
          @click="submitReport"
          class="w-full bg-[#D0202F] text-white py-2 rounded"
        >
          Submit Report
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Import your existing comment components
import CommentList from "@/components/Posts_Feed_Components/CommentList.vue";
import CommentForm from "@/components/Posts_Feed_Components/CommentForm.vue";

// Post components
import AudioContent from "@/components/Posts_Feed_Components/AudioPost.vue";
import MusicXmlContent from "@/components/Posts_Feed_Components/MusicXmlPost.vue";
import LyricsContent from "@/components/Posts_Feed_Components/LyricsPost.vue";
import MediaContent from "@/components/Posts_Feed_Components/MediaDisplay.vue";

// Types
interface PostBase {
  id: string;
  username: string;
  displayName: string;
  role: "Musician" | "Listener" | "Learner";
  avatarUrl: string;
  timestamp: string;
  type: "audio" | "musicxml" | "media" | "lyrics";
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
  userId: string;
}

interface AudioPost extends PostBase {
  type: "audio";
  content: {
    title: string;
    artist: string;
    coverUrl: string;
    duration: string;
    url: string;
  }[];
}

interface XmlPost extends PostBase {
  type: "musicxml";
  content: {
    fileName: string;
    composer: string;
    downloadUrl: string;
  }[];
}

interface MediaPost extends PostBase {
  type: "media";
  content: {
    mediaType: "media";
    items: {
      src: string;
      type: "image" | "video";
    }[];
  };
}

interface LyricsPost extends PostBase {
  type: "lyrics";
  content: {
    title: string;
    artist: string;
    lyricsText: string;
  };
}

// Comment interface matching backend response
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
}

type FeedPost = AudioPost | XmlPost | MediaPost | LyricsPost;
const props = defineProps<{ post: FeedPost }>();

function getComponent(type: FeedPost["type"]) {
  switch (type) {
    case "audio":
      return AudioContent;
    case "musicxml":
      return MusicXmlContent;
    case "lyrics":
      return LyricsContent;
    case "media":
      return MediaContent;
    default:
      return null;
  }
}

const side = `${(14 / 1920) * 100}vw`;
const inner = `${(24 / 1920) * 100}vw`;

// Menu and modal states
const showMenu = ref(false);
const showReportModal = ref(false);
const showCommentsModal = ref(false);
const reportReason = ref("");
const otherReason = ref("");
const menuBtnRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);

const menuPosition = ref<{
  left?: string;
  right?: string;
  marginLeft?: string;
  marginRight?: string;
}>({ right: "100%", marginRight: "8px" });

// Like functionality
const liked = ref(props.post.user_liked || false);
const likeCount = ref(props.post.likes_count || 0);
const isLiking = ref(false);

// Comment functionality
const commentCount = ref(props.post.comments_count || 0);
const comments = ref<Comment[]>([]);
const isLoadingComments = ref(false);
const isLoadingMoreComments = ref(false);
const isSubmittingComment = ref(false);
const commentsError = ref("");
const hasMoreComments = ref(true);
const commentsLimit = 20;
const commentsOffset = ref(0);

// Watch for prop changes
watch(
  () => props.post.user_liked,
  (newValue) => {
    liked.value = newValue || false;
  },
);

watch(
  () => props.post.likes_count,
  (newValue) => {
    likeCount.value = newValue || 0;
  },
);

watch(
  () => props.post.comments_count,
  (newValue) => {
    commentCount.value = newValue || 0;
  },
);

// Like toggle function with backend integration
async function toggleLike() {
  if (isLiking.value) return;

  isLiking.value = true;
  const previousLiked = liked.value;
  const previousCount = likeCount.value;

  // Optimistic update
  liked.value = !liked.value;
  likeCount.value += liked.value ? 1 : -1;

  try {
    const response = await fetch(`${API_URL}/posts/${props.post.id}/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }

    const result = await response.json();
    console.log("Like toggled:", result);
  } catch (error) {
    console.error("Error toggling like:", error);
    // Revert optimistic update
    liked.value = previousLiked;
    likeCount.value = previousCount;
  } finally {
    isLiking.value = false;
  }
}

// Comments modal functions
const openCommentsModal = () => {
  showCommentsModal.value = true;
  loadComments();
};

const closeCommentsModal = () => {
  showCommentsModal.value = false;
  comments.value = [];
  commentsOffset.value = 0;
  hasMoreComments.value = true;
  commentsError.value = "";
};

// Load comments from backend
const loadComments = async (loadMore = false) => {
  if (loadMore) {
    isLoadingMoreComments.value = true;
  } else {
    isLoadingComments.value = true;
    commentsOffset.value = 0;
  }

  commentsError.value = "";

  try {
    const response = await fetch(
      `${API_URL}/posts/${props.post.id}/comments?limit=${commentsLimit}&offset=${commentsOffset.value}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newComments: Comment[] = await response.json();
    console.log("Fetched comments:", newComments);

    if (loadMore) {
      comments.value.push(...newComments);
    } else {
      comments.value = newComments;
    }

    hasMoreComments.value = newComments.length === commentsLimit;
    commentsOffset.value += newComments.length;
  } catch (err) {
    console.error("Error loading comments:", err);
    commentsError.value =
      err instanceof Error ? err.message : "Failed to load comments";
  } finally {
    isLoadingComments.value = false;
    isLoadingMoreComments.value = false;
  }
};

// Load more comments
const loadMoreComments = () => {
  if (!isLoadingMoreComments.value && hasMoreComments.value) {
    loadComments(true);
  }
};

// Submit new comment
const handleSubmitComment = async (commentText: string) => {
  if (isSubmittingComment.value) return;

  isSubmittingComment.value = true;

  try {
    const response = await fetch(`${API_URL}/posts/${props.post.id}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: commentText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to post comment");
    }

    const result = await response.json();
    console.log("Comment posted:", result);

    // Add the new comment to the beginning of the list
    comments.value.unshift({
      id: result.comment.id,
      text: result.comment.text,
      created_at: result.comment.created_at,
      user: {
        id: result.comment.user.id,
        name: result.comment.user.name,
        login: result.comment.user.login,
        avatar_url: result.comment.user.avatar_url,
        role: result.comment.user.role,
      },
    });

    // Update comment count
    commentCount.value += 1;
  } catch (err) {
    console.error("Error posting comment:", err);
    commentsError.value =
      err instanceof Error ? err.message : "Failed to post comment";
  } finally {
    isSubmittingComment.value = false;
  }
};

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

watch(showMenu, async (open) => {
  if (!open) return;
  await nextTick();
  const el = modalRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  menuPosition.value =
    rect.right > window.innerWidth
      ? { left: "100%", marginLeft: "8px" }
      : { right: "100%", marginRight: "8px" };
});

function handleClickOutside(e: MouseEvent) {
  if (menuBtnRef.value && !menuBtnRef.value.contains(e.target as Node)) {
    showMenu.value = false;
  }
}
onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);

function openReportModal() {
  showReportModal.value = true;
  showMenu.value = false;
  reportReason.value = "";
  otherReason.value = "";
}

function closeReportModal() {
  showReportModal.value = false;
}

// Submit report with full backend integration and debug logging
async function submitReport() {
  console.log("🔍 submitReport called");
  console.log("🔍 reportReason:", reportReason.value);
  console.log("🔍 otherReason:", otherReason.value);
  console.log("🔍 post.id:", props.post.id);

  const reason =
    reportReason.value === "Other"
      ? otherReason.value.trim()
      : reportReason.value;

  console.log("🔍 final reason:", reason);

  if (!reason) {
    console.log("❌ No reason provided");
    return alert("Please select or enter a reason.");
  }

  const payload = {
    post_id: props.post.id,
    reason: reportReason.value === "Other" ? "Other" : reportReason.value,
    description:
      reportReason.value === "Other" ? otherReason.value.trim() : null,
  };

  console.log("🔍 Sending payload:", payload);
  console.log(`🔍 Making request to: ${API_URL}/reports/post`);

  try {
    console.log("🔍 Starting fetch request...");
    const response = await fetch(`${API_URL}/reports/post`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("🔍 Response received:");
    console.log("  - Status:", response.status);
    console.log("  - StatusText:", response.statusText);
    console.log("  - OK:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("❌ Error response data:", errorData);
      throw new Error(errorData.detail || "Failed to submit report");
    }

    const result = await response.json();
    console.log("✅ Report submitted successfully:", result);
    alert(
      "Report submitted successfully. Thank you for helping keep our community safe.",
    );
    closeReportModal();
  } catch (error: unknown) {
    console.error("❌ Error submitting report:", error);

    if (error instanceof Error) {
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      alert(error.message);
    } else {
      console.error("❌ Unknown error type:", error);
      alert("Failed to submit report. Please try again.");
    }
  }
}

function getBadgeStyle(role: string) {
  const base = {
    width: "clamp(62px, 3.229vw, 62px)",
    height: "clamp(26px, 1.354vw, 26px)",
    borderRadius: "5px",
    padding: "4px 8px",
    fontSize: "clamp(12px, 0.729vw, 14px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  if (role === "Musician")
    return { ...base, backgroundColor: "#6D01D0", color: "#FFFFFF" };
  if (role === "Learner")
    return { ...base, backgroundColor: "#000C9C", color: "#FFFFFF" };
  if (role === "Listener")
    return { ...base, backgroundColor: "#FFFFFF", color: "#000000" };
  return base;
}

const router = useRouter();

// FIXED: Updated goToProfile function to use the correct userId from the post
function goToProfile() {
  console.log("Navigating to profile for user:", props.post.userId);
  router.push({ name: "Profile", params: { userId: props.post.userId } });
}
</script>
