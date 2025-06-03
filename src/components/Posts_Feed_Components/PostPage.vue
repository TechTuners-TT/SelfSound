<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <main class="flex flex-col flex-grow overflow-auto">
      <NavBar />

      <div class="flex-grow max-h-full">
        <div class="relative flex items-start justify-center w-full h-full">
          <div
            class="relative w-full md:w-3/5 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
          >
            <div class="m-[20px]">
              <button @click="goBack" class="cursor-pointer">
                <CloseButton
                  class="2xl:w-[25px] 2xl:h-[25px] xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[18px] md:h-[18px] sm:w-[16px] sm:h-[16px] w-[14px] h-[14px]"
                />
              </button>
            </div>

            <div>
              <hr class="border-t border-white/50" />
            </div>

            <!-- Loading state for post -->
            <div v-if="isLoadingPost" class="flex justify-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0]"
              ></div>
              <span class="text-white ml-2">Loading post...</span>
            </div>

            <!-- Error state for post -->
            <div v-if="postError" class="text-center py-8">
              <p class="text-red-400 mb-4">{{ postError }}</p>
              <button
                @click="loadPost"
                class="bg-[#6D01D0] hover:bg-[#5a0ba8] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>

            <!-- Post content -->
            <div v-if="post && !isLoadingPost" class="mt-2">
              <!-- Lyrics posts get special treatment -->
              <div v-if="post.type === 'lyrics'">
                <!-- User info header (like PostCard header) -->
                <div class="flex items-center justify-between mb-6 px-6">
                  <div class="flex items-center" style="gap: 12px">
                    <div
                      class="rounded-full overflow-hidden"
                      style="width: 40px; height: 40px"
                    >
                      <img
                        :src="post.avatarUrl || '/placeholder-avatar.jpg'"
                        alt="avatar"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="leading-tight flex flex-col">
                      <div
                        class="text-white font-semibold text-base font-inter"
                      >
                        {{ post.displayName }}
                      </div>
                      <div
                        @click="goToProfile(post.userId)"
                        class="text-white font-normal text-sm mt-1 font-inter hover:text-[#6D01D0] transition-colors cursor-pointer"
                      >
                        @{{ post.username }}
                      </div>
                    </div>
                    <span
                      class="flex items-center justify-center font-medium px-3 py-1 rounded text-sm"
                      :style="getBadgeStyle(post.role)"
                    >
                      {{ post.role }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-400">{{
                    post.timestamp
                  }}</span>
                </div>

                <!-- Full lyrics display -->
                <div class="text-white font-inter px-6">
                  <!-- Header with title and artist -->
                  <div class="mb-8 text">
                    <h1 class="text-2xl font-bold mb-2">
                      {{ post.content.title }}
                    </h1>
                    <p class="text-lg text-gray-300">
                      {{ post.content.artist }}
                    </p>
                  </div>

                  <!-- Full lyrics with proper formatting -->
                  <div
                    class="text-base leading-relaxed whitespace-pre-line p-6 rounded-lg"
                  >
                    {{ post.content.lyricsText || "No lyrics available" }}
                  </div>
                </div>

                <!-- Like and comment stats (like PostCard footer) -->
                <div class="flex items-center mt-6 px-6">
                  <div class="flex items-center gap-4 mr-auto">
                    <!-- Like Button -->
                    <div class="flex items-center gap-1">
                      <button
                        @click="toggleLike"
                        :disabled="isLiking"
                        :class="[
                          liked
                            ? 'text-[#6D01D0]'
                            : 'text-white hover:text-[#6D01D0]',
                          isLiking
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer',
                        ]"
                        class="flex items-center justify-center transition-colors w-6 h-6"
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
                      <span class="text-sm text-white">{{
                        likeCount || 0
                      }}</span>
                    </div>

                    <!-- Comments count -->
                    <div class="flex items-center gap-1">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 21 20"
                        fill="none"
                        stroke="currentColor"
                        class="text-white"
                      >
                        <path
                          d="M19.1001 9.5C19.1035 10.8199 18.7952 12.1219 18.2001 13.3C17.4945 14.7118 16.4099 15.8992 15.0675 16.7293C13.7252 17.5594 12.1783 17.9994 10.6001 18C9.2802 18.0035 7.97822 17.6951 6.8001 17.1L1.1001 19L3.0001 13.3C2.40503 12.1219 2.09666 10.8199 2.1001 9.5C2.10071 7.92179 2.54071 6.37488 3.37082 5.03258C4.20093 3.69028 5.38835 2.6056 6.8001 1.90003C7.97822 1.30496 9.2802 0.996588 10.6001 1.00003H11.1001C13.1844 1.11502 15.1531 1.99479 16.6292 3.47089C18.1053 4.94699 18.9851 6.91568 19.1001 9V9.5Z"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span class="text-sm text-white">{{
                        commentCount || 0
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MusicXML posts get special treatment -->
              <div v-else-if="post.type === 'musicxml'">
                <!-- User info header (same as lyrics) -->
                <div class="flex items-center justify-between mb-6 px-6">
                  <div class="flex items-center" style="gap: 12px">
                    <div
                      class="rounded-full overflow-hidden"
                      style="width: 40px; height: 40px"
                    >
                      <img
                        :src="post.avatarUrl || '/placeholder-avatar.jpg'"
                        alt="avatar"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="leading-tight flex flex-col">
                      <div
                        class="text-white font-semibold text-base font-inter"
                      >
                        {{ post.displayName }}
                      </div>
                      <div
                        @click="goToProfile(post.userId)"
                        class="text-white font-normal text-sm mt-1 font-inter hover:text-[#6D01D0] transition-colors cursor-pointer"
                      >
                        @{{ post.username }}
                      </div>
                    </div>
                    <span
                      class="flex items-center justify-center font-medium px-3 py-1 rounded text-sm"
                      :style="getBadgeStyle(post.role)"
                    >
                      {{ post.role }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-400">{{
                    post.timestamp
                  }}</span>
                </div>

                <!-- MusicXML files display -->
                <div class="px-6">
                  <MusicXmlContent :content="post.content" />
                </div>

                <!-- Like and comment stats -->
                <div class="flex items-center mt-6 px-6">
                  <div class="flex items-center gap-4 mr-auto">
                    <!-- Like Button -->
                    <div class="flex items-center gap-1">
                      <button
                        @click="toggleLike"
                        :disabled="isLiking"
                        :class="[
                          liked
                            ? 'text-[#6D01D0]'
                            : 'text-white hover:text-[#6D01D0]',
                          isLiking
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer',
                        ]"
                        class="flex items-center justify-center transition-colors w-6 h-6"
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
                      <span class="text-sm text-white">{{
                        likeCount || 0
                      }}</span>
                    </div>
                    <!-- Comments count -->
                    <div class="flex items-center gap-1">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 21 20"
                        fill="none"
                        stroke="currentColor"
                        class="text-white"
                      >
                        <path
                          d="M19.1001 9.5C19.1035 10.8199 18.7952 12.1219 18.2001 13.3C17.4945 14.7118 16.4099 15.8992 15.0675 16.7293C13.7252 17.5594 12.1783 17.9994 10.6001 18C9.2802 18.0035 7.97822 17.6951 6.8001 17.1L1.1001 19L3.0001 13.3C2.40503 12.1219 2.09666 10.8199 2.1001 9.5C2.10071 7.92179 2.54071 6.37488 3.37082 5.03258C4.20093 3.69028 5.38835 2.6056 6.8001 1.90003C7.97822 1.30496 9.2802 0.996588 10.6001 1.00003H11.1001C13.1844 1.11502 15.1531 1.99479 16.6292 3.47089C18.1053 4.94699 18.9851 6.91568 19.1001 9V9.5Z"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span class="text-sm text-white">{{
                        commentCount || 0
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- All other post types use PostCard -->
              <PostCard v-else :post="post" :show-comment-button="false" />
            </div>

            <!-- Comments Section with Mobile-Safe Bottom Padding -->
            <div class="px-6 mt-7 pb-24 md:pb-8">
              <h3 class="text-white font-semibold text-lg mb-7">Comments</h3>

              <!-- Comment Form with proper API integration -->
              <CommentForm
                @submit="handleNewComment"
                :disabled="isSubmittingComment"
              />

              <!-- Submitting indicator -->
              <div
                v-if="isSubmittingComment"
                class="flex items-center justify-center mt-2 mb-4"
              >
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6D01D0] mr-2"
                ></div>
                <span class="text-sm text-gray-400">Posting comment...</span>
              </div>

              <!-- Error message -->
              <div
                v-if="commentError"
                class="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mt-2 mb-4"
              >
                {{ commentError }}
                <button
                  @click="commentError = ''"
                  class="ml-2 text-red-300 hover:text-red-100"
                >
                  ×
                </button>
              </div>

              <!-- Loading state for comments -->
              <div v-if="isLoadingComments" class="flex justify-center py-8">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0]"
                ></div>
              </div>

              <!-- Comments list using your existing CommentItem -->
              <div v-if="comments.length > 0" class="space-y-0">
                <CommentItem
                  v-for="comment in comments"
                  :key="comment.id"
                  :comment="comment"
                  :show-actions="false"
                  :show-comment-input="false"
                  @mention-click="handleMentionClick"
                />
              </div>

              <!-- Empty state for comments -->
              <div
                v-if="!isLoadingComments && comments.length === 0"
                class="text-center py-8 text-gray-400"
              >
                <p class="text-lg mb-2">No comments yet</p>
                <p class="text-sm">Be the first to comment!</p>
              </div>

              <!-- Load more comments button with mobile-safe margin -->
              <div
                v-if="hasMoreComments && comments.length > 0"
                class="text-center mt-4 mb-8"
              >
                <button
                  @click="loadMoreComments"
                  :disabled="isLoadingMoreComments"
                  class="bg-[#6D01D0] hover:bg-[#5a0ba8] disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {{
                    isLoadingMoreComments ? "Loading..." : "Load More Comments"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavBar from "@/components/Navigation/NavBar.vue";
import CloseButton from "@/components/SVG/AddPosts_Icons/CloseIcon.vue";
import PostCard from "../Posts_Feed_Components/PostCard.vue";
import CommentItem from "@/components/Posts_Feed_Components/CommentItem.vue";
import CommentForm from "@/components/Posts_Feed_Components/CommentForm.vue";
import MusicXmlContent from "@/components/Posts_Feed_Components/MusicXmlPost.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const router = useRouter();

// Get post ID from route params
const postId = route.params.postId as string;

// Complete Post Type Interfaces
interface PostBase {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  role: "Musician" | "Listener" | "Learner";
  avatarUrl: string;
  timestamp: string;
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
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
      id?: string;
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
  mentions?: Array<{
    user_id: string;
    login: string;
    name: string;
    avatar_url: string;
  }>;
}

// Backend comment interface for API response typing
interface BackendComment {
  id: string;
  content?: string;
  text?: string;
  created_at: string;
  author_id?: string;
  author_name?: string;
  author_login?: string;
  author_avatar_url?: string;
  author_role?: string;
  // Alternative structure if data comes differently
  user?: {
    id?: string;
    name?: string;
    login?: string;
    avatar_url?: string;
    role?: string;
  };
  mentions?: Array<{
    user_id: string;
    login: string;
    name: string;
    avatar_url: string;
  }>;
}

// Complete Backend post interface
interface BackendPost {
  id: string;
  type: string;
  caption?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  user: {
    id: string;
    login: string;
    name: string;
    tag_id: string | null;
    avatar_url?: string;
  };
  // Media posts
  media?: Array<{
    id: string;
    file_url: string;
    file_type: string;
  }>;
  // Audio posts
  audio?: Array<{
    title: string;
    artist: string;
    cover_url?: string;
    duration?: string;
    file_url: string;
  }>;
  // MusicXML posts
  musicxml?: Array<{
    title: string;
    composer: string;
    file_url: string;
  }>;
  // Lyrics posts
  lyrics?: {
    title: string;
    artist: string;
    lyrics_text: string;
  };
}

// Post state - now supports all post types
const post = ref<FeedPost | null>(null);
const isLoadingPost = ref(false);
const postError = ref("");

// Like functionality for lyrics and musicxml posts
const liked = ref(false);
const likeCount = ref(0);
const isLiking = ref(false);
const commentCount = ref(0);

// Comment state
const comments = ref<Comment[]>([]);
const isSubmittingComment = ref(false);
const isLoadingComments = ref(false);
const isLoadingMoreComments = ref(false);
const commentError = ref("");
const hasMoreComments = ref(true);
const commentsLimit = 20;
const commentsOffset = ref(0);

// Map backend user roles to your role system
const mapUserRole = (
  tagId: string | null,
): "Musician" | "Listener" | "Learner" => {
  const roleMap: Record<string, "Musician" | "Listener" | "Learner"> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[tagId || ""] || "Listener";
};

// Format timestamp
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
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

// Enhanced transform function with better error handling and debugging
const transformBackendPost = (backendPost: BackendPost): FeedPost | null => {
  try {
    console.log("🔍 PostPage - Raw backend data:", backendPost);
    console.log("🔍 PostPage - Post type:", backendPost.type);

    // EXPLICIT user_liked conversion - handles runtime vs compile-time type differences
    let properUserLiked = false;

    // Cast to unknown first to handle runtime type differences
    const userLikedValue = backendPost.user_liked as unknown;

    if (userLikedValue === true) {
      properUserLiked = true;
    } else if (userLikedValue === 1) {
      properUserLiked = true;
    } else if (userLikedValue === "true") {
      properUserLiked = true;
    } else if (userLikedValue === "1") {
      properUserLiked = true;
    } else {
      properUserLiked = false;
    }

    const basePost = {
      id: backendPost.id,
      userId: backendPost.user.id,
      username: backendPost.user.login,
      displayName: backendPost.user.name,
      role: mapUserRole(backendPost.user.tag_id),
      avatarUrl: backendPost.user.avatar_url || "",
      timestamp: formatTimestamp(backendPost.created_at),
      likes_count: Number(backendPost.likes_count) || 0,
      comments_count: Number(backendPost.comments_count) || 0,
      user_liked: properUserLiked,
    };

    console.log(`🔍 PostPage - Processing post type: ${backendPost.type}`);

    // Transform lyrics posts FIRST with better validation
    if (backendPost.type === "lyrics") {
      console.log("📝 PostPage - Processing lyrics post");
      console.log("📝 PostPage - Lyrics data:", backendPost.lyrics);

      if (!backendPost.lyrics) {
        console.error("❌ PostPage - Lyrics post missing lyrics data");
        return null;
      }

      const lyricsPost: LyricsPost = {
        ...basePost,
        type: "lyrics",
        content: {
          title: backendPost.lyrics.title || "Untitled",
          artist: backendPost.lyrics.artist || "Unknown Artist",
          lyricsText: backendPost.lyrics.lyrics_text || "",
        },
      };

      console.log(
        "✅ PostPage - Successfully created lyrics post:",
        lyricsPost,
      );
      return lyricsPost;
    }

    // Transform media posts
    if (backendPost.type === "media" && backendPost.media) {
      console.log("🖼️ PostPage - Processing media post");

      const mediaPost: MediaPost = {
        ...basePost,
        type: "media",
        content: {
          mediaType: "media",
          items: backendPost.media.map((item) => ({
            id: item.id,
            src: item.file_url,
            type: item.file_type === "image" ? "image" : "video",
          })),
        },
      };

      console.log("✅ PostPage - Successfully created media post:", mediaPost);
      return mediaPost;
    }

    // Transform audio posts
    if (backendPost.type === "audio" && backendPost.audio) {
      console.log("🎵 PostPage - Processing audio post");

      const audioPost: AudioPost = {
        ...basePost,
        type: "audio",
        content: backendPost.audio.map((item) => ({
          title: item.title,
          artist: item.artist,
          coverUrl: item.cover_url || "",
          duration: item.duration || "0:00",
          url: item.file_url,
        })),
      };

      console.log("✅ PostPage - Successfully created audio post:", audioPost);
      return audioPost;
    }

    // Transform MusicXML posts
    if (backendPost.type === "musicxml" && backendPost.musicxml) {
      console.log("📄 PostPage - Processing MusicXML post");

      const xmlPost: XmlPost = {
        ...basePost,
        type: "musicxml",
        content: backendPost.musicxml.map((item) => ({
          fileName: item.title,
          composer: item.composer,
          downloadUrl: item.file_url,
        })),
      };

      console.log("✅ PostPage - Successfully created MusicXML post:", xmlPost);
      return xmlPost;
    }

    // Log detailed error information for unsupported posts
    console.error("⚠️ PostPage - Unsupported post type or missing data:", {
      type: backendPost.type,
      hasMedia: !!backendPost.media,
      hasAudio: !!backendPost.audio,
      hasMusicxml: !!backendPost.musicxml,
      hasLyrics: !!backendPost.lyrics,
      availableFields: Object.keys(backendPost),
      post: backendPost,
    });

    return null;
  } catch (error) {
    console.error("❌ PostPage - Error transforming post:", error);
    console.error("❌ PostPage - Original post data:", backendPost);
    return null;
  }
};

// Load post from backend with enhanced debugging
async function loadPost() {
  console.log(`🔍 PostPage - Loading post: ${postId}`);

  isLoadingPost.value = true;
  postError.value = "";

  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Post not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPost = (await response.json()) as BackendPost;
    console.log("🔍 PostPage - Fetched post raw data:", backendPost);
    console.log("🔍 PostPage - Post type from API:", backendPost.type);

    const transformedPost = transformBackendPost(backendPost);
    if (!transformedPost) {
      throw new Error(`Failed to transform post of type: ${backendPost.type}`);
    }

    post.value = transformedPost;

    // Set like/comment data for lyrics and musicxml posts
    if (
      transformedPost.type === "lyrics" ||
      transformedPost.type === "musicxml"
    ) {
      liked.value = transformedPost.user_liked || false;
      likeCount.value = transformedPost.likes_count || 0;
      commentCount.value = transformedPost.comments_count || 0;
    }

    console.log("✅ PostPage - Post loaded successfully:", transformedPost);
  } catch (err) {
    console.error("❌ PostPage - Error loading post:", err);
    postError.value =
      err instanceof Error ? err.message : "Failed to load post";
  } finally {
    isLoadingPost.value = false;
  }
}

// Like toggle for lyrics and musicxml posts
async function toggleLike() {
  if (isLiking.value || !post.value) return;

  isLiking.value = true;
  const previousLiked = liked.value;
  const previousCount = likeCount.value;

  // Optimistic update
  liked.value = !liked.value;
  if (liked.value) {
    likeCount.value = previousCount + 1;
  } else {
    likeCount.value = Math.max(0, previousCount - 1);
  }

  try {
    const response = await fetch(`${API_URL}/posts/${post.value.id}/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle like: ${response.status}`);
    }

    const result = await response.json();
    if (result.liked !== undefined) {
      liked.value = result.liked;
    }
  } catch (error) {
    console.error("❌ Error toggling like:", error);
    // Revert optimistic update
    liked.value = previousLiked;
    likeCount.value = previousCount;
  } finally {
    isLiking.value = false;
  }
}

// Badge style function
function getBadgeStyle(role: string) {
  const base = {
    borderRadius: "5px",
    fontSize: "12px",
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

// Load comments from backend with data transformation
async function loadComments(loadMore = false) {
  console.log(`🔍 PostPage - Loading comments (loadMore: ${loadMore})`);

  if (loadMore) {
    isLoadingMoreComments.value = true;
  } else {
    isLoadingComments.value = true;
    commentsOffset.value = 0;
  }

  try {
    const response = await fetch(
      `${API_URL}/posts/${postId}/comments?limit=${commentsLimit}&offset=${commentsOffset.value}`,
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

    const backendComments = (await response.json()) as BackendComment[];
    console.log("🔍 COMMENTS - Raw backend comments:", backendComments);

    // Transform backend comments to match your frontend format
    const transformedComments: Comment[] = backendComments.map(
      (comment: BackendComment) => {
        const userId = comment.author_id || comment.user?.id || "";
        const userName =
          comment.author_name || comment.user?.name || "Anonymous User";
        const userLogin =
          comment.author_login || comment.user?.login || "anonymous";
        const avatarUrl =
          comment.author_avatar_url || comment.user?.avatar_url || "";
        const userRole =
          comment.author_role || comment.user?.role || "Listener";

        return {
          id: comment.id,
          text: comment.content || comment.text || "",
          created_at: comment.created_at,
          user: {
            id: userId,
            name: userName,
            login: userLogin,
            avatar_url: avatarUrl,
            role: userRole,
          },
          mentions: comment.mentions || [],
        };
      },
    );

    if (loadMore) {
      comments.value.push(...transformedComments);
    } else {
      comments.value = transformedComments;
    }

    hasMoreComments.value = backendComments.length === commentsLimit;
    commentsOffset.value += backendComments.length;

    console.log(`✅ PostPage - Loaded ${transformedComments.length} comments`);
  } catch (err) {
    console.error("❌ PostPage - Error loading comments:", err);
    commentError.value =
      err instanceof Error ? err.message : "Failed to load comments";
  } finally {
    isLoadingComments.value = false;
    isLoadingMoreComments.value = false;
  }
}

// Load more comments
function loadMoreComments() {
  if (!isLoadingMoreComments.value && hasMoreComments.value) {
    loadComments(true);
  }
}

// Handle new comment submission with proper API integration and data transformation
async function handleNewComment(commentText: string) {
  if (isSubmittingComment.value) return;

  console.log("🔍 COMMENT - Starting comment submission");
  isSubmittingComment.value = true;
  commentError.value = "";

  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: commentText,
      }),
    });

    console.log("🔍 COMMENT - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ COMMENT - API Error:", errorText);
      throw new Error(
        `Failed to post comment: ${response.status} ${errorText}`,
      );
    }

    const result = await response.json();
    console.log("✅ COMMENT - API Success Response:", result);

    // Transform the backend response to match your frontend format
    if (result.comment) {
      const backendComment = result.comment;

      // Transform backend comment to frontend format with proper data handling
      const newComment: Comment = {
        id: backendComment.id,
        text: backendComment.text || backendComment.content || "",
        created_at: backendComment.created_at,
        user: {
          id: backendComment.user?.id || "unknown",
          name: backendComment.user?.name || "Anonymous User",
          login: backendComment.user?.login || "anonymous",
          avatar_url: backendComment.user?.avatar_url || "",
          role: backendComment.user?.role || "Listener",
        },
        mentions: backendComment.mentions || [],
      };

      // Add the new comment to the beginning of the list
      comments.value.unshift(newComment);

      // Update comment count
      if (post.value) {
        if (post.value.type === "lyrics" || post.value.type === "musicxml") {
          commentCount.value = (commentCount.value || 0) + 1;
        } else {
          post.value.comments_count = (post.value.comments_count || 0) + 1;
        }
      }

      console.log("✅ COMMENT - Successfully added comment to UI");
    } else {
      console.warn("⚠️ COMMENT - No comment data in response");
      // Refresh comments as fallback
      await loadComments();
    }
  } catch (err) {
    console.error("❌ COMMENT - Error posting comment:", err);
    commentError.value =
      err instanceof Error ? err.message : "Failed to post comment";
  } finally {
    isSubmittingComment.value = false;
  }
}

// Handle mention clicks in comments
function handleMentionClick(userId: string) {
  console.log("🔍 PostPage - Mention clicked:", userId);
  goToProfile(userId);
}

// Navigation functions
function goToProfile(userId: string) {
  if (userId) {
    router.push({ name: "Profile", params: { userId } });
  }
}

function goBack() {
  router.back();
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: "auto" });

  // Validate post ID
  if (!postId) {
    postError.value = "No post ID provided";
    return;
  }

  // Load post and comments
  loadPost();
  loadComments();
});
</script>
