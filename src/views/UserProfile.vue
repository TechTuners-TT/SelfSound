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

            <!-- Edit Profile Section -->
            <section
              class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
            >
              <button
                class="cursor-pointer w-full h-8 text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] text-white rounded-[5px] shadow-sm mx-auto block inter-font"
                style="
                  background-color: rgba(0, 12, 156, 0.4);
                  font-weight: 500;
                "
                @click="openEditModal"
              >
                Edit profile
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
          </div>
        </div>
      </div>
    </main>

    <!-- Modal for editing profile -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-[#060310] border border-white/50 rounded-xl p-6 w-full max-w-md text-white"
      >
        <h2 class="text-2xl mb-4">Edit Profile</h2>

        <!-- Error message display -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-600 text-white rounded">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="saveChanges" class="flex flex-col gap-4">
          <input
            v-model="formData.name"
            type="text"
            placeholder="Name"
            class="input input-bordered bg-[#222] border-gray-600 p-2 rounded"
            required
          />
          <input
            v-model="formData.login"
            type="text"
            placeholder="Login"
            class="input input-bordered bg-[#222] border-gray-600 p-2 rounded"
            required
          />

          <!-- Avatar upload input and preview -->
          <div>
            <label class="block mb-1">Avatar:</label>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="file-input file-input-bordered file-input-sm w-full max-w-xs bg-[#222] border-gray-600 rounded"
            />
          </div>

          <div v-if="formData.avatarPreview" class="mt-2 mb-2">
            <img
              :src="formData.avatarPreview"
              alt="Avatar Preview"
              class="w-24 h-24 rounded-full object-cover border border-gray-600"
            />
          </div>

          <textarea
            v-model="formData.biography"
            placeholder="Biography"
            rows="4"
            class="textarea textarea-bordered bg-[#222] border-gray-600 resize-none p-2 rounded"
          ></textarea>

          <div>
            <label class="block mb-1">Tag:</label>
            <select
              v-model="formData.selectedTag"
              class="select select-bordered bg-[#222] border-gray-600 w-full p-2 rounded"
            >
              <option value="Add tag">Add tag</option>
              <option value="Listener">Listener</option>
              <option value="Musician">Musician</option>
              <option value="Learner">Learner</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-sm"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Saving..." : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, computed } from "vue";
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

// Form data for editing
const formData = reactive({
  name: "",
  login: "",
  avatarFile: null as File | null,
  avatarPreview: "",
  biography: "",
  selectedTag: "Add tag",
});

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

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

// Fetch posts from backend
const fetchPosts = async (loadMore = false) => {
  if (!user.id) return;

  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
    offset.value = 0;
  }

  error.value = "";

  try {
    const endpoint = `${API_URL}/posts/user/${user.id}?limit=${limit}&offset=${offset.value}`;
    console.log("Fetching posts from:", endpoint);

    const response = await fetch(endpoint, {
      credentials: "include",
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

// Profile functions
const openEditModal = () => {
  isModalOpen.value = true;
  errorMessage.value = "";
  formData.name = user.name || "";
  formData.login = user.login || "";
  formData.biography = user.biography || "";
  formData.selectedTag =
    user.tag && tagMap[user.tag] ? tagMap[user.tag] : "Add tag";
  formData.avatarFile = null;
  formData.avatarPreview = user.avatarUrl || "";
};

const closeModal = () => {
  isModalOpen.value = false;
  errorMessage.value = "";
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files[0]) {
    formData.avatarFile = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(files[0]);
  } else {
    formData.avatarFile = null;
    formData.avatarPreview = user.avatarUrl || "";
  }
};

const uploadAvatar = async (): Promise<string | null> => {
  if (!formData.avatarFile) return null;

  const data = new FormData();
  data.append("avatar", formData.avatarFile);

  const res = await fetch(`${API_URL}/profile/me/avatar`, {
    method: "PATCH",
    credentials: "include",
    body: data,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Avatar upload failed");
  }

  const json = await res.json();
  return json.avatar_url;
};

const fetchUserStats = async () => {
  try {
    if (!user.id) return;

    const res = await fetch(`${API_URL}/profile/me/stats`, {
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

const saveChanges = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const tag_id =
      formData.selectedTag === "Add tag"
        ? null
        : reverseTagMap[formData.selectedTag];

    const profilePayload = {
      name: formData.name,
      login: formData.login,
      description: formData.biography,
      tag_id,
    };

    const resProfile = await fetch(`${API_URL}/profile/me`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profilePayload),
    });

    if (!resProfile.ok) {
      const err = await resProfile.json();
      throw new Error(err.detail || "Profile update failed");
    }

    if (formData.avatarFile) {
      await uploadAvatar();
    }

    closeModal();
    window.location.reload();
  } catch (error: unknown) {
    console.error("Error in saveChanges:", error);
    let msg = "Unknown error occurred";
    if (error instanceof Error) {
      msg = error.message;
    }
    errorMessage.value = msg;
  } finally {
    isSubmitting.value = false;
  }
};

const loadUserProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/profile/me/profile`, {
      credentials: "include",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch profile: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();

    if (data && data.id) {
      Object.assign(user, {
        id: data.id,
        name: data.name || "",
        login: data.login || "",
        biography: data.description || "",
        avatarUrl: data.avatar_url || "",
        tag: data.tag_id || null,
      });

      await fetchUserStats();
      await fetchPosts();
    }
  } catch (err) {
    console.error("Error loading user profile:", err);
    errorMessage.value = "Failed to load user profile";
  }
};

// Watch user changes to sync form data
watch(
  () => user,
  (newUser) => {
    formData.name = newUser.name || "";
    formData.login = newUser.login || "";
    formData.biography = newUser.biography || "";
    formData.selectedTag =
      newUser.tag && tagMap[newUser.tag] ? tagMap[newUser.tag] : "Add tag";
    formData.avatarPreview = newUser.avatarUrl || "";
    formData.avatarFile = null;
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  loadUserProfile();
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
