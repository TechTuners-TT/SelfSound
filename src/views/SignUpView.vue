<template>
  <main
    class="flex flex-col justify-center items-center px-5 w-full min-h-screen overflow-hidden"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <form @submit.prevent="handleSubmit" class="w-full max-w-sm">
      <h1 class="mb-12.5 text-2xl font-bold text-center text-white">Sign up</h1>

      <p v-if="successMessage" class="text-green-400 text-center mb-4">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="text-red-400 text-center mb-4">
        {{ errorMessage }}
      </p>

      <SignUpInput
        label="Your name"
        type="text"
        v-model="formData.name"
        :error="errors.name"
        placeholder="Enter name"
      />

      <SignUpInput
        label="Email address"
        type="email"
        v-model="formData.email"
        :error="errors.email"
        placeholder="Enter email"
      />

      <SignUpInput
        label="Password"
        type="password"
        v-model="formData.password"
        :error="errors.password"
        class="mb-7.5"
        placeholder="Enter password"
      />

      <button
        type="submit"
        :disabled="isLoading"
        class="mb-4.5 w-full h-9 text-base font-bold text-white rounded-md bg-[rgba(2,3,61,1)] hover: rgba(10, 20, 120, 1) transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? "Creating account..." : "Sign up" }}
      </button>

      <SignUpDivider text="or continue with" />

      <SignUpButton
        icon="google"
        text="Google"
        @click="handleGoogleLogin"
        class="mb-4.5"
      />

      <button
        type="button"
        @click="handleGuestMode"
        :disabled="isLoading"
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
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import SignUpInput from "@/components/Authentication/SignUpInput.vue";
import SignUpButton from "@/components/Authentication/SignUpButton.vue";
import SignUpDivider from "@/components/Authentication/SignUpDivider.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

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

// Interface for FastAPI validation error
interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Interface for API error response
interface ApiErrorResponse {
  detail?: string | ValidationError[];
}

export default defineComponent({
  name: "SignUpForm",
  components: {
    SignUpInput,
    SignUpButton,
    SignUpDivider,
  },
  setup() {
    const router = useRouter();

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

    const isLoading = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const resetMessages = () => {
      successMessage.value = "";
      errorMessage.value = "";
    };

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
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      isLoading.value = true;
      resetMessages();

      try {
        // Use environment variable for API URL
        const response = await fetch(`${API_URL}/authorization/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name, // Your backend expects 'name', not 'full_name'
          }),
        });

        const data = (await response.json()) as ApiErrorResponse;

        if (!response.ok) {
          // Handle different types of errors
          if (response.status === 400) {
            const detail = data.detail || "";

            if (typeof detail === "string") {
              if (detail.includes("User already exists and is verified")) {
                errorMessage.value =
                  "An account with this email already exists. Please sign in instead.";
                errors.email = "Account already exists";
              } else if (detail.includes("already exists")) {
                // User exists but not verified - backend will resend verification
                successMessage.value = "";
              } else if (detail.includes("Password must include")) {
                // Password validation error
                errors.password = detail;
                errorMessage.value = "Please check your password requirements.";
              } else if (detail.includes("Name cannot be empty")) {
                errors.name = "Name is required";
              } else if (detail.includes("email")) {
                errors.email = detail;
              } else {
                errorMessage.value = detail || "Registration failed";
              }
            }
          } else if (response.status === 422) {
            // Validation errors from FastAPI
            if (data.detail && Array.isArray(data.detail)) {
              data.detail.forEach((error: ValidationError) => {
                const field = error.loc[error.loc.length - 1];
                if (field === "email") {
                  errors.email = "Please enter a valid email address";
                } else if (field === "password") {
                  errors.password = error.msg || "Invalid password";
                } else if (field === "name") {
                  errors.name = error.msg || "Invalid name";
                }
              });
              errorMessage.value = "Please check your input and try again";
            } else {
              errorMessage.value = "Please check your input and try again";
            }
          } else if (response.status === 500) {
            errorMessage.value = "Server error. Please try again later.";
          } else {
            errorMessage.value =
              "An unexpected error occurred. Please try again.";
          }
          return;
        }

        // Clear form on success
        formData.name = "";
        formData.email = "";
        formData.password = "";

        // Redirect to verify page after a delay
        const userEmail = (data as { email?: string }).email || formData.email;
        setTimeout(() => {
          router.push({
            path: "/verify",
            query: { email: userEmail },
          });
        }, 3000);
      } catch (error) {
        console.error("Error during sign-up:", error);
        errorMessage.value =
          "Network error. Please check your connection and try again.";
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleLogin = () => {
      // Use environment variable for Google OAuth endpoint
      window.location.href = `${API_URL}/auth/login`;
    };

    const handleGuestMode = async () => {
      console.log("Guest mode clicked");
      isLoading.value = true;
      try {
        // Call logout to clear any existing sessions using environment variable
        await fetch(`${API_URL}/authorization/logout`, {
          method: "POST",
          credentials: "include",
        });
        // Redirect to home page
        await router.push("/home");
      } catch (error) {
        console.error("Guest mode error:", error);
        errorMessage.value = "Guest mode error. Please try again.";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      errors,
      isLoading,
      successMessage,
      errorMessage,
      handleSubmit,
      handleGoogleLogin,
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
