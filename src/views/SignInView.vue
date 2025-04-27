<template>
  <main
    class="flex flex-col justify-center items-center px-5 w-full min-h-screen overflow-hidden"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <section class="w-full max-w-sm">
      <header class="mb-6.5 text-2xl font-bold text-center text-white">
        <h1>Log in</h1>
      </header>

      <form @submit.prevent="handleSubmit">
        <LoginFormInput
          id="email"
          label="Email address"
          type="email"
          v-model="email"
          :error="errors.email"
          placeholder="enter email"
        />

        <LoginFormInput
          id="password"
          label="Password"
          type="password"
          v-model="password"
          :error="errors.password"
          placeholder="enter password"
        />

        <LoginFormButton type="submit" marginClass="mb-4.5 , mt-7.5">
          Sign In
        </LoginFormButton>

        <LoginFormDivider text="or continue with" />

        <LoginFormButton
          @click="handleGoogleLogin"
          marginClass="mb-4.5"
          :hasIcon="true"
        >
          <template #icon>
            <GoogleIcon />
          </template>
          Google
        </LoginFormButton>

        <LoginFormButton @click="handleGuestLogin" marginClass="mb-4.5">
          Guest mode
        </LoginFormButton>

        <p class="text-base font-semibold text-center text-white">
          <router-link
            to="/sign-up"
            @click.prevent="handleSignUp"
            class="hover:#6D01D0;"
            >Don't have a profile? Sign up here!</router-link
          >
        </p>
      </form>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import LoginFormInput from "@/components/Authentication/LoginFormInput.vue";
import LoginFormButton from "@/components/Authentication/LoginFormButton.vue";
import LoginFormDivider from "@/components/Authentication/LoginFormDivider.vue";
import GoogleIcon from "@/components/SVG/Authentication/Sign_Up_In_If_button_Google.vue";

export default defineComponent({
  name: "LoginForm",
  components: {
    LoginFormInput,
    LoginFormButton,
    LoginFormDivider,
    GoogleIcon,
  },
  setup() {
    const email = ref("");
    const password = ref("");

    // Changed from Email/Password to lowercase email/password to match the field names
    const errors = reactive({
      email: "",
      password: "",
    });

    const validateForm = (): boolean => {
      let isValid = true;

      // Reset errors
      errors.email = "";
      errors.password = "";

      // Validate email
      if (!email.value) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }

      // Validate password
      if (!password.value) {
        errors.password = "Password is required";
        isValid = false;
      } else if (password.value.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        console.log("Login submitted with:", {
          email: email.value,
          password: password.value,
        });
        // Here you would typically call an authentication service
      }
    };

    const handleGoogleLogin = () => {
      console.log("Google login clicked");
      // Implement Google OAuth login
    };

    const handleGuestLogin = () => {
      console.log("Guest login clicked");
      // Implement guest login logic
    };

    const handleSignUp = () => {
      console.log("Sign up clicked");
      // Navigate to sign up page or show sign up modal
    };

    return {
      email,
      password,
      errors,
      handleSubmit,
      handleGoogleLogin,
      handleGuestLogin,
      handleSignUp,
    };
  },
});
</script>
