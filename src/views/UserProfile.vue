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
            class="gap-[20px] sm:gap-[20px] md:gap-[25px] lg:gap-[30px] xl:gap-[35px] 2xl:gap-10 relative flex w-full md:w-1/2 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
          >
            <!-- Section 1 -->
            <section
              class="px-[10px] sm:px-[50px] md:px-[20px] lg:px-[30px] xl:px-[30px] 2xl:px-[40px]"
            >
              <ProfileHeader :user="user" :stats="stats" />
            </section>

            <section>
              <ProfileContent :user="user" @update:user="updateUser" />
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div class="max-md:pb-20"></div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";

import ProfileContent from "@/components/userProfile/ProfileContent.vue";

interface User {
  name: string;
  login: string;
  avatarUrl: string;
  biography: string;
  tag?: string | "add tag";
}

interface Stats {
  posts: number;
  listeners: number;
  listenedTo: number;
}

const user = reactive<User>({
  name: "User Name",
  login: "user login",
  avatarUrl:
    "https://cdn.builder.io/api/v1/image/assets/TEMP/3922534bd59dfe0deae8bd149c0b3cba46e3eb47?placeholderIfAbsent=true&apiKey=04fef95365634cc5973c2029f1fc78f5",
  biography: "Lorem ipsum dolor sit amet,consectetur adipiscing",
  tag: "Add tag",
});

const stats = reactive<Stats>({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

const formData = reactive({
  name: user.name,
  login: user.login,
  avatarUrl: user.avatarUrl,
  biography: user.biography,
  selectedTag: user.tag || null,
});

const emit = defineEmits(["update:user"]);

const updateUser = (updatedUser: User) => {
  user.name = updatedUser.name;
  user.login = updatedUser.login;
  user.biography = updatedUser.biography;
  user.tag = updatedUser.tag;
  user.avatarUrl = updatedUser.avatarUrl;
};

const isModalOpen = ref(false);

const selectTag = (tag: string) => {
  formData.selectedTag = formData.selectedTag === tag ? null : tag;
};

const saveChanges = () => {
  emit("update:user", {
    ...user,
    name: formData.name,
    login: formData.login,
    biography: formData.biography,
    tag: formData.selectedTag,
    avatarUrl: formData.avatarUrl,
  });
  isModalOpen.value = false;
};

watch(
  () => user,
  (newUser) => {
    formData.name = newUser.name || "";
    formData.login = newUser.login || "";
    formData.biography = newUser.biography || "";
    formData.selectedTag = newUser.tag || "Add tag";
    formData.avatarUrl = newUser.avatarUrl || "";
  },
  { deep: true },
);
</script>

<style scoped>
/* Ensure content is centered with equal margins */

.inter-font {
  font-family: "Inter", sans-serif;
}

/* Center the content container */
main {
  display: flex;
  justify-content: center;
}
</style>
