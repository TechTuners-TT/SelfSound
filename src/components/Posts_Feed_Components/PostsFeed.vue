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
      Loading posts...
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

    <!-- Empty State -->
    <div
      v-if="!isLoading && !error && posts.length === 0"
      class="text-gray-400 text-center py-8"
    >
      <p class="text-lg mb-2">No posts yet</p>
      <p class="text-sm">Be the first to share something!</p>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PostCard from "@/components/Posts_Feed_Components/PostCard.vue";

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

// Keep your existing interfaces - they're perfect!
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

// Props for filtering posts by user
const props = defineProps<{
  userId?: string; // If provided, fetch posts for specific user only
}>();

const posts = ref<FeedPost[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");
const hasMore = ref(true);
const limit = 10;
const offset = ref(0);

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

// Transform backend post to your format - FIXED with proper type conversion
const transformBackendPost = (backendPost: BackendPost): FeedPost | null => {
  try {
    console.log("🔍 PostFeed - Raw backend post:", backendPost);
    console.log(
      "🔍 PostFeed - Raw likes_count:",
      backendPost.likes_count,
      typeof backendPost.likes_count,
    );
    console.log(
      "🔍 PostFeed - Raw user_liked:",
      backendPost.user_liked,
      typeof backendPost.user_liked,
    );

    const basePost = {
      id: backendPost.id,
      userId: backendPost.user.id,
      username: backendPost.user.login,
      displayName: backendPost.user.name,
      role: mapUserRole(backendPost.user.tag_id),
      avatarUrl: backendPost.user.avatar_url || "",
      timestamp: formatTimestamp(backendPost.created_at),
      // FIXED: Ensure proper data types with explicit conversion
      likes_count: Number(backendPost.likes_count) || 0,
      comments_count: Number(backendPost.comments_count) || 0,
      user_liked: Boolean(backendPost.user_liked),
      caption: backendPost.caption,
    };

    console.log(
      "🔍 PostFeed - Transformed likes_count:",
      basePost.likes_count,
      typeof basePost.likes_count,
    );
    console.log(
      "🔍 PostFeed - Transformed user_liked:",
      basePost.user_liked,
      typeof basePost.user_liked,
    );

    // Transform media posts
    if (backendPost.type === "media" && backendPost.media) {
      const finalPost = {
        ...basePost,
        type: "media" as const,
        content: {
          mediaType: "media" as const,
          items: backendPost.media.map((item) => ({
            id: item.id,
            src: item.file_url,
            type:
              item.file_type === "image"
                ? ("image" as const)
                : ("video" as const),
          })),
        },
      } as MediaPost;

      console.log("🔍 PostFeed - Final media post:", finalPost);
      return finalPost;
    }

    // Transform audio posts
    if (backendPost.type === "audio" && backendPost.audio) {
      console.log("🎵 Transforming audio post:", backendPost);

      const finalPost = {
        ...basePost,
        type: "audio" as const,
        content: backendPost.audio.map((item) => ({
          title: item.title,
          artist: item.artist,
          coverUrl: item.cover_url || "", // Cover image URL from backend
          duration: item.duration || "0:00", // Duration from backend
          url: item.file_url, // Audio file URL
        })),
      } as AudioPost;

      console.log("🔍 PostFeed - Final audio post:", finalPost);
      return finalPost;
    }

    // Transform MusicXML posts
    if (backendPost.type === "musicxml" && backendPost.musicxml) {
      console.log("📄 Transforming MusicXML post:", backendPost);

      const finalPost = {
        ...basePost,
        type: "musicxml" as const,
        content: backendPost.musicxml.map((item) => ({
          fileName: item.title, // Use title as fileName for display
          composer: item.composer,
          downloadUrl: item.file_url, // Direct download URL
        })),
      } as XmlPost;

      console.log("🔍 PostFeed - Final musicxml post:", finalPost);
      return finalPost;
    }

    // Transform lyrics posts
    if (backendPost.type === "lyrics" && backendPost.lyrics) {
      console.log("📝 Transforming lyrics post:", backendPost);

      const finalPost = {
        ...basePost,
        type: "lyrics" as const,
        content: {
          title: backendPost.lyrics.title,
          artist: backendPost.lyrics.artist,
          lyricsText: backendPost.lyrics.lyrics_text,
        },
      } as LyricsPost;

      console.log("🔍 PostFeed - Final lyrics post:", finalPost);
      return finalPost;
    }

    // Unsupported post type
    console.log("⚠️ Unsupported post type:", backendPost.type);
    return null;
  } catch (error) {
    console.error("❌ Error transforming post:", error);
    return null;
  }
};

// Fetch posts from backend
const fetchPosts = async (loadMore = false) => {
  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = "";

  try {
    // Fetch real posts from backend
    const endpoint = props.userId
      ? `${API_URL}/posts/user/${props.userId}?limit=${limit}&offset=${offset.value}`
      : `${API_URL}/posts/feed?limit=${limit}&offset=${offset.value}`;

    console.log("Fetching posts from:", endpoint);

    const response = await fetch(endpoint, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts: BackendPost[] = await response.json();
    console.log("Fetched backend posts:", backendPosts);

    // Transform backend posts (only real data, no mock data)
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
  } catch (err) {
    console.error("Error fetching posts:", err);
    error.value = err instanceof Error ? err.message : "Failed to load posts";

    // Don't fallback to mock data - show error instead
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
  fetchPosts();
});

// Expose refresh function for parent components
defineExpose({
  refresh: () => fetchPosts(),
});
</script>
