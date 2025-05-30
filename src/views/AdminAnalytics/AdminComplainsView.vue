<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Navigation -->
    <nav
      class="bg-[#02033D]/50 p-[20px] text-white w-full md:w-[200px] h-auto md:h-full shrink-0 z-[3]"
    >
      <h1 class="text-xl inter-font font-bold mb-[8px]">Admin Panel</h1>
      <ul class="flex flex-col gap-2 w-full">
        <router-link to="/admin/a">
          <li
            class="hover:bg-[#000C9C]/40 rounded-md inter-font px-[14px] py-[12px] flex items-center gap-2"
          >
            <analyticsSVG />
            <p>Analytics</p>
          </li>
        </router-link>
        <router-link to="/admin/c">
          <li
            class="bg-[#6D01D0] rounded-md inter-font px-[14px] py-[12px] flex items-center gap-2"
          >
            <complaintsSVG />
            <p>Complaints</p>
          </li>
        </router-link>
      </ul>
    </nav>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto p-[25px] py-[30px] relative">
      <div class="bg-[#02033D]/30 rounded-md text-white p-5">
        <h1 class="text-lg font-bold inter-font mb-4">User Complaints</h1>

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
            @click="fetchReports"
            class="bg-[#6D01D0] hover:bg-[#5a0ba8] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Reports grid -->
        <div
          v-if="!isLoading && !error"
          class="grid grid-cols-1 gap-4 place-items-center"
        >
          <div
            v-for="report in reports"
            :key="report.id"
            class="bg-[#02033D]/50 w-full rounded-sm p-4 flex justify-between items-center"
          >
            <div class="text-left">
              <p class="text-sm pb-1 inter-font">{{ report.title }}</p>
              <p class="text-sm inter-font">{{ report.data }}</p>
            </div>

            <button
              @click="openModal(report.id)"
              :class="{
                'bg-[#6D01D0]/90': activeReportId === report.id && showModal,
                'bg-[#6D01D0] hover:bg-[#000C9C]/40': !(
                  activeReportId === report.id && showModal
                ),
              }"
              class="text-white inter-font text-sm px-4 py-2 rounded-md"
            >
              View Details
            </button>
          </div>

          <!-- No reports message -->
          <div v-if="reports.length === 0" class="text-center py-20">
            <p class="text-lg text-gray-400">No reports found</p>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 bg-opacity-70 flex justify-center items-center z-[9999]"
        @click.self="closeModal"
      >
        <div
          class="bg-[#060310] border-2 border-[#000C9C]/40 rounded-2xl p-[20px] w-[80%] md:w-[60%] text-white relative z-[9999]"
        >
          <div class="flex justify-between items-center w-full mb-4">
            <h2 class="text-xl inter-font font-bold">Complaint Details</h2>

            <button
              class="flex items-center inter-font justify-center w-[32px] h-[32px] rounded-full hover:bg-white/10 transition"
              @click="closeModal"
              aria-label="Close modal"
            >
              <CloseIcon
                class="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px]"
              />
            </button>
          </div>

          <!-- Report details -->
          <div class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Reporter ID</p>
            <p class="text-md inter-font">{{ currentReport.reporter_id }}</p>
          </div>
          <div class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Reporter Name</p>
            <p class="text-md inter-font">
              {{ currentReport.reporter_name || "Unknown" }}
            </p>
          </div>
          <div class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Post ID</p>
            <p class="text-md inter-font">{{ currentReport.post_id }}</p>
          </div>
          <div class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Reason</p>
            <p class="text-md inter-font">{{ currentReport.reason }}</p>
          </div>
          <div v-if="currentReport.description" class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Description</p>
            <p class="text-md inter-font">{{ currentReport.description }}</p>
          </div>
          <div class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Status</p>
            <p class="text-md inter-font capitalize">
              {{ currentReport.status || "pending" }}
            </p>
          </div>
          <div class="mb-4">
            <p class="text-md inter-font text-white/50 mb-2">Post Link</p>
            <a
              :href="currentReport.post_link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-md text-blue-400 inter-font underline hover:text-blue-300 transition"
            >
              {{ currentReport.post_link }}
            </a>
          </div>

          <!-- Action buttons -->
          <div class="flex justify-end gap-[12px]">
            <button
              @click="resolveReport('delete_post')"
              :disabled="isResolving"
              class="relative text-white inter-font text-md px-[16px] py-[8px] rounded-sm bg-[#D0202F] hover:bg-[#D0202F]/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                isResolving && resolvingAction === "delete_post"
                  ? "Deleting..."
                  : "Delete Post"
              }}
            </button>
            <button
              @click="resolveReport('ignore')"
              :disabled="isResolving"
              class="relative text-white inter-font text-md px-[16px] py-[8px] rounded-sm bg-[#000C9C]/40 hover:bg-[#000C9C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                isResolving && resolvingAction === "ignore"
                  ? "Ignoring..."
                  : "Ignore"
              }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import analyticsSVG from "../../components/SVG/AdminPage/analyticsSVG.vue";
import complaintsSVG from "../../components/SVG/AdminPage/complaintsSVG.vue";
import CloseIcon from "../../components/SVG/AddPosts_Icons/CloseIcon.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface Report {
  id: string; // Changed from number to string since using UUIDs
  title: string;
  data: string;
  reporter_id: string;
  post_id: string;
  reason: string;
  description?: string;
  post_link: string;
  reporter_name?: string;
  status?: string;
}

const EMPTY_REPORT: Report = {
  id: "",
  title: "",
  data: "",
  reporter_id: "",
  post_id: "",
  reason: "",
  description: "",
  post_link: "",
  reporter_name: "",
  status: "",
};

const router = useRouter();
const reports = ref<Report[]>([]);
const isLoading = ref(true);
const error = ref<string>("");
const showModal = ref(false);
const activeReportId = ref<string | null>(null); // Changed from number to string
const isResolving = ref(false);
const resolvingAction = ref<string>("");

const fetchReports = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    console.log("🔍 Fetching reports...");

    const response = await fetch(`${API_URL}/admin/reports`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      if (response.status === 403) {
        router.push("/login");
        throw new Error("Admin access required");
      }
      if (response.status === 401) {
        router.push("/sign-in");
        throw new Error("Authentication required");
      }
      const errorText = await response.text();
      console.error(" Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Report[] = await response.json();
    console.log(" Reports loaded:", data);
    reports.value = data;
  } catch (err) {
    console.error(" Error fetching reports:", err);
    error.value = err instanceof Error ? err.message : "Failed to load reports";
  } finally {
    isLoading.value = false;
  }
};

const openModal = (id: string) => {
  // Changed parameter type
  activeReportId.value = id;
  showModal.value = true;
  console.log("Opening modal for report:", id);
};

const closeModal = () => {
  showModal.value = false;
  activeReportId.value = null;
  isResolving.value = false;
  resolvingAction.value = "";
};

const resolveReport = async (action: "delete_post" | "ignore") => {
  if (!activeReportId.value || isResolving.value) return;

  try {
    isResolving.value = true;
    resolvingAction.value = action;

    console.log(
      `🔧 Resolving report ${activeReportId.value} with action: ${action}`,
    );

    const response = await fetch(
      `${API_URL}/admin/reports/${activeReportId.value}/resolve`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: action }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(" Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(" Report resolved:", result);

    // Remove the resolved report from the list
    reports.value = reports.value.filter(
      (report) => report.id !== activeReportId.value,
    );

    // Show success message
    alert(
      `Report ${action === "delete_post" ? "deleted" : "ignored"} successfully`,
    );

    closeModal();
  } catch (err) {
    console.error(" Error resolving report:", err);
    alert(err instanceof Error ? err.message : "Failed to resolve report");
  } finally {
    isResolving.value = false;
    resolvingAction.value = "";
  }
};

const currentReport = computed<Report>(
  () =>
    reports.value.find((r) => r.id === activeReportId.value) ?? EMPTY_REPORT,
);

onMounted(async () => {
  console.log("🔧 AdminComplainsView: Component mounted, loading reports...");
  await fetchReports();
});
</script>
