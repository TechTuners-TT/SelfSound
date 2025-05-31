<template>
  <!-- Log out button -->
  <div class="m-[20px]">
    <button
      @click="logoutUser"
      class="relative text-white font-bold inter-font text-[16px] px-[16px] py-[12px] rounded-md bg-[#000C9C]/40 hover:bg-[#6D01D0]/50"
    >
      Log out
    </button>
  </div>

  <!-- Text: Dangerous zone -->
  <div class="mx-[20px] xl:mt-[50px] mt-[40px]">
    <h1 class="lg:text-[20px] text-[16px] font-bold text-[#F43636] inter-font">
      Danger zone
    </h1>
  </div>

  <!-- Delete your account button -->
  <div class="mx-[20px] 2xl:my-[30px] xl:my-[20px] my-[10px]">
    <button
      @click="deleteAccount"
      class="relative text-white font-bold inter-font text-[16px] px-[16px] py-[12px] rounded-md bg-[#D0202F]"
    >
      Delete my account
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

async function logoutUser() {
  try {
    await fetch(`${API_URL}/authorization/logout`, {
      method: "POST",
      credentials: "include", // send cookies
    });

    // Always redirect to sign-in regardless of response
    router.push("/sign-in");
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if there's an error
    router.push("/sign-in");
  }
}

async function deleteAccount() {
  try {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    await fetch(`${API_URL}/authorization/me`, {
      method: "DELETE",
      credentials: "include",
    });

    // Redirect to sign-in page regardless of success or failure
    router.push("/sign-in");
  } catch (error) {
    console.error("Delete account error:", error);
    router.push("/sign-in");
  }
}
</script>
