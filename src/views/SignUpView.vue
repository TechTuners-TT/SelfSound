<template>
  <main
    class="flex flex-col justify-center items-center px-5 w-full min-h-screen overflow-hidden"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <form @submit.prevent="handleSubmit" class="w-full max-w-sm">
      <h1 class="mb-12.5 text-2xl font-bold text-center text-white">
        Sign up your Profile
      </h1>

      <SignUpInput
        label="Your name"
        type="text"
        v-model="formData.name"
        :error="errors.name"
        placeholder="enter name"
      />

      <SignUpInput
        label="Email address"
        type="email"
        v-model="formData.email"
        :error="errors.email"
        placeholder="enter email"
      />

      <SignUpInput
        label="Password"
        type="password"
        v-model="formData.password"
        :error="errors.password"
        class="mb-7.5"
        placeholder="enter passwordl"
      />

      <button
        type="submit"
        class="mb-4.5 w-full h-9 text-base font-bold text-white rounded-md bg-[rgba(2,3,61,1)] hover: rgba(10, 20, 120, 1) transition duration-300 ease-in-out"
      >
        Sign up
      </button>

      <SignUpDivider text="or continue with" />

      <SignUpButton
        icon="google"
        text="Google"
        @click="handleGoogleSignIn"
        class="mb-4.5"
      />

      <button
        type="button"
        @click="handleGuestMode"
        class="mb-4.5 w-full h-9 text-base font-bold text-white rounded-md bg-[rgba(2,3,61,1)] transition duration-300 ease-in-out"
      >
        Guest mode
      </button>

      <p class="text-base font-bold text-center text-white">
        <router-link to="/sign-in" class="hover:#6D01D0;"
          >Already have a profile? Log in here!</router-link
        >
      </p>
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import SignUpInput from "@/components/Authentication/SignUpInput.vue";
import SignUpButton from "@/components/Authentication/SignUpButton.vue";
import SignUpDivider from "@/components/Authentication/SignUpDivider.vue";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
}

export default defineComponent({
  name: "SignUpForm",
  components: {
    SignUpInput,
    SignUpButton,
    SignUpDivider,
  },
  setup() {
    const formData = reactive<FormData>({
      name: "",
      email: "",
      password: "",
    });

    const errors = reactive<FormErrors>({
      name: "",
      email: "",
      password: "",
    });

    const validateForm = (): boolean => {
      let isValid = true;

      // Reset errors
      errors.name = "";
      errors.email = "";
      errors.password = "";

      // Validate name
      if (!formData.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
      }

      // Validate email
      if (!formData.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }

      // Validate password
      if (!formData.password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        // Here you would typically send the data to your API
        console.log("Form submitted:", formData);
        // Reset form after successful submission
        formData.name = "";
        formData.email = "";
        formData.password = "";
      }
    };

    const handleGoogleSignIn = () => {
      console.log("Google sign in clicked");
      // Implement Google sign-in logic here
    };

    const handleGuestMode = () => {
      console.log("Guest mode clicked");
      // Implement guest mode logic here
    };

    return {
      formData,
      errors,
      handleSubmit,
      handleGoogleSignIn,
      handleGuestMode,
    };
  },
});
</script>
<style scoped>
button:hover {
  background-color: rgba(10, 20, 120, 1);
}
</style>
