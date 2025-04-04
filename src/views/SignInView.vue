<template>
  <main
  class="flex flex-col justify-center items-center px-5 w-full  w-screen h-screen"
  style="background-color: rgba(6, 3, 16, 1);">
    <section class="w-full max-w-sm">
      <header class="mb-6.5 text-2xl font-bold text-center text-white">
        <h1>Log in to your Profile</h1>
      </header>

      <form @submit.prevent="handleSubmit">
        <LoginFormInput
          id="email"
          label="Email address"
          type="email"
          v-model="email"
         
        />

        <LoginFormInput
          id="password"
          label="Password"
          type="password"
          v-model="password"
         
        />

        <LoginFormButton type="submit" marginClass="mb-4.5 , mt-7.5">
          Sign In
        </LoginFormButton>

        <LoginFormDivider text="or continue with"  />

        <LoginFormButton
          @click="handleGoogleSignIn"
          marginClass="mb-4.5"
          :hasIcon="true"
        >
          <template #icon>
            <GoogleIcon />
          </template>
          Google
        </LoginFormButton>

        <LoginFormButton @click="handleGuestMode" marginClass="mb-4.5">
          Guest mode
        </LoginFormButton>

        <p class="text-base font-semibold text-center text-white">
          
          <router-link to="/sign-up"
            @click.prevent="handleSignUp"
            class=" hover:text-gray-300"
            >Don't have a profile? Sign up here!</router-link>
          
           
        </p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginFormInput from "@/components/Authentication/LoginFormInput.vue";
import LoginFormButton from "@/components/Authentication/LoginFormButton.vue";
import LoginFormDivider from "@/components/Authentication/LoginFormDivider.vue";
import GoogleIcon from "@/components/icons/GoogleIcon.vue";

// Form state
const email = ref("");
const password = ref("");

// Form handlers
const handleSubmit = () => {
  // Here you would typically handle form validation and submission
  console.log("Sign in with:", {
    email: email.value,
    password: password.value,
  });
};

const handleGoogleSignIn = () => {
  console.log("Sign in with Google");
  // Implement Google authentication logic
};

const handleGuestMode = () => {
  console.log("Continue as guest");
  // Implement guest mode logic
};

const handleSignUp = () => {
  console.log("Navigate to sign up page");
  // Navigate to sign up page or show sign up form
};
</script>
