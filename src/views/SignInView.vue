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
          placeholder="Enter email"
        />

        <LoginFormInput
          id="password"
          label="Password"
          type="password"
          v-model="password"
          :error="errors.password"
          placeholder="Enter password"
        />

        <LoginFormButton
          type="submit"
          marginClass="mb-4.5 mt-7.5"
          :disabled="isLoading"
        >
          {{ isLoading ? "Signing In..." : "Sign In" }}
        </LoginFormButton>

        <LoginFormDivider text="or continue with" />

        <LoginFormButton
          type="button"
          @click="handleGoogleLogin"
          marginClass="mb-4.5"
          :hasIcon="true"
          :disabled="isLoading"
        >
          <template #icon>
            <GoogleIcon />
          </template>
          Google
        </LoginFormButton>

        <LoginFormButton
          type="button"
          @click="handleGuestLogin"
          marginClass="mb-4.5"
          :disabled="isLoading"
        >
          Guest mode
        </LoginFormButton>

        <p class="text-base font-semibold text-center text-white">
          <router-link
            to="/sign-up"
            @click.prevent="handleSignUp"
            class="hover:text-indigo-600"
          >
            Don't have a profile? Sign up here!
          </router-link>
        </p>
      </form>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
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
    const API_URL = import.meta.env.VITE_API_URL;
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);

    const errors = reactive({
      email: "",
      password: "",
    });

    // ✅ Handle verification success and Google OAuth mobile callback
    onMounted(() => {
      const hash = window.location.hash;
      const query = new URLSearchParams(hash.split("?")[1]);
      
      // Handle email verification success
      if (query.get("verified") === "true") {
        alert("✅ Email verified! You can now sign in.");
        window.location.hash = "#/sign-in";
        return;
      }

      // 📱 Handle Google OAuth mobile callback with token
      const token = query.get("token");
      if (token) {
        console.log("📱 Google OAuth mobile callback: storing token");
        localStorage.setItem('authToken', token);
        
        // Clean up URL and redirect to home
        window.location.hash = "#/home";
        router.push("/home");
      }
    });

    const validateForm = (): boolean => {
      let isValid = true;
      errors.email = "";
      errors.password = "";

      if (!email.value) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }

      if (!password.value) {
        errors.password = "Password is required";
        isValid = false;
      } else if (password.value.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      isLoading.value = true;

      try {
        const response = await fetch(`${API_URL}/authorization/logindefault`, {
          method: "POST",
          credentials: "include", // This handles cookies for web
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || data.message || "Login failed");
          return;
        }

        // 📱 MOBILE AUTH: Store token for mobile use
        if (data.access_token) {
          localStorage.setItem('authToken', data.access_token);
          console.log("📱 Storing auth token for mobile use");
        } else {
          console.log("🍪 Using cookie-based auth (web)");
        }

        // ✅ Login successful
        console.log("✅ Login successful, redirecting to home");
        
        setTimeout(() => {
          router.push("/home");
        }, 100);
        
      } catch (error) {
        console.error("Login error:", error);
        alert("Login error. Please try again.");
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleLogin = () => {
      // For mobile callbacks, we need to handle the redirect with token
      const currentUrl = window.location.href;
      const redirectState = encodeURIComponent(currentUrl.replace('#/sign-in', '#/sign-in'));
      
      console.log("🔍 Initiating Google OAuth login");
      window.location.href = `${API_URL}/auth/login?state=${redirectState}`;
    };

    const handleGuestLogin = async () => {
      isLoading.value = true;
      try {
        // Clear any existing auth data
        localStorage.removeItem('authToken');
        
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });

        console.log("👤 Guest mode activated");
        await router.push("/home");
      } catch (error) {
        console.error("Guest login error:", error);
        alert("Guest login error. Please try again.");
      } finally {
        isLoading.value = false;
      }
    };

    const handleSignUp = () => {
      router.push("/sign-up");
    };

    return {
      email,
      password,
      isLoading,
      errors,
      handleSubmit,
      handleGoogleLogin,
      handleGuestLogin,
      handleSignUp,
    };
  },
});
</script>
