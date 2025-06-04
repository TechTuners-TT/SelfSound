<template>
  <main
    class="flex flex-col justify-center items-center px-5 w-full min-h-screen overflow-hidden"
    style="background-color: rgba(6, 3, 16, 1)"
  >
    <section class="w-full max-w-sm">
      <header class="mb-6.5 text-2xl font-bold text-center text-white">
        <h1>Log in</h1>
      </header>

      <!-- iOS Safari Debug Info (remove in production) -->
      <div v-if="showDebugInfo" class="mb-4 p-3 bg-gray-800 rounded text-white text-xs">
        <p>Device: {{ deviceInfo.userAgent }}</p>
        <p>Mobile: {{ deviceInfo.isMobile }}</p>
        <p>iOS Safari: {{ deviceInfo.isIOSSafari }}</p>
        <p>Token Found: {{ !!currentToken }}</p>
        <p>Token Source: {{ tokenSource }}</p>
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
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import LoginFormInput from "@/components/Authentication/LoginFormInput.vue";
import LoginFormButton from "@/components/Authentication/LoginFormButton.vue";
import LoginFormDivider from "@/components/Authentication/LoginFormDivider.vue";
import GoogleIcon from "@/components/SVG/Authentication/Sign_Up_In_If_button_Google.vue";
import { MobileAuthStorage } from "@/router";

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
    const currentToken = ref<string | null>(null);
    const tokenSource = ref<string>("");
    const showDebugInfo = ref(false); // Set to true for debugging

    const errors = reactive({
      email: "",
      password: "",
    });

    // Enhanced device detection
    const deviceInfo = reactive({
      userAgent: navigator.userAgent,
      isMobile: false,
      isIOSSafari: false,
    });

    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      deviceInfo.isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
      deviceInfo.isIOSSafari = userAgent.includes('safari') && 
                               userAgent.includes('mobile') && 
                               !userAgent.includes('chrome') && 
                               !userAgent.includes('crios');
    };

    // iOS Safari specific token handling
    const IOSSafariTokenManager = {
      // Store token with multiple strategies for iOS Safari
      storeToken(token: string): void {
        console.log("🔐 iOS Safari: Storing token with multiple strategies");
        
        try {
          // Strategy 1: Standard localStorage
          localStorage.setItem('authToken', token);
          console.log("✅ Stored in localStorage");
        } catch (e) {
          console.warn("❌ localStorage failed:", e);
        }

        try {
          // Strategy 2: sessionStorage (more reliable on iOS Safari)
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('auth_session', token);
          console.log("✅ Stored in sessionStorage");
        } catch (e) {
          console.warn("❌ sessionStorage failed:", e);
        }

        try {
          // Strategy 3: Multiple backup keys
          localStorage.setItem('auth_backup', token);
          localStorage.setItem('user_token', token);
          console.log("✅ Stored backup tokens");
        } catch (e) {
          console.warn("❌ Backup storage failed:", e);
        }

        // Strategy 4: Store in memory as last resort
        (window as any).__authToken = token;
        console.log("✅ Stored in window memory");

        // Strategy 5: Try to store in document.cookie as fallback
        try {
          document.cookie = `authToken=${token}; path=/; max-age=86400; secure; samesite=lax`;
          console.log("✅ Stored in document.cookie");
        } catch (e) {
          console.warn("❌ Cookie storage failed:", e);
        }
      },

      // Retrieve token with multiple strategies
      getToken(): string | null {
        console.log("🔍 iOS Safari: Retrieving token with multiple strategies");
        
        // Strategy 1: Check URL parameters first (OAuth callback)
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const urlToken = urlParams.get('token');
        if (urlToken) {
          console.log("✅ Found token in URL parameters");
          this.storeToken(urlToken); // Store it for future use
          // Clean URL
          window.location.hash = window.location.hash.split('?')[0];
          tokenSource.value = "url_params";
          return urlToken;
        }

        // Strategy 2: Standard localStorage
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            console.log("✅ Found token in localStorage");
            tokenSource.value = "localStorage";
            return token;
          }
        } catch (e) {
          console.warn("❌ localStorage read failed:", e);
        }

        // Strategy 3: sessionStorage
        try {
          let token = sessionStorage.getItem('authToken');
          if (!token) token = sessionStorage.getItem('auth_session');
          if (token) {
            console.log("✅ Found token in sessionStorage");
            tokenSource.value = "sessionStorage";
            return token;
          }
        } catch (e) {
          console.warn("❌ sessionStorage read failed:", e);
        }

        // Strategy 4: Backup keys
        try {
          let token = localStorage.getItem('auth_backup');
          if (!token) token = localStorage.getItem('user_token');
          if (token) {
            console.log("✅ Found token in backup storage");
            tokenSource.value = "backup";
            return token;
          }
        } catch (e) {
          console.warn("❌ Backup storage read failed:", e);
        }

        // Strategy 5: Memory fallback
        const memoryToken = (window as any).__authToken;
        if (memoryToken) {
          console.log("✅ Found token in memory");
          tokenSource.value = "memory";
          return memoryToken;
        }

        // Strategy 6: Check document.cookie
        try {
          const cookies = document.cookie.split(';');
          for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'authToken' && value) {
              console.log("✅ Found token in document.cookie");
              tokenSource.value = "cookie";
              return value;
            }
          }
        } catch (e) {
          console.warn("❌ Cookie read failed:", e);
        }

        console.log("❌ No token found in any location");
        tokenSource.value = "none";
        return null;
      },

      // Clear all token storage
      clearToken(): void {
        console.log("🗑️ iOS Safari: Clearing all token storage");
        
        try {
          localStorage.removeItem('authToken');
          localStorage.removeItem('auth_backup');
          localStorage.removeItem('user_token');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('auth_session');
          delete (window as any).__authToken;
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          console.log("✅ All token storage cleared");
        } catch (e) {
          console.warn("❌ Token clearing failed:", e);
        }
      }
    };

    // Enhanced OAuth and verification handling
    onMounted(() => {
      detectDevice();
      console.log(`📱 Device detected - Mobile: ${deviceInfo.isMobile}, iOS Safari: ${deviceInfo.isIOSSafari}`);
      
      // Check for existing token
      currentToken.value = IOSSafariTokenManager.getToken();
      
      const hash = window.location.hash;
      const query = new URLSearchParams(hash.split("?")[1]);
      
      // Handle email verification success
      if (query.get("verified") === "true") {
        alert("✅ Email verified! You can now sign in.");
        window.location.hash = "#/sign-in";
        return;
      }

      // Enhanced iOS Safari OAuth callback handling
      const token = query.get("token");
      if (token) {
        console.log("📱 iOS Safari OAuth callback: processing token");
        IOSSafariTokenManager.storeToken(token);
        currentToken.value = token;
        
        // Immediate validation and redirect
        validateAndRedirect(token);
      }

      // If we have a token, try to validate it
      if (currentToken.value) {
        console.log("🔍 Found existing token, validating...");
        validateAndRedirect(currentToken.value);
      }
    });

    const validateAndRedirect = async (token: string) => {
      try {
        console.log("🔍 Validating token...");
        
        const headers: Record<string, string> = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        // iOS Safari specific headers
        if (deviceInfo.isIOSSafari) {
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
          console.log("✅ Token validated successfully, redirecting to home");
          // Clean up URL and redirect to home
          window.location.hash = "#/home";
          setTimeout(() => {
            router.push("/home");
          }, 100);
        } else {
          console.log("❌ Token validation failed, clearing and staying on sign-in");
          IOSSafariTokenManager.clearToken();
          currentToken.value = null;
          
          if (response.status === 401) {
            console.log("Token expired or invalid");
          }
        }
      } catch (error) {
        console.error("💥 Token validation error:", error);
        IOSSafariTokenManager.clearToken();
        currentToken.value = null;
      }
    };

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
        console.log(`📱 Login attempt - Mobile: ${deviceInfo.isMobile}, iOS Safari: ${deviceInfo.isIOSSafari}`);

        // Enhanced request headers
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // iOS Safari specific headers
        if (deviceInfo.isIOSSafari) {
          headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
          headers["Pragma"] = "no-cache";
          headers["Expires"] = "0";
        }

        const requestConfig: RequestInit = {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        };

        const response = await fetch(`${API_URL}/authorization/logindefault`, requestConfig);

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || data.message || "Login failed");
          return;
        }

        // Enhanced iOS Safari token handling
        if (data.access_token) {
          console.log("📱 iOS Safari: Storing auth token");
          IOSSafariTokenManager.storeToken(data.access_token);
          currentToken.value = data.access_token;
          
          // Immediate validation for iOS Safari
          if (deviceInfo.isIOSSafari) {
            await validateAndRedirect(data.access_token);
            return;
          }
        }

        // ✅ Login successful
        console.log("✅ Login successful, redirecting to home");
        
        const redirectDelay = deviceInfo.isMobile ? 300 : 100;
        setTimeout(() => {
          router.push("/home");
        }, redirectDelay);
        
      } catch (error) {
        console.error("💥 Login error:", error);
        alert("Login error. Please try again.");
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleLogin = () => {
      // Enhanced Google OAuth for iOS Safari
      const currentUrl = window.location.href;
      
      let redirectState;
      if (deviceInfo.isMobile) {
        redirectState = encodeURIComponent(currentUrl.replace('#/sign-in', '#/sign-in?mobile=true'));
      } else {
        redirectState = encodeURIComponent(currentUrl.replace('#/sign-in', '#/sign-in'));
      }
      
      console.log(`🔍 Initiating Google OAuth login (iOS Safari: ${deviceInfo.isIOSSafari})`);
      
      const params = new URLSearchParams({
        state: redirectState,
        mobile: deviceInfo.isMobile ? 'true' : 'false',
        ios: deviceInfo.isIOSSafari ? 'true' : 'false'
      });
      
      window.location.href = `${API_URL}/auth/login?${params.toString()}`;
    };

    const handleGuestLogin = async () => {
      isLoading.value = true;
      try {
        // Clear any existing auth data
        IOSSafariTokenManager.clearToken();
        currentToken.value = null;
        
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
      deviceInfo,
      currentToken,
      tokenSource,
      showDebugInfo,
      handleSubmit,
      handleGoogleLogin,
      handleGuestLogin,
      handleSignUp,
    };
  },
});
</script>
