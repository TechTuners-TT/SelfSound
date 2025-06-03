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

      <!-- Dynamic content with proper props -->
      <div>
        <!-- Audio Post -->
        <AudioContent v-if="post.type === 'audio'" v-bind="post" />

        <!-- MusicXML Post -->
        <MusicXmlContent v-if="post.type === 'musicxml'" v-bind="post" />

        <!-- Lyrics Post - Fixed props -->
        <LyricsContent
          v-if="post.type === 'lyrics'"
          :content="post.content"
          :id="post.id"
        />

        <!-- Media Post - Fixed props -->
        <MediaContent
          v-if="post.type === 'media'"
          :content="post.content"
          :caption="post.caption"
        />
      </div>

      <!-- FOOTER -->
      <div class="flex items-center mt-3">
        <div
          class="flex items-center"
          :style="{ marginRight: 'auto', gap: '12px' }"
        >
          <!-- Like Button -->
          <div class="flex items-center gap-1">
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
              likeCount || 0
            }}</span>
          </div>

          <!-- Comments Button - Only show if showCommentButton is true -->
          <div v-if="showCommentButton" class="flex items-center gap-1">
            <button
              @click="navigateToPostPage"
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
              commentCount || 0
            }}</span>
          </div>
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
  caption?: string;
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

type FeedPost = AudioPost | XmlPost | MediaPost | LyricsPost;

// Props with default values
const props = withDefaults(
  defineProps<{
    post: FeedPost;
    showCommentButton?: boolean;
  }>(),
  {
    showCommentButton: true,
  },
);

// Use the prop value directly
const showCommentButton = props.showCommentButton;

const side = `${(14 / 1920) * 100}vw`;
const inner = `${(24 / 1920) * 100}vw`;

// Menu and modal states
const showMenu = ref(false);
const showReportModal = ref(false);
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

// Like functionality - FIXED: Proper initial state
const liked = ref(Boolean(props.post.user_liked));
const likeCount = ref(Math.max(0, props.post.likes_count || 0));
const isLiking = ref(false);

// Comment functionality
const commentCount = ref(props.post.comments_count || 0);

// Watch for prop changes - FIXED: Proper boolean conversion
watch(
  () => props.post.user_liked,
  (newValue) => {
    liked.value = Boolean(newValue);
    console.log("🔍 PostCard - Props changed, new liked state:", liked.value);
  },
);

watch(
  () => props.post.likes_count,
  (newValue) => {
    likeCount.value = Math.max(0, newValue || 0);
  },
);

watch(
  () => props.post.comments_count,
  (newValue) => {
    commentCount.value = newValue || 0;
  },
);

// Router for navigation
const router = useRouter();

// Like toggle function with backend integration - FRONTEND-ONLY FIX
async function toggleLike() {
  if (isLiking.value) return;

  console.log("🔍 LIKE DEBUG - Button clicked!");
  console.log("🔍 LIKE DEBUG - Post ID:", props.post.id);
  console.log("🔍 LIKE DEBUG - Current liked state:", liked.value);
  console.log("🔍 LIKE DEBUG - Current count:", likeCount.value);

  isLiking.value = true;
  const previousLiked = liked.value;
  const previousCount = likeCount.value;

  // Optimistic update - ensure count never goes below 0
  liked.value = !liked.value;
  if (liked.value) {
    likeCount.value = previousCount + 1;
  } else {
    likeCount.value = Math.max(0, previousCount - 1);
  }

  console.log("🔍 LIKE DEBUG - After optimistic update:", {
    liked: liked.value,
    count: likeCount.value,
  });

  try {
    console.log("🔍 LIKE DEBUG - Making API call...");

    const response = await fetch(`${API_URL}/posts/${props.post.id}/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🔍 LIKE DEBUG - Response status:", response.status);
    console.log("🔍 LIKE DEBUG - Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ LIKE DEBUG - API Error:", errorText);
      throw new Error(`Failed to toggle like: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ LIKE DEBUG - API Success Response:", result);

    // FRONTEND-ONLY FIX: Handle your backend's actual response format
    // Your backend returns: {"message": "Post liked", "liked": true}
    if (result.liked !== undefined) {
      console.log("🔍 LIKE DEBUG - Using backend 'liked' field:", result.liked);
      liked.value = result.liked;

      // Keep our optimistic count update since backend doesn't return count
      console.log("🔍 LIKE DEBUG - Keeping optimistic count:", likeCount.value);
    } else if (result.user_liked !== undefined) {
      // Fallback: if backend format changes
      console.log(
        "🔍 LIKE DEBUG - Using backend 'user_liked' field:",
        result.user_liked,
      );
      liked.value = result.user_liked;
      if (result.likes_count !== undefined) {
        likeCount.value = Math.max(0, result.likes_count);
      }
    } else {
      // Keep optimistic update if no recognizable fields
      console.log(
        "🔍 LIKE DEBUG - No recognized fields, keeping optimistic update",
      );
    }

    console.log("🔍 LIKE DEBUG - Final state after server response:", {
      liked: liked.value,
      count: likeCount.value,
    });
  } catch (error) {
    console.error("❌ LIKE DEBUG - Error:", error);
    // Revert optimistic update
    liked.value = previousLiked;
    likeCount.value = previousCount;
    console.log("🔍 LIKE DEBUG - Reverted to:", {
      liked: liked.value,
      count: likeCount.value,
    });
  } finally {
    isLiking.value = false;
    console.log("🔍 LIKE DEBUG - Done");
  }
}

// Navigate to post page instead of opening modal
const navigateToPostPage = () => {
  router.push({ name: "PostPage", params: { postId: props.post.id } });
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

// Updated goToProfile function to use the correct userId from the post
function goToProfile() {
  console.log("Navigating to profile for user:", props.post.userId);
  router.push({ name: "Profile", params: { userId: props.post.userId } });
}
</script>
