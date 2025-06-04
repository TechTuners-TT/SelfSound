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

    // Device detection
    const isIOSSafari = (() => {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('safari') && 
             userAgent.includes('mobile') && 
             !userAgent.includes('chrome') && 
             !userAgent.includes('crios');
    })();

    // FIXED: Store token with correct key names that PostFeed expects
    const storeToken = (token: string) => {
      try {
        // PRIMARY: Use the same key as PostFeed expects
        localStorage.setItem('access_token', token);
        sessionStorage.setItem('access_token', token);
        
        // BACKUP: Keep old keys for compatibility
        localStorage.setItem('authToken', token);
        sessionStorage.setItem('authToken', token);
        localStorage.setItem('auth_backup', token);
        
        // MOBILE FALLBACK: Set cookie for mobile compatibility
        document.cookie = `access_token=${token}; path=/; secure; samesite=lax; max-age=86400`;
        
        console.log('✅ Token stored successfully:', token.substring(0, 20) + '...');
        console.log('📱 iOS Safari detected:', isIOSSafari);
      } catch (e) {
        console.warn("Token storage failed:", e);
        (window as any).__authToken = token;
        (window as any).__access_token = token;
      }
    };

    const clearTokens = () => {
      try {
        // Clear all possible token storage locations
        localStorage.removeItem('access_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth_backup');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('authToken');
        
        // Clear cookies
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        delete (window as any).__authToken;
        delete (window as any).__access_token;
        console.log('🗑️ All tokens cleared');
      } catch (e) {
        console.warn("Token clearing failed:", e);
      }
    };

    onMounted(() => {
      console.log(`📱 SignIn page loaded - iOS Safari: ${isIOSSafari}`);
      console.log(`🌐 API URL: ${API_URL}`);
      
      // Handle email verification
      const hash = window.location.hash;
      const query = new URLSearchParams(hash.split("?")[1]);
      
      if (query.get("verified") === "true") {
        alert("✅ Email verified! You can now sign in.");
        window.location.hash = "#/sign-in";
        return;
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
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // ENHANCED: Better mobile headers
        if (isIOSSafari) {
          headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
          headers["Pragma"] = "no-cache";
          headers["Expires"] = "0";
          headers["X-Requested-With"] = "XMLHttpRequest";
        }

        console.log(`🚀 Attempting login to: ${API_URL}/authorization/logindefault`);

        const response = await fetch(`${API_URL}/authorization/logindefault`, {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        console.log(`📡 Response status: ${response.status}`);

        const data = await response.json();
        console.log(`📊 Response data:`, data);

        if (!response.ok) {
          console.error(`❌ Login failed:`, data);
          alert(data.detail || data.message || "Login failed");
          return;
        }

        // ENHANCED: Better token handling
        if (data.access_token) {
          storeToken(data.access_token);
          
          // DEBUGGING: Verify token storage
          const storedToken = localStorage.getItem('access_token');
          console.log(`🔍 Token verification - Stored: ${storedToken ? storedToken.substring(0, 20) + '...' : 'NONE'}`);
          
          if (!storedToken) {
            console.error('❌ Token storage failed!');
            alert('Login successful but token storage failed. Please try again.');
            return;
          }
        } else {
          console.error('❌ No access token in response');
          alert('Login failed: No access token received');
          return;
        }

        console.log("✅ Login successful, redirecting to home");
        
        // WAIT a moment to ensure token is stored before navigation
        setTimeout(() => {
          router.push("/home");
        }, 100);
        
      } catch (error) {
        console.error("💥 Login error:", error);
        alert("Network error. Please check your connection and try again.");
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleLogin = () => {
      const redirectState = encodeURIComponent(
        "https://techtuners-tt.github.io/SelfSound/#/sign-in"
      );
      
      const params = new URLSearchParams({
        state: redirectState,
        mobile: 'true',
        ios: isIOSSafari ? 'true' : 'false'
      });
      
      console.log("🔍 Starting Google OAuth login");
      console.log(`🔗 Redirect URL: ${API_URL}/auth/login?${params.toString()}`);
      window.location.href = `${API_URL}/auth/login?${params.toString()}`;
    };

    const handleGuestLogin = async () => {
      isLoading.value = true;
      try {
        clearTokens();
        
        // ENHANCED: Better guest mode handling
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (logoutError) {
          console.warn("Logout error (ignored for guest mode):", logoutError);
        }

        console.log("👤 Guest mode activated");
        router.push("/home");
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
