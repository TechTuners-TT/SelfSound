<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="isLoading && posts.length === 0"
      class="text-white text-center py-8"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0] mx-auto mb-4"
      ></div>
      Loading posts from users you're listening to...
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-red-400 text-center py-4 mb-4">
      {{ error }}
      <button
        @click="handleRetry"
        class="block mx-auto mt-2 text-[#6D01D0] hover:text-[#8B4CD8]"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State - Not Following Anyone -->
    <div
      v-if="!isLoading && !error && posts.length === 0"
      class="flex flex-col items-center justify-center py-16 px-6"
    >
      <div class="text-gray-400 text-center mb-6">
        <svg
          class="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        <h3 class="text-lg font-semibold mb-2">No posts from followed users</h3>
        <p class="text-sm max-w-sm mx-auto mb-6">
          You're not following anyone yet, or the people you follow haven't
          posted anything. Start following musicians, learners, and listeners to
          see their posts here!
        </p>
      </div>
      <router-link
        to="/search"
        class="bg-[#6D01D0] hover:bg-[#5a0ba8] text-white px-6 py-2 rounded-full font-medium transition-colors"
      >
        Discover Users
      </router-link>
    </div>

    <!-- Posts -->
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

    <!-- End of Feed Message -->
    <div
      v-if="!hasMore && posts.length > 0"
      class="text-center py-6 text-gray-400 text-sm"
    >
      You've reached the end of your listened to feed
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PostCard from "./PostCard.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Backend post interface for API responses
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

// Use the same interfaces as your PostFeed component
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

const posts = ref<FeedPost[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");
const hasMore = ref(true);
const limit = 10;
const offset = ref(0);

// Copy the same utility functions from your PostFeed component
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

// Copy the same transformation logic from your PostFeed
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

    console.log("⚠️ Unsupported post type:", backendPost.type);
    return null;
  } catch (error) {
    console.error("❌ Error transforming post:", error);
    return null;
  }
};

// Fetch posts from the listened-to endpoint
const fetchPosts = async (loadMore = false) => {
  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = "";

  try {
    // THE KEY DIFFERENCE: Use the listened-to endpoint
    const endpoint = `${API_URL}/posts/feed/listened-to?limit=${limit}&offset=${offset.value}`;

    console.log("🎯 Fetching listened-to posts from:", endpoint);

    const response = await fetch(endpoint, {
      credentials: "include",
    });

    if (response.status === 401) {
      // User is not authenticated
      error.value = "Authentication required. Please sign in.";
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts: BackendPost[] = await response.json();
    console.log("Fetched listened-to posts:", backendPosts);

    // Transform backend posts
    const transformedPosts = backendPosts
      .map(transformBackendPost)
      .filter(Boolean) as FeedPost[];

    console.log("Transformed listened-to posts:", transformedPosts);

    if (loadMore) {
      posts.value.push(...transformedPosts);
    } else {
      posts.value = transformedPosts;
    }

    hasMore.value = backendPosts.length === limit;
    offset.value += backendPosts.length;
  } catch (err) {
    console.error("Error fetching listened-to posts:", err);
    error.value =
      err instanceof Error
        ? err.message
        : "Failed to load posts from followed users";

    if (!loadMore) {
      posts.value = [];
    }
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// Load more posts
const loadMore = () => {
  fetchPosts(true);
};

// Handle load more button click
const handleLoadMore = () => {
  if (!isLoadingMore.value && hasMore.value) {
    loadMore();
  }
};

// Handle retry button click
const handleRetry = () => {
  fetchPosts();
};

onMounted(() => {
  // DEBUG: Confirm this component is loading
  console.log("🚨 ListenedToFeed component mounted!");
  console.log('🚨 This should show "listened-to" endpoint');
  fetchPosts();
});

// Expose refresh function for parent components
defineExpose({
  refresh: () => fetchPosts(),
});
</script>
