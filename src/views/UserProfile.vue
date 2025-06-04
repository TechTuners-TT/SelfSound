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
            <!-- Loading state -->
            <div
              v-if="isLoading && !user.id"
              class="flex justify-center items-center min-h-[400px]"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
              ></div>
            </div>

            <!-- Profile sections (only show when user data is loaded) -->
            <template v-else>
              <!-- Section 1 - Profile Header -->
              <section
                class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
              >
                <ProfileHeader :user="displayUser" :stats="stats" />
              </section>

              <!-- Section 2 - Profile Content (includes edit modal and posts) -->
              <section>
                <ProfileContent :user="displayUser" @update:user="updateUser" />
              </section>

              <!-- Posts Feed Section -->
              <section class="mt-4">
                <div
                  class="w-full h-px border border-[rgba(255,255,255,0.5)]"
                ></div>

                <!-- Posts Feed -->
                <div class="mt-4">
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
                  <div
                    v-if="postsError"
                    class="text-red-400 text-center py-4 mb-4"
                  >
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
                    <p class="text-sm">Be the first to share something!</p>
                  </div>

                  <!-- Posts -->
                  <PostCard v-for="post in posts" :key="post.id" :post="post" />

                  <!-- Load More Button -->
                  <div
                    v-if="hasMore && posts.length > 0"
                    class="text-center mt-8 pb-8"
                  >
                    <button
                      @click="handleLoadMore"
                      :disabled="isLoadingMore"
                      class="bg-[#6D01D0] hover:bg-[#5a0ba8] disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {{ isLoadingMore ? "Loading..." : "Load More" }}
                    </button>
                  </div>
                </div>
              </section>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
import ProfileContent from "@/components/userProfile/ProfileContent.vue";
import PostCard from "@/components/Posts_Feed_Components/PostCard.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id?: string;
  name: string;
  login: string;
  avatarUrl: string;
  biography: string;
  tag?: string | null;
}

interface Stats {
  posts: number;
  listeners: number;
  listenedTo: number;
}

// Backend post interface for transformation
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

// Post interfaces from PostFeed.vue
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

// Map UUIDs to tag names (for display)
const tagMap: Record<string, string> = {
  "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
  "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
  "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
};

// Map tag names to UUIDs (for backend)
const reverseTagMap: Record<string, string> = {
  Listener: "146fb41a-2f3e-48c7-bef9-01de0279dfd7",
  Musician: "b361c6f9-9425-4548-8c07-cb408140c304",
  Learner: "5ee121a6-b467-4ead-b3f7-00e1ce6097d5",
};

// Helper function to truncate name to 15 characters
const truncateName = (name: string): string => {
  if (!name) return "";
  return name.length > 15 ? name.substring(0, 15) : name;
};

// Reactive user and stats state
const user = reactive<User>({
  id: undefined,
  name: "",
  login: "",
  avatarUrl:
    "https://cdn.builder.io/api/v1/image/assets/TEMP/3922534bd59dfe0deae8bd149c0b3cba46e3eb47?placeholderIfAbsent=true&apiKey=04fef95365634cc5973c2029f1fc78f5",
  biography: "",
  tag: null,
});

// Computed property to handle tag display for components
const displayUser = computed(() => ({
  ...user,
  tag: user.tag && tagMap[user.tag] ? tagMap[user.tag] : "Add tag",
}));

const stats = reactive<Stats>({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

// Loading states
const isLoading = ref(false);
const isLoadingPosts = ref(false);
const isLoadingMore = ref(false);
const postsError = ref("");
const posts = ref<FeedPost[]>([]);
const hasMore = ref(true);
const limit = 10;
const offset = ref(0);

// Enhanced fetch functions with mobile authentication support
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // Get token from storage (mobile-first approach)
  const token = localStorage.getItem('authToken') || 
               sessionStorage.getItem('authToken') || 
               localStorage.getItem('auth_backup');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('📱 Using Authorization header for API call');
  } else {
    console.log('🍪 No token found, relying on cookies');
  }
  
  return headers;
};

// Post transformation functions
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

    return null;
  } catch (error) {
    console.error("❌ Error transforming post:", error);
    return null;
  }
};

// FIXED: Fetch user stats with proper authentication and endpoint
const fetchUserStats = async () => {
  try {
    if (!user.id) {
      console.warn("No user ID available for stats");
      return;
    }

    console.log("🔍 Fetching user stats for user:", user.id);
    
    // FIXED: Use the correct endpoint that matches your backend
    const response = await fetch(`${API_URL}/profile/${user.id}/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include", // Keep for cookie fallback
    });

    if (!response.ok) {
      console.error(`Stats API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ User stats loaded:", data);

    // Your API returns exactly these field names
    stats.posts = data.posts ?? 0;
    stats.listeners = data.listeners ?? 0;
    stats.listenedTo = data.listenedTo ?? 0;

    console.log("📊 Final stats:", {
      posts: stats.posts,
      listeners: stats.listeners,
      listenedTo: stats.listenedTo,
    });
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    // Set default values on error but don't reset if we already have values
    if (stats.posts === 0 && stats.listeners === 0 && stats.listenedTo === 0) {
      stats.posts = 0;
      stats.listeners = 0;
      stats.listenedTo = 0;
    }
  }
};

// FIXED: Fetch posts with proper authentication
const fetchPosts = async (loadMore = false) => {
  if (!user.id) return;

  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoadingPosts.value = true;
    offset.value = 0;
  }

  postsError.value = "";

  try {
    const endpoint = `${API_URL}/posts/user/${user.id}?limit=${limit}&offset=${offset.value}`;
    console.log("Fetching posts from:", endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include", // Keep for cookie fallback
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts: BackendPost[] = await response.json();
    console.log("Fetched backend posts:", backendPosts);

    const transformedPosts = backendPosts
      .map(transformBackendPost)
      .filter(Boolean) as FeedPost[];

    if (loadMore) {
      posts.value.push(...transformedPosts);
    } else {
      posts.value = transformedPosts;
    }

    hasMore.value = backendPosts.length === limit;
    offset.value += backendPosts.length;

    // Update posts count in stats
    if (!loadMore) {
      stats.posts = backendPosts.length;
    }
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

// FIXED: Load user profile with proper authentication
const loadUserProfile = async () => {
  isLoading.value = true;

  try {
    console.log("🔍 Loading user profile...");
    
    const response = await fetch(`${API_URL}/profile/me/profile`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        "Cache-Control": "no-cache"
      },
      credentials: "include", // Keep for cookie fallback
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch profile: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ User profile loaded:", data);

    if (data && data.id) {
      // Update user reactive object with name truncation
      Object.assign(user, {
        id: data.id,
        name: truncateName(data.name || ""), // Apply name truncation here
        login: data.login || "",
        biography: data.description || "",
        avatarUrl: data.avatar_url || user.avatarUrl, // Keep default if no avatar
        tag: data.tag_id || null,
      });

      console.log("👤 User object updated:", user);

      // If the name was truncated, automatically update it on the backend
      if (data.name && data.name.length > 15) {
        console.log(
          "🔄 Name was too long, updating backend with truncated name...",
        );
        try {
          await fetch(`${API_URL}/profile/me`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({
              name: user.name, // Send truncated name
            }),
          });
          console.log("✅ Backend updated with truncated name");
        } catch (error) {
          console.error(
            "❌ Failed to update backend with truncated name:",
            error,
          );
        }
      }

      // Load user stats and posts after profile is loaded
      // Make sure to wait for stats before loading posts
      await fetchUserStats();
      await fetchPosts();
    }
  } catch (err) {
    console.error("❌ Error loading user profile:", err);
  } finally {
    isLoading.value = false;
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

// Update user function (called by ProfileContent component) - ENHANCED WITH NAME TRUNCATION
const updateUser = async (updatedUser: User) => {
  console.log("🔄 Updating user:", updatedUser);

  // Update the reactive user object with name truncation
  user.name = truncateName(updatedUser.name);
  user.login = updatedUser.login;
  user.biography = updatedUser.biography;
  user.avatarUrl = updatedUser.avatarUrl;

  // Handle tag conversion from display name to UUID
  if (updatedUser.tag && updatedUser.tag !== "Add tag") {
    user.tag = reverseTagMap[updatedUser.tag] || updatedUser.tag;
  } else {
    user.tag = null;
  }

  console.log("👤 User updated to:", user);

  // Refresh stats and posts after profile update
  await fetchUserStats();
  await fetchPosts();
};

// Add this debug function to test authentication
const testAuthentication = async () => {
  try {
    console.log("🔍 Testing authentication...");
    
    const response = await fetch(`${API_URL}/profile/debug/auth-info`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const debugInfo = await response.json();
    console.log("🔍 Auth Debug Info:", debugInfo);
    
    return debugInfo;
  } catch (error) {
    console.error("❌ Auth test failed:", error);
    return null;
  }
};

// Load profile on component mount
onMounted(() => {
  loadUserProfile();
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
