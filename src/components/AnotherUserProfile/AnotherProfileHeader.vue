<template>
  <div
    class="mb-[10px] flex gap-10 iteam-centere mt-10 sm:gap-15 md:gap-[46px] lg:gap-[76px] xl:gap-[56px] [@media(min-width:1537px)]:gap-[76px] sm:mb-[12px] md:mb-[14px] lg:mb-[16px] xl:mb-[18px] [@media(min-width:1537px)]:mb-[20px]"
  >
    <div
      class="relative w-[84px] h-[84px] max-sm:w-[60px] max-sm:h-[60px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] lg:w-[72px] lg:h-[72px] xl:w-[84px] xl:h-[84px] flex-shrink-0"
    >
      <img
        :src="user.avatarUrl || '/default-avatar.png'"
        :alt="user.name || 'User avatar'"
        class="rounded-full object-cover w-full h-full"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.5)]"
      ></div>
    </div>

    <!-- FIXED: Flexible container for name/username with proper overflow handling -->
    <div class="flex flex-col gap-1 sm:gap-2.5 text-left min-w-0 flex-1">
      <!-- FIXED: Name with proper truncation and responsive sizing -->
      <p
        class="font-bold text-white text-[18px] sm:text-[20px] md:text-[21px] lg:text-[22px] xl:text-[24px] [@media(min-width:1537px)]:text-[30px] inter-font truncate"
        style="font-weight: 700"
        :title="user.name || 'Unknown User'"
      >
        {{ user.name || "Unknown User" }}
      </p>
      <!-- FIXED: Username with better spacing and truncation -->
      <p
        class="text-base font-medium text-white text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] inter-font truncate"
        style="font-weight: 500"
        :title="'@' + (user.login || 'unknown')"
      >
        @{{ user.login || "unknown" }}
      </p>
    </div>

    <!-- FIXED: Three dots menu with proper positioning -->
    <div
      class="ml-auto flex items-center cursor-pointer relative flex-shrink-0"
      ref="containerRef"
    >
      <div @click="showModal = !showModal">
        <ThreeShortOnes />
      </div>

      <!-- Modal window -->
      <div
        v-if="showModal"
        ref="modalRef"
        class="absolute z-50 w-[90px] sm:w-[95px] md:w-[100px] lg:w-[105px] xl:w-[110px] 2xl:w-[120px] bg-[#060310] rounded-[5px] shadow-md flex flex-col justify-center items-center pl-[10px] pr-[8px] py-[3px] xl:py-[8px] lg:py-[6.5px] md:py-[5.5px] sm:py-[3.5px] gap-[5px] border-[1px] border-white/50"
        :style="modalStyles"
      >
        <button
          class="w-full text-[#D0202F] cursor-pointer py-[1.25px] xl:py-[4.25px] lg:py-[2.5px] sm:py-[2px] text-sm text-left font-semibold"
          @click="handleBlockUser"
          :disabled="isBlocking || isBlocked === null"
        >
          {{
            isBlocking
              ? "Processing..."
              : isBlocked === null
                ? "Loading..."
                : isBlocked
                  ? "Unblock user"
                  : "Block user"
          }}
        </button>
        <button
          class="w-full text-white cursor-pointer py-[1.25px] xl:py-[4.25px] lg:py-[2.5px] sm:py-[2px] text-sm text-left font-medium"
          @click="showModal = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- FIXED: Biography section with proper text wrapping -->
  <div
    class="flex items-start gap-10 min-h-[34px] sm:gap-15 md:gap-[46px] lg:gap-[76px] xl:gap-[56px] [@media(min-width:1537px)]:gap-[60px]"
  >
    <div
      class="flex-shrink-0 min-w-[60px] max-w-[100px] w-[100px] [@media(min-width:1537px)]:w-[100px] xl:w-[84px] lg:w-[72px] md:w-[68px] sm:w-[64px] max-sm:w-[60px]"
    >
      <div
        class="h-[26px] w-full sm:h-[32px] text-sm sm:text-base text-white rounded-[5px] text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] inter-font flex items-center justify-center"
        :style="getTagStyles(user.tag)"
      >
        {{ user.tag || "Add tag" }}
      </div>
    </div>

    <!-- FIXED: Biography with proper text wrapping and overflow handling -->
    <p
      class="flex-1 text-white text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] inter-font biographyinput break-words overflow-wrap-anywhere"
      style="font-weight: 400; line-height: 1.125"
    >
      {{ user.biography || "No biography available" }}
    </p>
  </div>

  <!-- Stats section -->
  <div
    class="flex items-center mt-[15px] sm:mt-[20px] md:mt-[25px] lg:mt-[30px] xl:mt-[35px] [@media(min-width:1537px)]:mt-[40px] gap-6.5 sm:gap-12.5 md:gap-[40px] lg:gap-[60px] xl:gap-[50px] [@media(min-width:1537px)]:gap-[60px]"
  >
    <div
      class="flex-shrink-0 min-w-[60px] max-w-[100px] w-[100px] [@media(min-width:1537px)]:w-[100px] xl:w-[90px] lg:w-[88px] md:w-[74px] sm:w-[74px] max-sm:w-[74px]"
    >
      <div
        class="w-full sm:h-[32px] text-sm sm:text-base text-white rounded-[5px] text-[16px] inter-font flex items-center justify-center"
        style="font-weight: 400"
      ></div>
    </div>

    <!-- FIXED: Stats section with responsive text sizing -->
    <section
      class="flex gap-[15px] sm:gap-[25px] md:gap-[30px] lg:gap-[40px] xl:gap-[20px] [@media(min-width:1537px)]:gap-[40px] mb-1.25 inter-font font-medium justify-end flex-wrap"
    >
      <p
        class="font-medium text-white inter-font text-[11px] sm:text-[12px] md:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] whitespace-nowrap"
        style="font-weight: 500"
      >
        {{ stats.posts || 0 }} posts
      </p>
      <p
        class="font-medium text-white inter-font text-[11px] sm:text-[12px] md:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] whitespace-nowrap"
        style="font-weight: 500"
      >
        Listeners: {{ stats.listeners || 0 }}
      </p>
      <p
        class="font-medium text-white inter-font text-[11px] sm:text-[12px] md:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] whitespace-nowrap"
        style="font-weight: 500"
      >
        Listened to: {{ stats.listenedTo || 0 }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import ThreeShortOnes from "../SVG/AnotherProfile/ThreeShortOnes.vue";

// Define interface for API error response
interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const props = defineProps<{
  user: {
    id: string;
    name: string;
    login: string;
    avatarUrl: string;
    biography: string;
    tag?: string;
    role?: string;
  };
  stats: {
    posts: number;
    listeners: number;
    listenedTo: number;
  };
}>();

const emit = defineEmits<{
  (e: "userBlocked", userId: string): void;
  (e: "userUnblocked", userId: string): void;
  (e: "stats-updated"): void;
}>();

const router = useRouter();

const showModal = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);
const isBlocking = ref(false);
const isBlocked = ref<boolean | null>(null);

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/default-avatar.png"; // Set a default avatar
};

// Get tag styles based on role - same logic as your working ProfileContent
const getTagStyles = (tag?: string) => {
  const styles = {
    fontWeight: "400",
    backgroundColor: "rgba(0, 12, 156, 0.4)",
    color: "white",
  };

  if (!tag) return styles;

  // Handle both display names and UUIDs
  let displayName = tag;

  // If it's a UUID, convert to display name first
  const roleMap: Record<string, string> = {
    "146fb41a-2f3e-48c7-bef9-01de0279dfd7": "Listener",
    "b361c6f9-9425-4548-8c07-cb408140c304": "Musician",
    "5ee121a6-b467-4ead-b3f7-00e1ce6097d5": "Learner",
  };

  if (roleMap[tag]) {
    displayName = roleMap[tag];
  }

  switch (displayName.toLowerCase()) {
    case "listener":
      return {
        ...styles,
        backgroundColor: "white",
        color: "black",
      };
    case "musician":
      return {
        ...styles,
        backgroundColor: "#6D01D0",
        color: "white",
      };
    case "learner":
      return {
        ...styles,
        backgroundColor: "#000C9C",
        color: "white",
      };
    default:
      return styles;
  }
};

const modalStyles = computed(() => {
  if (!containerRef.value) return {};

  const screenWidth = window.innerWidth;
  let rightOffset = 20;

  if (screenWidth >= 1536) {
    rightOffset = 40;
  } else if (screenWidth >= 1280) {
    rightOffset = 36;
  } else if (screenWidth >= 1024) {
    rightOffset = 32;
  } else if (screenWidth >= 768) {
    rightOffset = 28;
  } else if (screenWidth >= 640) {
    rightOffset = 24;
  }

  return {
    top: "50%",
    right: `${rightOffset}px`,
    transform: "translateY(-50%)",
  };
});

// Check if user is blocked when component mounts
async function checkBlockStatus() {
  if (!props.user.id) {
    console.warn("No user ID provided for block status check");
    return;
  }

  try {
    console.log(`Checking block status for user: ${props.user.id}`);
    const res = await fetch(
      `${API_URL}/profiles/blocks/check/${props.user.id}`,
      {
        credentials: "include",
      },
    );

    console.log("Block status response:", res.status, res.ok);

    if (res.ok) {
      const data = await res.json();
      console.log("Block status data:", data);
      isBlocked.value = data.is_blocked;
      console.log("Set isBlocked to:", isBlocked.value);
    } else {
      console.error("Failed to check block status:", res.status);
      isBlocked.value = false;
    }
  } catch (error) {
    console.error("Error checking block status:", error);
    isBlocked.value = false;
  }
}

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

async function handleBlockUser() {
  console.log("Block button clicked!");

  // Check authentication first
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to sign-in");
    router.push("/sign-in");
    return;
  }

  console.log("User ID:", props.user.id);
  console.log("Is blocking:", isBlocking.value);
  console.log("Is blocked:", isBlocked.value);

  if (isBlocking.value || !props.user.id) {
    console.log("Already processing or no user ID, skipping...");
    return;
  }

  isBlocking.value = true;

  try {
    const endpoint = `${API_URL}/profiles/blocks/${props.user.id}`;
    const method = isBlocked.value ? "DELETE" : "POST";

    console.log(`Making ${method} request to:`, endpoint);

    const res = await fetch(endpoint, {
      method,
      credentials: "include",
    });

    console.log("Response status:", res.status);
    console.log("Response OK:", res.ok);

    if (res.ok) {
      const responseData = await res.json();
      console.log("Response data:", responseData);

      showModal.value = false;
      isBlocked.value = !isBlocked.value;

      // Emit stats update
      emit("stats-updated");

      if (isBlocked.value) {
        emit("userBlocked", props.user.id);
        router.push("/");
      } else {
        emit("userUnblocked", props.user.id);
      }
    } else {
      if (res.status === 401) {
        console.log("Authentication failed, redirecting to sign-in");
        router.push("/sign-in");
        return;
      }

      let errorMessage = "Failed to update block status";
      try {
        const errorData = (await res.json()) as ApiErrorResponse;
        console.error("Error response:", errorData);
        errorMessage = errorData?.detail || errorMessage;
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }

      alert(`Error: ${errorMessage}`);
    }
  } catch (error: unknown) {
    console.error("Network/parsing error:", error);

    if (
      error instanceof TypeError &&
      (error as TypeError).message.includes("fetch")
    ) {
      alert(
        "Network error: Could not connect to server. Please check your connection.",
      );
    } else if (error instanceof SyntaxError) {
      alert("Server response error: Invalid response format.");
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`An error occurred: ${errorMessage}`);
    }
  } finally {
    isBlocking.value = false;
    console.log("Block action finished");
  }
}

// Watch for user ID changes and check block status
watch(
  () => props.user.id,
  (newId) => {
    console.log("User ID changed:", newId);
    if (newId) {
      console.log("Checking block status for new user ID:", newId);
      checkBlockStatus();
    }
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener("click", onClickOutside);
  if (props.user.id) {
    checkBlockStatus();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

function onClickOutside(e: MouseEvent) {
  if (
    modalRef.value &&
    containerRef.value &&
    !modalRef.value.contains(e.target as Node) &&
    !containerRef.value.contains(e.target as Node)
  ) {
    showModal.value = false;
  }
}
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}

/* Additional CSS for better text handling */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
}
</style>
