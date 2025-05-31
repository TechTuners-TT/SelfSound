<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Navigation panel -->
    <nav
      class="bg-[#02033D]/50 text-white flex flex-col w-full md:w-[200px] h-auto md:h-full p-4 shrink-0"
    >
      <h1 class="text-left text-xl mb-[8px] font-bold">Admin Panel</h1>

      <ul class="flex flex-col gap-2 w-full">
        <router-link to="/admin/a">
          <li
            class="bg-[#6D01D0] rounded-md px-[14px] py-[12px] flex items-center gap-2"
          >
            <analyticsSVG />
            <p class="">Analytics</p>
          </li>
        </router-link>
        <router-link to="/admin/c">
          <li
            class="hover:bg-[#000C9C]/40 rounded-md px-[14px] py-[12px] flex items-center gap-2"
          >
            <complaintsSVG />
            <p class="">Complaints</p>
          </li>
        </router-link>
      </ul>
    </nav>

    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto p-[25px] py-[30px]">
      <div class="bg-[#02033D]/30 rounded-md text-white p-[20px]">
        <h1 class="text-left text-lg pb-[8px] font-bold mb-4">
          Analytics Dashboard
        </h1>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D01D0]"
          ></div>
        </div>

        <!-- Error state -->
        <div v-if="error" class="text-red-400 text-center py-20">
          <p class="text-lg mb-4">{{ error }}</p>
          <button
            @click="fetchAnalytics"
            class="bg-[#6D01D0] hover:bg-[#5a0ba8] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Analytics grid -->
        <div
          v-if="!isLoading && !error"
          class="grid grid-cols-1 xl:grid-cols-4 gap-4 place-items-center"
        >
          <div
            v-for="(report, index) in reports"
            :key="index"
            class="w-full bg-[#02033D]/50 rounded-sm p-[25px] flex flex-col justify-between"
          >
            <h1 class="text-lg font-bold mb-2">{{ report.posts_title }}</h1>
            <h2 class="text-2xl font-bold">{{ report.posts_data }}</h2>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import analyticsSVG from "../../components/SVG/AdminPage/analyticsSVG.vue";
import complaintsSVG from "../../components/SVG/AdminPage/complaintsSVG.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface AnalyticsReport {
  posts_title: string;
  posts_data: string;
}

const router = useRouter();
const reports = ref<AnalyticsReport[]>([]);
const isLoading = ref(true);
const error = ref<string>("");

const fetchAnalytics = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    const response = await fetch(`${API_URL}/admin/analytics`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        router.push("/login");
        throw new Error("Admin access required");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AnalyticsReport[] = await response.json();
    reports.value = data;
  } catch (err) {
    console.error("Error fetching analytics:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load analytics";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  console.log("🔍 AdminAnalyticsView: Component mounted, loading analytics...");
  // Skip admin check since router guard already verified admin access
  await fetchAnalytics();
});
</script>
