<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <!-- Main content -->

    <main class="flex flex-col flex-grow overflow-auto">
      <!-- MAIN CONTENT -->

      <!-- Nav Bar -->
      <NavBar />
      <!--  Content -->
      <div class="flex-grow max-h-full">
        <!-- Виключаємо min-h-screen, використовуємо h-full, щоб зайняв доступну висоту  -->
        <div class="relative flex items-start justify-center w-full h-full">
          <!-- Забираємо h-full / max-h-screen із внутрішнього контейнера або замінюємо їх на max-h-full -->

          <div
            class="gap-[20px] sm:gap-[20px] md:gap-[25px] lg:gap-[30px] xl:gap-[35px] 2xl:gap-10 relative w-full md:w-3/5 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
          >
            <!-- Section 1 -->
            <section
              class="px-[10px] sm:px-[50px] md:px-[20px] lg:px-[30px] xl:px-[30px] 2xl:px-[40px] bg-[rgba(0, 0, 0,0.3)]"
            >
              <UserNotification />
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-15"></div>
</template>

<script setup lang="ts">
import UserNotification from "@/components/NotificationPage/UserNotification.vue";
import NavBar from "@/components/Navigation/NavBar.vue";
</script>
