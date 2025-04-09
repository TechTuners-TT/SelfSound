<template>
  <div class="relative w-full h-screen">
  <main class="flex w-full h-screen overflow-x-hidden"
  style="background-color: rgba(6, 3, 16, 1);">
    <NavBar />
    <section
      class="flex relative flex-col flex-1   max-md:pt-[65px] max-md:pb-[70px] mx-15 h-screen" style="background-color: rgba(6, 3, 16, 1)"
    >
      <div
        class=" items-center justify-center   flex flex-col gap-6 py-4 md:py-10.25 mx-auto w-full max-w-[640px]"
      >
        <ProfileHeader :user="user" />
       <div class="profile-stats-container"><ProfileStats :stats="stats"  /></div> 
        <ProfileContent :user="user"/>
      </div>
    </section>
  </main>

  
</div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import ProfileHeader from "@/components/userProfile/ProfileHeader.vue";
import ProfileStats from "@/components/userProfile/ProfileStats.vue";
import ProfileContent from "@/components/userProfile/ProfileContent.vue";

// Define user data with inline types
const user = reactive({
  name: "User Name",
  username: "user login",
  avatarUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/3922534bd59dfe0deae8bd149c0b3cba46e3eb47?placeholderIfAbsent=true&apiKey=04fef95365634cc5973c2029f1fc78f5",
});

// Define stats data with inline types
const stats = reactive({
  posts: 0,
  listeners: 0,
  listenedTo: 0,
});

function rgba(arg0: number, arg1: string, arg2: string, arg3: boolean, arg4: string, arg5: boolean, arg6: string, arg7: string, arg8: string, arg9: boolean): unknown {
  throw new Error("Function not implemented.");
}
</script>

<style scoped>
/* Ensure content is centered with equal margins */
@media (min-width: 768px) {
  section {
   
    max-width: calc(100% - 100px);
  }
}


/* Center the content container */
main {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .profile-stats-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
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
