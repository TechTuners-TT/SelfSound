<template>
  <main
    class="flex flex-col justify-center items-center px-3 w-full min-h-screen overflow-hidden"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <div
      class="bg-[#02033D] text-white flex flex-col justify-center items-center p-8 rounded-lg w-full sm:w-1/2 xl:w-4/10 sm:aspect-square"
    >
      <svg
        class="mb-6"
        width="64"
        height="64"
        viewBox="0 0 66 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="32" fill="white" />
        <path
          d="M42.6665 21.3335H21.3332C19.8665 21.3335 18.6798 22.5335 18.6798 24.0002L18.6665 40.0002C18.6665 41.4668 19.8665 42.6668 21.3332 42.6668H42.6665C44.1332 42.6668 45.3332 41.4668 45.3332 40.0002V24.0002C45.3332 22.5335 44.1332 21.3335 42.6665 21.3335ZM42.6665 26.6668L31.9998 33.3335L21.3332 26.6668V24.0002L31.9998 30.6668L42.6665 24.0002V26.6668Z"
          fill="#02033D"
        />
      </svg>

      <h1 class="text-xl font-bold inter-font mb-6">Check Your Email</h1>

      <p class="text-md inter-font">We've sent a verification link to</p>
      <p class="text-md inter-font font-semibold">
        {{ userEmail || "your email address" }}
      </p>

      <hr class="border-t border-white/20 w-full my-6 inter-font" />

      <p class="text-md mb-6 inter-font">Didn't receive the email?</p>
      <button
        @click="resendEmail"
        :disabled="isResending || !canResend"
        class="relative inter-font mb-6 bg-white hover:bg-[#000C9C]/50 text-[#02033D] hover:text-white font-bold inter-font text-md px-[16px] py-[12px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
      >
        {{
          isResending
            ? "Sending..."
            : canResend
              ? "Resend Email"
              : `Wait ${cooldownDisplay}`
        }}
      </button>

      <p v-if="resendMessage" class="text-green-400 text-sm mb-4">
        {{ resendMessage }}
      </p>

      <p class="text-md text-center inter-font">
        Make sure to check your spam folder if you don't see the email in your
        inbox
      </p>

      <div class="mt-6">
        <router-link
          to="/sign-in"
          class="text-white/70 hover:text-white underline text-sm inter-font"
        >
          Back to Sign In
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const userEmail = ref("");
const isResending = ref(false);
const resendMessage = ref("");
const lastResendTime = ref<number | null>(null);
const currentTime = ref(Date.now()); // Reactive current time
const cooldownDuration = 3 * 60 * 1000; // 3 minutes in milliseconds

let timerInterval: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  // Get email from query parameters
  userEmail.value = (route.query.email as string) || "";

  // Check if there's a stored last resend time for this email
  const storedTime = localStorage.getItem(`resend_cooldown_${userEmail.value}`);
  if (storedTime) {
    lastResendTime.value = parseInt(storedTime);
  }

  // Start timer to update current time every second
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Computed property to check if resend is allowed
const canResend = computed(() => {
  if (!lastResendTime.value) return true;
  const timePassed = currentTime.value - lastResendTime.value;
  return timePassed >= cooldownDuration;
});

// Computed property for remaining cooldown time
const remainingCooldown = computed(() => {
  if (!lastResendTime.value || canResend.value) return 0;
  const timePassed = currentTime.value - lastResendTime.value;
  const remaining = cooldownDuration - timePassed;
  return Math.ceil(remaining / 1000); // Convert to seconds
});

// Computed property for cooldown display
const cooldownDisplay = computed(() => {
  if (canResend.value) return "";
  const seconds = remainingCooldown.value;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
});

const resendEmail = async () => {
  if (!userEmail.value) {
    resendMessage.value =
      "No email address found. Please try signing up again.";
    return;
  }

  if (!canResend.value) {
    resendMessage.value = `Please wait ${cooldownDisplay.value} before requesting another email.`;
    return;
  }

  isResending.value = true;
  resendMessage.value = "";

  try {
    const response = await fetch(
      `${API_URL}/authorization/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail.value,
        }),
      },
    );

    if (response.ok) {
      // Record the resend time
      const newTime = Date.now();
      lastResendTime.value = newTime;
      currentTime.value = newTime; // Update current time immediately
      localStorage.setItem(
        `resend_cooldown_${userEmail.value}`,
        newTime.toString(),
      );

      resendMessage.value = "Verification email sent successfully!";
    } else {
      const data = await response.json();
      resendMessage.value =
        data.detail || "Failed to resend email. Please try again.";
    }
  } catch (error) {
    console.error("Resend email error:", error);
    resendMessage.value = "Network error. Please try again.";
  } finally {
    isResending.value = false;
  }
};
</script>

<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
