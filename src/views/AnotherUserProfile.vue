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
              v-if="user.id"
              class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
            >
              <AnotherProfileHeader
                :user="user"
                :stats="stats"
                @stats-updated="handleStatsUpdate"
              />
            </section>

            <!-- Profile Content Section -->
            <section v-if="user.id">
              <AnotherProfileContent
                ref="contentRef"
                @stats-updated="handleStatsUpdate"
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/Navigation/NavBar.vue";
import AnotherProfileHeader from "@/components/AnotherUserProfile/AnotherProfileHeader.vue";
import AnotherProfileContent from "@/components/AnotherUserProfile/AnotherProfileContent.vue";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const userId = route.params.userId as string;
const contentRef = ref();

interface User {
  id: string;
  name: string;
  login: string;
  avatarUrl: string;
  biography: string;
  tag?: string;
  role?: string; // Add role field
}

interface Stats {
  posts: number;
  listeners: number;
  listenedTo: number;
}

const user = reactive<User>({
  id: userId || "", // Initialize with userId from route
  name: "",
  login: "",
  avatarUrl: "",
  biography: "",
  tag: "Add tag",
  role: "",
});

const stats = reactive<Stats>({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

// Role mapping function - matches the one in your working ProfileContent
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return roleMap[role] || "Add tag";
};

// Alternative: Get role from tag_id if that's what your API uses
const getTagDisplayName = (tagId: string): string => {
  const tagMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };
  return tagMap[tagId] || "Add tag";
};

async function fetchUserProfile(id: string) {
  try {
    console.log(`Fetching profile for user: ${id}`);
    const res = await fetch(`${API_URL}/profiles/${id}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch user profile: ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Profile data received:", data);

    // Assign user data with proper fallbacks
    user.id = data.id || id;
    user.name = data.name || "Unknown User";
    user.login = data.login || "";
    user.avatarUrl = data.avatar_url || "";
    user.biography = data.description || data.biography || "";

    // Handle role/tag mapping - check multiple possible fields
    let displayTag = "Add tag";

    if (data.role) {
      console.log("Found role:", data.role);
      displayTag = getRoleDisplayName(data.role);
      user.role = data.role;
    } else if (data.tag_id) {
      console.log("Found tag_id:", data.tag_id);
      displayTag = getTagDisplayName(data.tag_id);
      user.role = data.tag_id;
    } else if (data.tag) {
      console.log("Found tag:", data.tag);
      // If tag is already a display name, use it directly
      if (["Listener", "Musician", "Learner"].includes(data.tag)) {
        displayTag = data.tag;
      } else {
        displayTag = getTagDisplayName(data.tag);
      }
      user.role = data.tag;
    }

    user.tag = displayTag;

    console.log("Final user data:", {
      id: user.id,
      name: user.name,
      login: user.login,
      tag: user.tag,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Ensure user still has valid id even on error
    if (!user.id) {
      user.id = id;
    }
  }
}

async function fetchUserStats(id: string) {
  try {
    console.log(`Fetching stats for user: ${id}`);
    const res = await fetch(`${API_URL}/profiles/${id}/stats`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch user stats: ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Stats data received:", data);

    stats.posts = data.posts ?? 0;
    stats.listeners = data.listeners ?? 0;
    stats.listenedTo = data.listenedTo ?? data.listened_to ?? 0; // Handle both snake_case and camelCase
  } catch (error) {
    console.error("Error fetching user stats:", error);
  }
}

// Handle stats updates from child components
const handleStatsUpdate = async () => {
  console.log("Stats update requested");
  await fetchUserStats(userId);

  // Also refresh content component's listening status
  if (contentRef.value && contentRef.value.refreshListeningStatus) {
    await contentRef.value.refreshListeningStatus();
  }
};

onMounted(async () => {
  console.log("Viewing profile of user:", userId);

  if (!userId) {
    console.error("No userId provided");
    return;
  }

  await fetchUserProfile(userId);
  await fetchUserStats(userId);
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
