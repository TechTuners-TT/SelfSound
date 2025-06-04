<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->
    <main class="flex flex-col flex-grow overflow-auto">
      <!-- Nav Bar -->
      <NavBar />

      <!-- Content -->
      <div class="flex-grow max-h-full">
        <div class="relative flex items-start justify-center w-full h-full">
          <div
            class="gap-[20px] sm:gap-[20px] md:gap-[25px] lg:gap-[30px] xl:gap-[35px] 2xl:gap-10 relative w-full md:w-3/5 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
          >
            <!-- Page Header -->
            <section class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px] pt-8">
              <h1 class="text-white text-2xl font-bold inter-font mb-4">
                Listened To Feed
              </h1>
              <p class="text-gray-300 text-sm inter-font">
                Posts from users you're listening to
              </p>
            </section>

            <!-- Divider -->
            <div class="w-full h-px border border-[rgba(255,255,255,0.5)]"></div>

            <!-- Feed Content -->
            <section class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]">
              <!-- Loading State -->
              <div
                v-if="isLoading && posts.length === 0"
                class="text-white text-center py-8"
              >
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D01D0] mx-auto mb-4"
                ></div>
                Loading listened to feed...
              </div>

              <!-- Error State -->
              <div
                v-if="error"
                class="text-red-400 text-center py-4 mb-4"
              >
                {{ error }}
                <button
                  @click="() => fetchListenedToFeed()"
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
                <p class="text-sm">Follow some users to see their posts here!</p>
              </div>

              <!-- Posts -->
              <div v-if="posts.length > 0" class="space-y-4">
                <PostCard 
                  v-for="post in posts" 
                  :key="post.id" 
                  :post="post" 
                />
              </div>

              <!-- Load More Button -->
              <div
                v-if="hasMore && posts.length > 0"
                class="text-center mt-8 pb-8"
              >
                <button
                  @click="() => loadMore()"
                  :disabled="isLoadingMore"
                  class="bg-[#6D01D0] hover:bg-[#5a0ba8] disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {{ isLoadingMore ? "Loading..." : "Load More" }}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/Navigation/NavBar.vue';
import PostCard from '@/components/Posts_Feed_Components/PostCard.vue';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// 🔥 FIXED: Auth functions (exact copies from UserProfile.vue)
const getAuthToken = () => {
  // Check localStorage first
  let token = localStorage.getItem('access_token') || 
              localStorage.getItem('authToken') ||
              sessionStorage.getItem('access_token') ||
              sessionStorage.getItem('authToken');
  
  // If no token in storage, try to read from cookies with enhanced method
  if (!token) {
    token = getCookie('access_token');
  }
  
  console.log('🔍 ListenedToFeed token search:', token ? `FOUND: ${token.substring(0, 20)}...` : 'NOT FOUND');
  return token;
};

// Enhanced cookie reading function
const getCookie = (name: string): string | null => {
  try {
    // Method 1: Standard approach
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || null;
      if (cookieValue) {
        console.log(`🍪 ListenedToFeed found cookie ${name}:`, cookieValue.substring(0, 20) + '...');
        return cookieValue;
      }
    }
    
    // Method 2: Direct regex search (better for mobile)
    const regex = new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
      const cookieValue = match[2];
      console.log(`🍪 ListenedToFeed found cookie via regex ${name}:`, cookieValue.substring(0, 20) + '...');
      return cookieValue;
    }
    
    console.log(`🍪 ListenedToFeed cookie ${name} not found`);
    return null;
  } catch (error) {
    console.error('❌ ListenedToFeed error reading cookie:', error);
    return null;
  }
};

// Enhanced auth headers function
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 ListenedToFeed using Authorization header:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ ListenedToFeed no token found for authenticated request');
  }
  
  return headers;
};

// Post interface (using same structure as other components)
interface Post {
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
  content: any;
}

// Reactive state
const posts = ref<Post[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref('');
const hasMore = ref(true);
const limit = 10;
const offset = ref(0);

// Map UUIDs to tag names
const tagMap: Record<string, string> = {
  "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
  "b361c6f9-9425-4548-8c07-cb408140c304": "Musician", 
  "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
};

// Helper functions
const mapUserRole = (tagId: string | null): "Musician" | "Listener" | "Learner" => {
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

// Transform backend post to frontend format
const transformBackendPost = (backendPost: any): Post | null => {
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

    // Transform different post types
    if (backendPost.type === "media" && backendPost.media) {
      return {
        ...basePost,
        type: "media",
        content: {
          mediaType: "media",
          items: backendPost.media.map((item: any) => ({
            id: item.id,
            src: item.file_url,
            type: item.file_type === "image" ? "image" : "video",
          })),
        },
      };
    }

    if (backendPost.type === "audio" && backendPost.audio) {
      return {
        ...basePost,
        type: "audio",
        content: backendPost.audio.map((item: any) => ({
          title: item.title,
          artist: item.artist,
          coverUrl: item.cover_url || "",
          duration: item.duration || "0:00",
          url: item.file_url,
        })),
      };
    }

    if (backendPost.type === "musicxml" && backendPost.musicxml) {
      return {
        ...basePost,
        type: "musicxml",
        content: backendPost.musicxml.map((item: any) => ({
          fileName: item.title,
          composer: item.composer,
          downloadUrl: item.file_url,
        })),
      };
    }

    if (backendPost.type === "lyrics" && backendPost.lyrics) {
      return {
        ...basePost,
        type: "lyrics",
        content: {
          title: backendPost.lyrics.title,
          artist: backendPost.lyrics.artist,
          lyricsText: backendPost.lyrics.lyrics_text,
        },
      };
    }

    return null;
  } catch (error) {
    console.error("❌ Error transforming post:", error);
    return null;
  }
};

// 🔥 FIXED: Fetch listened to feed with proper authentication
const fetchListenedToFeed = async (loadMore = false) => {
  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = '';

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in.');
    }

    // Endpoint for posts from users you're listening to
    const endpoint = `${API_URL}/posts/feed/listened-to?limit=${limit}&offset=${offset.value}`;
    console.log("🚀 Fetching listened to feed from:", endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include",
    });

    // Handle 401 responses with token cleanup
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('authToken');
      throw new Error('Session expired. Please sign in again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts = await response.json();
    console.log("✅ Fetched listened to posts:", backendPosts.length, "posts");

    const transformedPosts = backendPosts
      .map(transformBackendPost)
      .filter(Boolean) as Post[];

    if (loadMore) {
      posts.value.push(...transformedPosts);
    } else {
      posts.value = transformedPosts;
    }

    hasMore.value = backendPosts.length === limit;
    offset.value += backendPosts.length;

  } catch (err) {
    console.error("❌ Error fetching listened to feed:", err);
    error.value = err instanceof Error ? err.message : "Failed to load feed";

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
  if (!isLoadingMore.value && hasMore.value) {
    fetchListenedToFeed(true);
  }
};

// Load feed on component mount
onMounted(() => {
  fetchListenedToFeed();
});
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}

/* Center the content container */
main {
  display: flex;
  justify-content: center;
}
</style>
