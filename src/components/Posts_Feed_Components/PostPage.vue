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
              <a href="#home">
                <CloseButton
                  class="cursor-pointer 2xl:w-[25px] 2xl:h-[25px] xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[18px] md:h-[18px] sm:w-[16px] sm:h-[16px] w-[14px] h-[14px]"
                />
              </a>
            </div>

            <div>
              <hr class="border-t border-white/50" />
            </div>

            <div class="mt-2">
              <PostCard :post="mockPost" />
            </div>

            <div class="px-6 mt-7">
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

              <!-- Comments list -->
              <CommentList :comments="comments" />

              <!-- Load more comments button -->
              <div
                v-if="hasMoreComments && comments.length > 0"
                class="text-center mt-4"
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
import NavBar from "@/components/Navigation/NavBar.vue";
import CloseButton from "@/components/SVG/AddPosts_Icons/CloseIcon.vue";
import PostCard from "../Posts_Feed_Components/PostCard.vue";
import CommentList from "@/components/Posts_Feed_Components/CommentList.vue";
import CommentForm from "@/components/Posts_Feed_Components/CommentForm.vue";
import cover from "@/assets/btbt-cover.jpg";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface AudioTrack {
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  url: string;
}

interface AudioPost {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  role: "Musician" | "Listener" | "Learner";
  avatarUrl: string;
  timestamp: string;
  type: "audio";
  content: AudioTrack[];
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
  author_id: string;
  author_name: string;
  author_login: string;
  author_avatar_url?: string;
  author_role?: string;
  mentions?: Array<{
    user_id: string;
    login: string;
    name: string;
    avatar_url: string;
  }>;
}

const mockPost = ref<AudioPost>({
  id: "1", // You might want to get this from route params in a real app
  userId: "u1",
  username: "user1",
  displayName: "Test User",
  role: "Musician",
  avatarUrl: cover,
  timestamp: "2025-05-24T12:00:00Z",
  type: "audio",
  content: [
    {
      title: "Agust D",
      artist: "Agust D",
      coverUrl: cover,
      duration: "3:50",
      url: "https://example.com/audio/agust-d.mp3",
    },
    {
      title: "Airplane",
      artist: "J-Hope",
      coverUrl: cover,
      duration: "3:35",
      url: "https://example.com/audio/airplane.mp3",
    },
  ],
});

// Comment state
const comments = ref<Comment[]>([]);
const isSubmittingComment = ref(false);
const isLoadingComments = ref(false);
const isLoadingMoreComments = ref(false);
const commentError = ref("");
const hasMoreComments = ref(true);
const commentsLimit = 20;
const commentsOffset = ref(0);

// Load comments from backend
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
      `${API_URL}/posts/${mockPost.value.id}/comments?limit=${commentsLimit}&offset=${commentsOffset.value}`,
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
    console.log("🔍 PostPage - Fetched comments:", backendComments);

    // Transform backend comments to match your frontend format
    const transformedComments: Comment[] = backendComments.map(
      (comment: BackendComment) => ({
        id: comment.id,
        text: comment.content || comment.text || "", // Handle both formats with fallback
        created_at: comment.created_at,
        user: {
          id: comment.author_id,
          name: comment.author_name,
          login: comment.author_login,
          avatar_url: comment.author_avatar_url || "",
          role: comment.author_role || "Listener",
        },
        mentions: comment.mentions || [],
      }),
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

// Handle new comment submission with proper API integration
async function handleNewComment(commentText: string) {
  if (isSubmittingComment.value) return;

  console.log("🔍 PostPage - Submitting comment:", commentText);
  console.log("🔍 PostPage - Post ID:", mockPost.value.id);

  isSubmittingComment.value = true;
  commentError.value = "";

  try {
    // Call your updated backend API
    const response = await fetch(
      `${API_URL}/posts/${mockPost.value.id}/comments`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
        }),
      },
    );

    console.log("🔍 PostPage - Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ PostPage - API Error:", errorData);
      throw new Error(errorData.detail || "Failed to post comment");
    }

    const result = (await response.json()) as BackendComment;
    console.log("✅ PostPage - Comment posted successfully:", result);

    // Transform the backend response to match your frontend format
    const newComment: Comment = {
      id: result.id,
      text: result.content || result.text || "",
      created_at: result.created_at,
      user: {
        id: result.author_id,
        name: result.author_name,
        login: result.author_login,
        avatar_url: result.author_avatar_url || "",
        role: result.author_role || "Listener",
      },
      mentions: result.mentions || [],
    };

    // Add the new comment to the beginning of the list
    comments.value.unshift(newComment);
    console.log("✅ PostPage - Comment added to list");
  } catch (err) {
    console.error("❌ PostPage - Error posting comment:", err);
    commentError.value =
      err instanceof Error ? err.message : "Failed to post comment";
  } finally {
    isSubmittingComment.value = false;
  }
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: "auto" });
  // Load existing comments when page loads
  loadComments();
});
</script>
