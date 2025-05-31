<template>
  <!-- Container that switches from column (mobile) to row (tablet+) -->
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Navigation panel: horizontal top on mobile, vertical left on md+ -->
    <!-- Навігаційна панель -->
    <nav
      class="bg-[#02033D]/50 text-white flex flex-col w-full md:w-[200px] h-auto md:h-full p-4 shrink-0"
    >
      <!-- Назва завжди видна -->
      <h1 class="text-left text-xl mb-[8px] font-bold">Admin Panel</h1>

      <!-- Навігаційні посилання завжди вертикальні -->
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

    <!-- Main content area fills the rest of the screen -->
    <main class="flex-1 overflow-y-auto p-[25px] py-[30px]">
      <!-- Responsive grid for dynamic reports -->
      <div class="bg-[#02033D]/30 rounded-md text-white p-[20px]">
        <h1 class="text-left text-lg pb-[8px] font-bold mb-4">
          Analytics Dashboard
        </h1>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 place-items-center">
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
import { ref } from "vue";
// Імпорт SVG-компонента має бути рядком шляху у лапках
import analyticsSVG from "../../components/SVG/AdminPage/analyticsSVG.vue";
import complaintsSVG from "../../components/SVG/AdminPage/complaintsSVG.vue";

// Тимчасові дані — масив об'єктів із полями posts_title і posts_data
const reports = ref([
  { posts_title: "Total Posts", posts_data: "1458" },
  { posts_title: "Total Users", posts_data: "312" },
  { posts_title: "Posts Today", posts_data: "758" },
  { posts_title: "New Users Today", posts_data: "12" },
]);
</script>
