<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Навігація -->
    <nav
      class="bg-[#02033D]/50 p-[20px] text-white w-full md:w-[200px] h-auto md:h-full shrink-0 z-[3]"
    >
      <h1 class="text-xl font-bold mb-[8px]">Admin Panel</h1>
      <ul class="flex flex-col gap-2 w-full">
        <router-link to="/admin/a">
          <li
            class="hover:bg-[#000C9C]/40 rounded-md px-[14px] py-[12px] flex items-center gap-2"
          >
            <analyticsSVG />
            <p>Analytics</p>
          </li>
        </router-link>
        <router-link to="/admin/c">
          <li
            class="bg-[#6D01D0] rounded-md px-[14px] py-[12px] flex items-center gap-2"
          >
            <complaintsSVG />
            <p>Complaints</p>
          </li>
        </router-link>
      </ul>
    </nav>

    <!-- Головний контент -->
    <main class="flex-1 overflow-y-auto p-[25px] py-[30px] relative">
      <div class="bg-[#02033D]/30 rounded-md text-white p-5">
        <h1 class="text-lg font-bold mb-4">User Complaints</h1>

        <div class="grid grid-cols-1 gap-4 place-items-center">
          <div
            v-for="report in reports"
            :key="report.id"
            class="bg-[#02033D]/50 w-full rounded-sm p-4 flex justify-between items-center"
          >
            <div class="text-left">
              <p class="text-sm pb-1">{{ report.title }}</p>
              <p class="text-sm">{{ report.data }}</p>
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
        </div>
      </div>

      <!-- Затемнений бекграунд і модалка -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 bg-opacity-70 flex justify-center items-center z-[9999]"
        @click.self="closeModal"
      >
        <div
          class="bg-[#060310] border-2 border-[#000C9C]/40 rounded-2xl p-[20px] w-[80%] md:w-[60%] text-white relative z-[9999]"
        >
          <div class="flex justify-between items-center w-full mb-4">
            <h2 class="text-xl font-bold">Complaint Details</h2>

            <button
              class="flex items-center justify-center w-[32px] h-[32px] rounded-full hover:bg-white/10 transition"
              @click="closeModal"
              aria-label="Close modal"
            >
              <CloseIcon
                class="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px]"
              />
            </button>
          </div>

          <!-- Тут можеш додати більше деталей -->
          <div class="mb-4">
            <p class="text-md text-white/50 mb-2">Reporter ID</p>
            <p class="text-md">{{ currentReport.reporter_id }}</p>
          </div>
          <div class="mb-4">
            <p class="text-md text-white/50 mb-2">Post ID</p>
            <p class="text-md">{{ currentReport.post_id }}</p>
          </div>
          <div class="mb-4">
            <p class="text-md text-white/50 mb-2">Reason</p>
            <p class="text-md">{{ currentReport.reason }}</p>
          </div>
          <div class="mb-4">
            <p class="text-md text-white/50 mb-2">Post Link</p>

            <a
              :href="currentReport.post_link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-md text-blue-400 underline hover:text-blue-300 transition"
            >
              {{ currentReport.post_link }}
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import analyticsSVG from "../../components/SVG/AdminPage/analyticsSVG.vue";
import complaintsSVG from "../../components/SVG/AdminPage/complaintsSVG.vue";
import CloseIcon from "../../components/SVG/AddPosts_Icons/CloseIcon.vue";

/* ---------- тип репорта ---------- */
interface Report {
  id: number;
  title: string;
  data: string;
  reporter_id: string;
  post_id: string;
  reason: string;
  post_link: string;
}

/* ---------- «порожній» обʼєкт-заглушка ---------- */
const EMPTY_REPORT: Report = {
  id: 0,
  title: "",
  data: "",
  reporter_id: "",
  post_id: "",
  reason: "",
  post_link: "",
};

/* ---------- мок-дані (заміниш на бекенд) ---------- */
const reports = ref<Report[]>(
  Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Report #${i + 1}`,
    data: `2024-01-0${i + 1} 14:30`,
    reporter_id: `${1000 + i}`,
    post_id: `${2000 + i}`,
    reason: "hate speech",
    post_link: `https://example.com/post/${i + 1}`,
  })),
);

/* ---------- логіка модалки ---------- */
const showModal = ref(false);
const activeReportId = ref<number | null>(null);

function openModal(id: number) {
  activeReportId.value = id;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  activeReportId.value = null;
}

/* ---------- репорт, що показується у модалці ---------- */
const currentReport = computed<Report>(
  () =>
    reports.value.find((r) => r.id === activeReportId.value) ?? EMPTY_REPORT,
);
</script>
