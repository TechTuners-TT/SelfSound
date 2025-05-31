<template>
  <section class="flex flex-col gap-15 mx-auto section_1">
    <div
      class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
    >
      <button
        @click="toggleListen"
        :disabled="isLoading"
        class="cursor-pointer w-full h-8 text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] text-white rounded-[5px] shadow-sm mx-auto block inter-font disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        :style="{
          backgroundColor: isListening
            ? 'rgba(109, 1, 208,0.5)'
            : 'rgba(0, 12, 156,0.4)',
          fontWeight: '500',
        }"
      >
        {{ isLoading ? "Loading..." : isListening ? "Unlisten" : "Listen" }}
      </button>
    </div>

    <div class="w-full h-px border border-[rgba(255,255,255,0.5)]"></div>

    <!-- Posts Section - Using PostCard component like your working profile -->
    <div class="w-full">
      <!-- Debug info -->

      <!-- Loading State -->
      <div
        v-if="isLoadingPosts && posts.length === 0"
        class="text-white text-center py-8"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0] mx-auto mb-4"
        ></div>
        Loading posts...
      </div>

      <!-- Error State -->
      <div v-if="postsError" class="text-red-400 text-center py-4 mb-4 mx-4">
        {{ postsError }}
        <button
          @click="handleRetry"
          class="block mx-auto mt-2 text-[#6D01D0] hover:text-[#8B4CD8]"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="!isLoadingPosts && !postsError && posts.length === 0"
        class="text-gray-400 text-center py-8"
      >
        <p class="text-lg mb-2">No posts yet</p>
        <p class="text-sm">Posts will appear below</p>
      </div>

      <!-- Posts using PostCard component like your working profile -->
      <PostCard v-for="post in posts" :key="post.id" :post="post" />

      <!-- Load More Button -->
      <div v-if="hasMore && posts.length > 0" class="text-center mt-8">
        <button
          @click="handleLoadMore"
          :disabled="isLoadingMore"
          class="bg-[#6D01D0] hover:bg-[#5a0ba8] disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {{ isLoadingMore ? "Loading..." : "Load More" }}
        </button>
      </div>

      <!-- Debug toggle button -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostCard from "@/components/Posts_Feed_Components/PostCard.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const router = useRouter();
const userId = route.params.userId as string;

// Listen/unlisten state
const isListening = ref(false);
const isLoading = ref(false);
const isGuest = ref(false);

// Posts state
const posts = ref<FeedPost[]>([]);
const isLoadingPosts = ref(false);
const isLoadingMore = ref(false);
const postsError = ref<string | null>(null);
const hasMore = ref(true);
const offset = ref(0);
const limit = 10;

// Add emit for stats update
const emit = defineEmits<{
  (e: "stats-updated"): void;
}>();

// Backend post interface for API responses - matching your working profile
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
  media?: Array<{
    id: string;
    file_url: string;
    file_type: string;
  }>;
  audio?: Array<{
    title: string;
    artist: string;
    cover_url?: string;
    duration?: string;
    file_url: string;
  }>;
  musicxml?: Array<{
    title: string;
    composer: string;
    file_url: string;
  }>;
  lyrics?: {
    title: string;
    artist: string;
    lyrics_text: string;
  };
}

// Frontend post interfaces - matching your working profile
interface PostBase {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  role: "Musician" | "Listener" | "Learner";
  avatarUrl: string;
  timestamp: string;
  type: "audio" | "musicxml" | "media" | "lyrics";
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
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

// Map backend user roles to your role system - matching your working profile
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

// Format timestamp - matching your working profile
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

// Transform backend post to your format - matching your working profile exactly
const transformBackendPost = (backendPost: BackendPost): FeedPost | null => {
  try {
    const basePost = {
      id: backendPost.id,
      userId: backendPost.user.id,
      username: backendPost.user.login,
      displayName: backendPost.user.name,
      role: mapUserRole(backendPost.user.tag_id),
      avatarUrl: backendPost.user.avatar_url || "",
      timestamp: formatTimestamp(backendPost.created_at),
      likes_count: backendPost.likes_count,
      comments_count: backendPost.comments_count,
      user_liked: backendPost.user_liked,
      caption: backendPost.caption,
    };

    // Transform media posts
    if (backendPost.type === "media" && backendPost.media) {
      return {
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
      } as MediaPost;
    }

    // Transform audio posts
    if (backendPost.type === "audio" && backendPost.audio) {
      console.log("🎵 Transforming audio post:", backendPost);

      return {
        ...basePost,
        type: "audio",
        content: backendPost.audio.map((item) => ({
          title: item.title,
          artist: item.artist,
          coverUrl: item.cover_url || "",
          duration: item.duration || "0:00",
          url: item.file_url,
        })),
      } as AudioPost;
    }

    // Transform MusicXML posts
    if (backendPost.type === "musicxml" && backendPost.musicxml) {
      console.log("📄 Transforming MusicXML post:", backendPost);

      return {
        ...basePost,
        type: "musicxml",
        content: backendPost.musicxml.map((item) => ({
          fileName: item.title,
          composer: item.composer,
          downloadUrl: item.file_url,
        })),
      } as XmlPost;
    }

    // Transform lyrics posts
    if (backendPost.type === "lyrics" && backendPost.lyrics) {
      console.log("📝 Transforming lyrics post:", backendPost);

      return {
        ...basePost,
        type: "lyrics",
        content: {
          title: backendPost.lyrics.title,
          artist: backendPost.lyrics.artist,
          lyricsText: backendPost.lyrics.lyrics_text,
        },
      } as LyricsPost;
    }

    // Unsupported post type
    console.log("⚠️ Unsupported post type:", backendPost.type);
    return null;
  } catch (error) {
    console.error("❌ Error transforming post:", error);
    return null;
  }
};

// Check if user is authenticated
async function checkAuthStatus() {
  try {
    const res = await fetch(`${API_URL}/authorization/me`, {
      method: "GET",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Check if currently listening to this user
async function checkListeningStatus() {
  try {
    console.log("Checking listening status for userId:", userId);
    const res = await fetch(`${API_URL}/profiles/listened`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Not authenticated, treating as guest");
      isGuest.value = true;
      return false;
    }

    const listenedUsers = await res.json();
    console.log("All listened users:", listenedUsers);

    interface ListenedUser {
      id: string;
      name: string;
      login: string;
    }

    const isCurrentlyListening = listenedUsers.some((user: ListenedUser) => {
      return user.id === userId;
    });

    console.log("Currently listening to user:", isCurrentlyListening);
    return isCurrentlyListening;
  } catch (error) {
    console.error("Error checking listening status:", error);
    isGuest.value = true;
    return false;
  }
}

// Fetch user posts with the exact same logic as your working profile
const fetchPosts = async (loadMore = false) => {
  if (!userId) {
    console.error("No userId provided!");
    postsError.value = "No user ID provided";
    return;
  }

  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoadingPosts.value = true;
    offset.value = 0;
  }

  postsError.value = "";

  try {
    const endpoint = `${API_URL}/posts/user/${userId}?limit=${limit}&offset=${offset.value}`;
    console.log("Fetching posts from:", endpoint);

    const response = await fetch(endpoint, {
      credentials: "include",
    });

    console.log("Posts API response status:", response.status);
    console.log("Posts API response ok:", response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts: BackendPost[] = await response.json();
    console.log("Fetched backend posts:", backendPosts);

    // Transform backend posts using the same logic as your working profile
    const transformedPosts = backendPosts
      .map(transformBackendPost)
      .filter(Boolean) as FeedPost[];

    console.log("Transformed posts:", transformedPosts);

    if (loadMore) {
      posts.value.push(...transformedPosts);
    } else {
      posts.value = transformedPosts;
    }

    hasMore.value = backendPosts.length === limit;
    offset.value += backendPosts.length;

    console.log(
      `Loaded ${transformedPosts.length} posts. Total: ${posts.value.length}, HasMore: ${hasMore.value}`,
    );
  } catch (err) {
    console.error("Error fetching posts:", err);
    postsError.value =
      err instanceof Error ? err.message : "Failed to load posts";

    if (!loadMore) {
      posts.value = [];
    }
  } finally {
    isLoadingPosts.value = false;
    isLoadingMore.value = false;
  }
};

// Post functions
const handleLoadMore = () => {
  if (!isLoadingMore.value && hasMore.value) {
    fetchPosts(true);
  }
};

const handleRetry = () => {
  fetchPosts();
};

// Function to refresh listening status (exposed to parent)
const refreshListeningStatus = async () => {
  console.log("Refreshing listening status...");
  try {
    const newStatus = await checkListeningStatus();
    isListening.value = false;
    await nextTick();
    isListening.value = newStatus;
    console.log("Updated listening status:", isListening.value);
  } catch (error) {
    console.error("Error refreshing listening status:", error);
  }
};

// Toggle listen/unlisten
async function toggleListen() {
  const isAuthenticated = await checkAuthStatus();

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to sign-in");
    router.push("/sign-in");
    return;
  }

  if (isLoading.value) return;

  isLoading.value = true;

  try {
    const method = isListening.value ? "DELETE" : "POST";
    const url = `${API_URL}/profiles/listening/${userId}`;

    console.log(`${method} ${url}`);

    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);

      if (response.status === 401) {
        router.push("/sign-in");
        return;
      }

      if (response.status === 403) {
        alert(
          "Cannot listen to this user because either you have blocked them or they have blocked you.",
        );
        return;
      }

      throw new Error(errorData.detail || "Failed to update listening status");
    }

    isListening.value = !isListening.value;
    const result = await response.json();
    console.log("Success:", result.message);
    emit("stats-updated");
  } catch (error) {
    console.error("Error toggling listen:", error);
    alert("Failed to update listening status. Please try again.");
  } finally {
    isLoading.value = false;
  }
}

// Initialize component
onMounted(async () => {
  console.log("AnotherPersonContent mounted for userId:", userId);

  if (!userId) {
    console.error("No userId provided!");
    postsError.value = "No user ID provided";
    return;
  }

  // Check current listening status
  isListening.value = await checkListeningStatus();

  // Fetch user posts
  await fetchPosts();

  console.log("Initial listening status:", isListening.value);
  console.log("Is guest:", isGuest.value);
  console.log("Posts loaded:", posts.value.length);
});

// Expose the refresh function to parent component
defineExpose({
  refreshListeningStatus,
});
</script>

<style scoped>
/* Ignore any external margin from parent containers */
section {
  margin: 0 !important;
}

section .max-w {
  max-width: 640px;
}

.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
