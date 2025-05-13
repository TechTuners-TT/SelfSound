<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->

    <main class="flex flex-col flex-grow overflow-auto">
      <!-- MAIN CONTENT -->

      <!-- Nav Bar -->
      <NavBar />
      <!--  Content -->
      <div class="flex-grow max-h-full">
        <!-- Виключаємо min-h-screen, використовуємо h-full, щоб зайняв доступну висоту    [@media(min-width:1537px)]:pl-25 [@media(min-width:1537px)]:pr-25 xl:mr-[70px] xl:ml-[70px] lg:ml-[60px] lg:mr-[60px] md:ml-[60px] md:mr-[60px] sm:ml-[0px] sm:mr-[0px]-->
        <div class="relative flex items-start justify-center w-full h-full">
          <!-- Забираємо h-full / max-h-screen із внутрішнього контейнера або замінюємо їх на max-h-full -->

          <div
            class="relative flex w-full md:w-3/5 xl:w-1/3 bg-black/30 flex-col min-h-screen overflow-y-auto"
          >
            <!-- Section 1 -->
            <section>
              <HomeSwitch
                :activeTab="activeTab"
                @update:activeTab="activeTab = $event"
              />
            </section>
            <!-- Section 2 -->
            <section>
              <HomePostsee v-if="activeTab === 'forYou'" />
              <HomeListenedTo v-else />
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import NavBar from "../components/Navigation/NavBar.vue";
import HomeSwitch from "@/components/HomePage/HomeSwitch.vue";
import HomePostsee from "@/components/HomePage/HomePostsee.vue";
import HomeListenedTo from "@/components/HomePage/HomeListenedTo.vue";
import { ref } from "vue";
const activeTab = ref("forYou"); // Спочатку активна вкладка "For you"
</script>
