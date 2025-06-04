<template>
  <main
    class="flex flex-col justify-center items-center px-5 w-full min-h-screen overflow-hidden"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <section class="w-full max-w-sm">
      <header class="mb-6.5 text-2xl font-bold text-center text-white">
        <h1>Log in</h1>
      </header>

      <!-- Debug info for iOS Safari (remove in production) -->
      <div v-if="showDebugInfo" class="mb-4 p-3 bg-gray-800 rounded text-white text-xs">
        <p><strong>URL:</strong> {{ currentUrl }}</p>
        <p><strong>Hash:</strong> {{ currentHash }}</p>
        <p><strong>Device:</strong> iOS Safari: {{ isIOSSafari }}</p>
        <p><strong>Token Status:</strong> {{ tokenStatus }}</p>
        <p><strong>Last Action:</strong> {{ lastAction }}</p>
      </div>

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
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
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
    const showDebugInfo = ref(true); // Set to false in production
    const currentUrl = ref("");
    const currentHash = ref("");
    const tokenStatus = ref("No token");
    const lastAction = ref("Initializing");

    const errors = reactive({
      email: "",
      password: "",
    });

    // Enhanced device detection
    const isIOSSafari = (() => {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('safari') && 
             userAgent.includes('mobile') && 
             !userAgent.includes('chrome') && 
             !userAgent.includes('crios');
    })();

    // iOS Safari specific token manager
    const IOSSafariTokenManager = {
      storeToken(token: string): void {
        lastAction.value = "Storing token";
        console.log("🔐 iOS Safari: Storing token with all methods");
        
        const methods = [];
        
        try {
          localStorage.setItem('authToken', token);
          methods.push('localStorage');
        } catch (e) {
          console.warn("❌ localStorage failed:", e);
        }

        try {
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('auth_session', token);
          methods.push('sessionStorage');
        } catch (e) {
          console.warn("❌ sessionStorage failed:", e);
        }

        try {
          localStorage.setItem('auth_backup', token);
          methods.push('backup');
        } catch (e) {
          console.warn("❌ backup storage failed:", e);
        }

        // Memory storage
        (window as any).__authToken = token;
        methods.push('memory');

        tokenStatus.value = `Stored in: ${methods.join(', ')}`;
        console.log(`✅ Token stored in: ${methods.join(', ')}`);
      },

      getToken(): string | null {
        const sources = [];

        // 1. Check URL first (most important for OAuth)
        const token = this.extractTokenFromUrl();
        if (token) {
          sources.push('URL');
          tokenStatus.value = `Found in URL (${token.substring(0, 20)}...)`;
          return token;
        }

        // 2. localStorage
        try {
          const localToken = localStorage.getItem('authToken');
          if (localToken) {
            sources.push('localStorage');
            tokenStatus.value = `Found in localStorage`;
            return localToken;
          }
        } catch (e) {
          console.warn("localStorage read failed:", e);
        }

        // 3. sessionStorage
        try {
          let sessionToken = sessionStorage.getItem('authToken');
          if (!sessionToken) sessionToken = sessionStorage.getItem('auth_session');
          if (sessionToken) {
            sources.push('sessionStorage');
            tokenStatus.value = `Found in sessionStorage`;
            return sessionToken;
          }
        } catch (e) {
          console.warn("sessionStorage read failed:", e);
        }

        // 4. backup
        try {
          const backupToken = localStorage.getItem('auth_backup');
          if (backupToken) {
            sources.push('backup');
            tokenStatus.value = `Found in backup`;
            return backupToken;
          }
        } catch (e) {
          console.warn("backup read failed:", e);
        }

        // 5. memory
        const memoryToken = (window as any).__authToken;
        if (memoryToken) {
          sources.push('memory');
          tokenStatus.value = `Found in memory`;
          return memoryToken;
        }

        tokenStatus.value = "No token found";
        return null;
      },

      extractTokenFromUrl(): string | null {
        lastAction.value = "Checking URL for token";
        
        // Check multiple URL formats
        const url = window.location.href;
        currentUrl.value = url;
        currentHash.value = window.location.hash;
        
        console.log("🔍 Checking URL for token:", url);

        // Format 1: #/sign-in?token=xxx
        const hashMatch = url.match(/[#&?]token=([^&]+)/);
        if (hashMatch) {
          const token = decodeURIComponent(hashMatch[1]);
          console.log("✅ Found token in hash:", token.substring(0, 50) + "...");
          lastAction.value = "Found token in URL hash";
          return token;
        }

        // Format 2: Check URLSearchParams in hash
        const hashPart = window.location.hash;
        if (hashPart.includes('?')) {
          const queryPart = hashPart.split('?')[1];
          const params = new URLSearchParams(queryPart);
          const token = params.get('token');
          if (token) {
            console.log("✅ Found token in hash params:", token.substring(0, 50) + "...");
            lastAction.value = "Found token in hash params";
            return token;
          }
        }

        // Format 3: Check regular query params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          console.log("✅ Found token in query params:", token.substring(0, 50) + "...");
          lastAction.value = "Found token in query params";
          return token;
        }

        console.log("❌ No token found in URL");
        return null;
      },

      clearToken(): void {
        lastAction.value = "Clearing all tokens";
        try {
          localStorage.removeItem('authToken');
          localStorage.removeItem('auth_backup');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('auth_session');
          delete (window as any).__authToken;
          tokenStatus.value = "All tokens cleared";
          console.log("✅ All tokens cleared");
        } catch (e) {
          console.warn("Token clearing failed:", e);
        }
      }
    };

    // URL monitoring for iOS Safari
    let urlCheckInterval: number;

    const startUrlMonitoring = () => {
      if (isIOSSafari) {
        lastAction.value = "Starting URL monitoring";
        urlCheckInterval = setInterval(() => {
          const token = IOSSafariTokenManager.extractTokenFromUrl();
          if (token) {
            console.log("🎯 URL monitoring found token!");
            IOSSafariTokenManager.storeToken(token);
            
            // Clean URL and redirect
            cleanUrlAndRedirect();
            clearInterval(urlCheckInterval);
          }
        }, 500); // Check every 500ms
      }
    };

    const cleanUrlAndRedirect = async () => {
      lastAction.value = "Cleaning URL and redirecting";
      
      // Clean the URL
      const cleanHash = window.location.hash.split('?')[0];
      window.location.hash = cleanHash;
      
      // Validate token and redirect
      const token = IOSSafariTokenManager.getToken();
      if (token) {
        await validateAndRedirect(token);
      }
    };

    const validateAndRedirect = async (token: string) => {
      try {
        lastAction.value = "Validating token";
        console.log("🔍 Validating token...");
        
        const headers: Record<string, string> = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        if (isIOSSafari) {
          headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
          headers["Pragma"] = "no-cache";
          headers["Expires"] = "0";
        }

        const response = await fetch(`${API_URL}/authorization/me`, {
          method: "GET",
          headers: headers,
          credentials: "include"
        });

        if (response.ok) {
          lastAction.value = "Token valid, redirecting";
          console.log("✅ Token validated successfully, redirecting to home");
          tokenStatus.value = "Valid token, redirecting";
          
          setTimeout(() => {
            router.push("/home");
          }, 100);
        } else {
          lastAction.value = "Token invalid, clearing";
          console.log("❌ Token validation failed");
          IOSSafariTokenManager.clearToken();
        }
      } catch (error) {
        lastAction.value = "Validation error";
        console.error("💥 Token validation error:", error);
        IOSSafariTokenManager.clearToken();
      }
    };

    onMounted(() => {
      lastAction.value = "Component mounted";
      console.log(`📱 iOS Safari detected: ${isIOSSafari}`);
      
      // Start monitoring for iOS Safari
      if (isIOSSafari) {
        startUrlMonitoring();
      }

      // Check for immediate token
      const token = IOSSafariTokenManager.getToken();
      if (token) {
        console.log("🔍 Found existing token on mount");
        validateAndRedirect(token);
      }

      // Handle email verification
      const hash = window.location.hash;
      const query = new URLSearchParams(hash.split("?")[1]);
      
      if (query.get("verified") === "true") {
        alert("✅ Email verified! You can now sign in.");
        window.location.hash = "#/sign-in";
        return;
      }
    });

    onUnmounted(() => {
      if (urlCheckInterval) {
        clearInterval(urlCheckInterval);
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
      lastAction.value = "Submitting login form";

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (isIOSSafari) {
          headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
          headers["Pragma"] = "no-cache";
          headers["Expires"] = "0";
        }

        const response = await fetch(`${API_URL}/authorization/logindefault`, {
          method: "POST",
          credentials: "include",
          headers: headers,
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

        if (data.access_token) {
          IOSSafariTokenManager.storeToken(data.access_token);
          await validateAndRedirect(data.access_token);
        }
        
      } catch (error) {
        console.error("💥 Login error:", error);
        alert("Login error. Please try again.");
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleLogin = () => {
      lastAction.value = "Starting Google OAuth";
      const currentUrl = window.location.href;
      
      const redirectState = encodeURIComponent(
        currentUrl.replace('#/sign-in', '#/sign-in?oauth=complete')
      );
      
      const params = new URLSearchParams({
        state: redirectState,
        mobile: 'true',
        ios: isIOSSafari ? 'true' : 'false'
      });
      
      window.location.href = `${API_URL}/auth/login?${params.toString()}`;
    };

    const handleGuestLogin = async () => {
      isLoading.value = true;
      lastAction.value = "Guest login";
      try {
        IOSSafariTokenManager.clearToken();
        
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });

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
      showDebugInfo,
      currentUrl,
      currentHash,
      tokenStatus,
      lastAction,
      isIOSSafari,
      handleSubmit,
      handleGoogleLogin,
      handleGuestLogin,
      handleSignUp,
    };
  },
});
</script>
