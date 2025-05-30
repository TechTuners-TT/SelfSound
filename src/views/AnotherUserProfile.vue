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
            <!-- Profile Header Section -->
            <section
              class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
            >
              <ProfileHeader :user="displayUser" :stats="stats" />
            </section>

            <!-- Listen/Unlisten Button Section -->
            <section
              class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
            >
              <button
                @click="toggleListening"
                :disabled="isTogglingListening"
                :class="[
                  'cursor-pointer w-full h-8 text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] text-white rounded-[5px] shadow-sm mx-auto block inter-font transition-all duration-200',
                  isListening
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[rgba(0,12,156,0.4)] hover:bg-[rgba(0,12,156,0.6)]',
                  isTogglingListening ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                style="font-weight: 500"
              >
                {{
                  isTogglingListening
                    ? "Loading..."
                    : isListening
                      ? "Unlisten"
                      : "Listen"
                }}
              </button>
            </section>

            <!-- Posts Feed Section -->
            <section>
              <div
                class="w-full h-px border border-[rgba(255,255,255,0.5)]"
              ></div>

              <!-- Posts Feed -->
              <div class="mt-4">
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
                  <p class="text-sm">This user hasn't shared anything yet!</p>
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
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/Navigation/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
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

// Backend post interfaces for proper typing
interface BackendUser {
  id: string;
  login: string;
  name: string;
  tag_id: string | null;
  avatar_url: string;
}

interface BackendMediaItem {
  id: string;
  file_url: string;
  file_type: "image" | "video";
}

interface BackendAudioItem {
  title: string;
  artist: string;
  cover_url?: string;
  duration?: string;
  file_url: string;
}

interface BackendMusicXMLItem {
  title: string;
  composer: string;
  file_url: string;
}

interface BackendLyricsItem {
  title: string;
  artist: string;
  lyrics_text: string;
}

interface BackendPost {
  id: string;
  user: BackendUser;
  created_at: string;
  type: "media" | "audio" | "musicxml" | "lyrics";
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  caption?: string;
  media?: BackendMediaItem[];
  audio?: BackendAudioItem[];
  musicxml?: BackendMusicXMLItem[];
  lyrics?: BackendLyricsItem;
}

// Map UUIDs to tag names (for display)
const tagMap: Record<string, string> = {
  "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
  "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
  "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
};

// Get route and userId
const route = useRoute();
const userId = computed(() => route.params.userId as string);

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

// Computed property to handle tag display
const displayUser = computed(() => ({
  ...user,
  tag: user.tag && tagMap[user.tag] ? tagMap[user.tag] : "Add tag",
}));

const stats = reactive<Stats>({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

// Posts state
const posts = ref<FeedPost[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");
const hasMore = ref(true);
const limit = 10;
const offset = ref(0);

// Listen/unlisten state
const isListening = ref(false);
const isTogglingListening = ref(false);

// Post transformation functions (from PostFeed.vue)
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
          items: backendPost.media.map((item: BackendMediaItem) => ({
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
        content: backendPost.audio.map((item: BackendAudioItem) => ({
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
        content: backendPost.musicxml.map((item: BackendMusicXMLItem) => ({
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

// Fetch posts from backend
const fetchPosts = async (loadMore = false) => {
  if (!userId.value) return;

  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = "";

  try {
    const endpoint = `${API_URL}/posts/user/${userId.value}?limit=${limit}&offset=${offset.value}`;
    console.log("Fetching posts from:", endpoint);

    const response = await fetch(endpoint, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts = (await response.json()) as BackendPost[];
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
  } catch (err) {
    console.error("Error fetching posts:", err);
    error.value = err instanceof Error ? err.message : "Failed to load posts";

    if (!loadMore) {
      posts.value = [];
    }
  } finally {
    isLoading.value = false;
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

// Check if current user is listening to this profile
const checkListeningStatus = async () => {
  if (!userId.value) return;

  try {
    const response = await fetch(
      `${API_URL}/profiles/${userId.value}/listening-status`,
      {
        credentials: "include",
      },
    );

    if (response.ok) {
      const data = await response.json();
      isListening.value = data.is_listening || false;
    }
  } catch (error) {
    console.error("Error checking listening status:", error);
  }
};

// Toggle listen/unlisten
const toggleListening = async () => {
  if (!userId.value || isTogglingListening.value) return;

  isTogglingListening.value = true;

  try {
    const endpoint = isListening.value
      ? `${API_URL}/profiles/${userId.value}/unlisten`
      : `${API_URL}/profiles/${userId.value}/listen`;

    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle listening status");
    }

    const result = await response.json();
    isListening.value = result.is_listening;

    // Update stats
    await fetchUserStats();
  } catch (error) {
    console.error("Error toggling listening:", error);
  } finally {
    isTogglingListening.value = false;
  }
};

// Fetch user stats
const fetchUserStats = async () => {
  try {
    if (!userId.value) return;

    const res = await fetch(`${API_URL}/profiles/${userId.value}/stats`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user stats: ${res.statusText}`);
    }

    const data = await res.json();
    stats.posts = data.posts ?? 0;
    stats.listeners = data.listeners ?? 0;
    stats.listenedTo = data.listenedTo ?? 0;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    stats.posts = 0;
    stats.listeners = 0;
    stats.listenedTo = 0;
  }
};

// Load user profile
const loadUserProfile = async () => {
  if (!userId.value) return;

  try {
    const res = await fetch(`${API_URL}/profiles/${userId.value}`, {
      credentials: "include",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch profile: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    console.log("Loaded profile data:", data);

    if (data && data.id) {
      Object.assign(user, {
        id: data.id,
        name: data.name || "",
        login: data.login || "",
        biography: data.description || "",
        avatarUrl: data.avatar_url || "",
        tag: data.tag_id || null,
      });

      // Load related data
      await Promise.all([
        fetchUserStats(),
        checkListeningStatus(),
        fetchPosts(),
      ]);
    }
  } catch (err) {
    console.error("Error loading user profile:", err);
    error.value = "Failed to load user profile";
  }
};

// Watch for route changes
watch(
  () => userId.value,
  (newUserId) => {
    if (newUserId) {
      // Reset state
      posts.value = [];
      offset.value = 0;
      hasMore.value = true;
      error.value = "";
      isListening.value = false;

      // Load new user's data
      loadUserProfile();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (userId.value) {
    loadUserProfile();
  }
});
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}

main {
  display: flex;
  justify-content: center;
}
</style>
