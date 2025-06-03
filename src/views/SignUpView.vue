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
        maxlength="15"
        @input="onNameInput"
        @paste="onNamePaste"
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

interface ValidationError {
  loc: string[];
  msg?: string;
}

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
    const API_URL = import.meta.env.VITE_API_URL;
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

    // Helper function to truncate name to 15 characters
    const truncateName = (name: string): string => {
      if (!name) return "";
      return name.length > 15 ? name.substring(0, 15) : name;
    };

    // Name input handler with truncation
    const onNameInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const truncatedName = truncateName(input.value);
      formData.name = truncatedName;
      // Update the input value to reflect truncation immediately
      if (input.value !== truncatedName) {
        input.value = truncatedName;
      }
      // Clear name error when user starts typing
      if (errors.name) {
        errors.name = "";
      }
    };

    // Handle paste events to ensure pasted content is also truncated
    const onNamePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData("text") || "";
      const truncatedText = truncateName(pastedText);
      formData.name = truncatedText;

      // Update the input field directly
      const input = event.target as HTMLInputElement;
      input.value = truncatedText;

      // Clear name error when user pastes
      if (errors.name) {
        errors.name = "";
      }
    };

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
      } else if (formData.name.length > 15) {
        errors.name = "Name must be 15 characters or less";
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
      // Ensure name is truncated before validation
      formData.name = truncateName(formData.name);

      if (!validateForm()) {
        return;
      }

      isLoading.value = true;
      resetMessages();

      try {
        // Use the correct endpoint that matches your backend
        const response = await fetch(`${API_URL}/authorization/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name, // Send truncated name to backend
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle different types of errors
          if (response.status === 400) {
            const detail = data.detail || "";

            if (detail.includes("User already exists and is verified")) {
              errorMessage.value =
                "An account with this email already exists. Please sign in instead.";
              errors.email = "Account already exists";
            } else if (detail.includes("already exists")) {
              // User exists but not verified - backend will resend verification
              successMessage.value =
                "A verification email has been sent to your email address. Please check your inbox.";
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

        // Success - show success message
        successMessage.value =
          data.message ||
          "Account created successfully! Please check your email for verification.";

        // Clear form on success
        formData.name = "";
        formData.email = "";
        formData.password = "";

        // Optional: Redirect to a confirmation page after a delay
        // Note: Using the email from the response, not the cleared form
        const userEmail = data.email || formData.email;
        setTimeout(() => {
          router.push({
            path: "/verify",
            query: { email: userEmail },
          });
        }, 2000);
      } catch (error) {
        console.error("Error during sign-up:", error);
        errorMessage.value =
          "Network error. Please check your connection and try again.";
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleLogin = () => {
      window.location.href = `${API_URL}/auth/login`;
    };

    const handleGuestMode = async () => {
      console.log("Guest mode clicked");
      isLoading.value = true;
      try {
        // Call logout to clear any existing sessions
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
      onNameInput,
      onNamePaste,
    };
  },
});
</script>

<style scoped>
button:hover {
  background-color: rgba(10, 20, 120, 1);
}
</style>
