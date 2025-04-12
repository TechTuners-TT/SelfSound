<template>
  <div class="relative w-full h-screen" style="background-color: rgba(30, 30, 30, 1)">
  <main class="flex w-full h-screen overflow-x-hidden "  style="background-color: rgba(30, 30, 30, 1)"
  >
    <NavBar />
    <section
      class="flex relative flex-col flex-1   max-md:pt-[50px] max-md:pb-[34px]  [@media(min-width:1550px)]:mx-25  xl:mx-[60px]   lg:mx-[60px] md:mx-[50px]  sm:mx-[0px] h-screen" style="background-color: rgba(30, 30, 30, 1)"
    >
      <div
        class=" items-center justify-center gap-10  flex flex-col h-full [@media(min-width:1550px)]:pt-16.25 xl:pt-10.25 lg:pt-8.25 md:pt-5.25 mx-auto w-full max-w-[640px]" style="background-color: rgba(6, 3, 16, 1)"
      >

        <ProfileHeader  :user="user" />
       
       <ProfileStats   :stats="stats"  />
        <ProfileContent  :user="user" @update:user="updateUser" />
     
    </div>
    </section>
  </main>

  
</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
import ProfileStats from "@/components/userProfile/ProfileStats.vue";
import ProfileContent from "@/components/userProfile/ProfileContent.vue";



interface User {
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

const user = reactive<User>({
  name: "User Name",
  login: "user login",
  avatarUrl:
    "https://cdn.builder.io/api/v1/image/assets/TEMP/3922534bd59dfe0deae8bd149c0b3cba46e3eb47?placeholderIfAbsent=true&apiKey=04fef95365634cc5973c2029f1fc78f5",
  biography: "Lorem ipsum dolor sit amet,consectetur adipiscing",
});

const stats = reactive<Stats>({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

const formData = reactive({
  name: user.name,
  login: user.login,
  biography: user.biography,
  selectedTag: user.tag || null,
});

const emit = defineEmits(["update:user"]);

const updateUser = (updatedUser: User) => {
  user.name = updatedUser.name;
  user.login = updatedUser.login;
  user.biography = updatedUser.biography;
  user.tag = updatedUser.tag;
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
  });
  isModalOpen.value = false;
};

watch(
  () => user,
  (newUser) => {
    formData.name = newUser.name || "";
    formData.login = newUser.login || "";
    formData.biography = newUser.biography || "";
    formData.selectedTag = newUser.tag || null;
  },
  { deep: true }
);
</script>




<style scoped>
/* Ensure content is centered with equal margins */
@media (min-width: 768px) {
  section {
   
    max-width: calc(100% - 100px);
  }
}



.inter-font {
  font-family: 'Inter', sans-serif;
}

/* Center the content container */
main {
  display: flex;
  justify-content: center;
}



@media (max-width: 640px) {
  section {
    max-width: 100%;
    margin: 0 10px; /* Adjust margin for small screens */
  }

  .py-4 {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}

@media (max-width: 450px) {
  section {
    margin: 0 5px;
  }

  .py-4 {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .gap-6 {
    gap: 1rem;
  }
}

</style>
