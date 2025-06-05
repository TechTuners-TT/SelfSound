import { createRouter, createWebHashHistory } from "vue-router";

import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";
import SearchView from "../views/SearchView.vue";
import SettingsView from "../views/SettingsView.vue";
import SignInView from "../views/SignInView.vue";
import SignUpView from "../views/SignUpView.vue";
import UserProfile from "../views/UserProfile.vue";

import CreatePostAudioView from "../views/AddPosts/CreatePostAudioView.vue";
import CreatePostLyricsView from "../views/AddPosts/CreatePostLyricsView.vue";
import CreatePostMediaView from "../views/AddPosts/CreatePostMediaView.vue";
import CreatePostMusicXMLView from "../views/AddPosts/CreatePostMusicXML.vue";
import AnotherUserProfile from "@/views/AnotherUserProfile.vue";
import NotificationsViev from "@/views/NotificationsViev.vue";
import PremiumAboutView from "@/views/PremiumAboutView.vue";
import SupportView from "@/views/SupportView.vue";
import AboutUsView from "@/views/AboutUsView.vue";
import ForAdvertisersView from "@/views/ForAdvertisersView.vue";
import TermsOfUseView from "@/views/TermsOfUseView.vue";
import SocialsInstagramView from "@/views/SocialsInstagramView.vue";
import SocialsDiscordView from "@/views/SocialsDiscordView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";
import AdminComplainsView from "@/views/AdminAnalytics/AdminComplainsView.vue";
import AdminAnalyticsView from "@/views/AdminAnalytics/AdminAnalyticsView.vue";
import PremiumView from "@/views/PremiumView.vue";
import VerifyPage from "@/views/VerifyPageView.vue";
import PostPage from "@/components/Posts_Feed_Components/PostPage.vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Enhanced mobile detection
function isMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "mobile",
    "android",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
  ];
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

function isIOSSafari(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes("safari") &&
    userAgent.includes("mobile") &&
    !userAgent.includes("chrome") &&
    !userAgent.includes("crios")
  );
}

// Enhanced token storage for mobile compatibility
class MobileAuthStorage {
  private static readonly TOKEN_KEY = "authToken";
  private static readonly BACKUP_KEY = "auth_backup";
  private static readonly SESSION_KEY = "auth_session";

  static setToken(token: string): void {
    try {
      // Primary storage
      localStorage.setItem(this.TOKEN_KEY, token);

      // Backup storage for iOS Safari
      sessionStorage.setItem(this.SESSION_KEY, token);

      // Additional backup in a different key
      localStorage.setItem(this.BACKUP_KEY, token);

      console.log(
        "📱 Token stored in multiple locations for mobile compatibility",
      );
    } catch (error) {
      console.error("❌ Failed to store auth token:", error);
      // If localStorage fails, try sessionStorage only
      try {
        sessionStorage.setItem(this.SESSION_KEY, token);
        console.log("📱 Fallback: Token stored in sessionStorage only");
      } catch (sessionError) {
        console.error("❌ Failed to store token in any storage:", sessionError);
      }
    }
  }

  static getToken(): string | null {
    try {
      // Try primary storage first
      let token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        console.log("📱 Token retrieved from primary localStorage");
        return token;
      }

      // Try backup storage
      token = sessionStorage.getItem(this.SESSION_KEY);
      if (token) {
        console.log("📱 Token retrieved from sessionStorage backup");
        // Restore to primary if found in backup
        this.setToken(token);
        return token;
      }

      // Try additional backup
      token = localStorage.getItem(this.BACKUP_KEY);
      if (token) {
        console.log("📱 Token retrieved from backup localStorage");
        this.setToken(token);
        return token;
      }

      console.log("📱 No token found in any storage location");
      return null;
    } catch (error) {
      console.error("❌ Failed to retrieve auth token:", error);
      return null;
    }
  }

  static clearToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
      console.log("🗑️ All auth tokens cleared");
    } catch (error) {
      console.error("❌ Failed to clear auth tokens:", error);
    }
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }
}

// 🔥 CRITICAL: OAuth token capture function
function captureTokenFromUrl(): string | null {
  const url = window.location.href;
  console.log("🔍 OAuth: Checking URL for token:", url);

  // Extract token from URL using multiple patterns
  const tokenPatterns = [
    /[?&]token=([^&\s#]+)/, // ?token=xxx or &token=xxx
    /#.*[?&]token=([^&\s#]+)/, // #/path?token=xxx
    /token=([^&\s#]+)/, // fallback: any token=xxx
  ];

  for (const pattern of tokenPatterns) {
    const tokenMatch = url.match(pattern);
    if (tokenMatch) {
      const token = decodeURIComponent(tokenMatch[1]);
      console.log(
        "✅ OAuth: Found token in URL:",
        token.substring(0, 50) + "...",
      );

      // Store token using enhanced storage
      MobileAuthStorage.setToken(token);

      // Clean URL to remove token
      const cleanUrl = url.replace(/[?&]token=[^&\s#]+/, "");
      window.history.replaceState({}, "", cleanUrl);
      console.log("✅ OAuth: URL cleaned:", cleanUrl);

      return token;
    }
  }

  console.log("📝 OAuth: No token found in URL");
  return null;
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes - accessible to everyone
    {
      path: "/about-selfsound",
      name: "about selfsound",
      component: AboutView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/post/:postId",
      name: "PostPage",
      component: PostPage,
      props: true,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/user/:userId",
      name: "AnotherUserProfile",
      component: AnotherUserProfile,
      props: true,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/another-user-rofile",
      name: "another-user-rofile",
      component: AnotherUserProfile,
      meta: { requiresAuth: false, guestAllowed: true },
    },

    // Auth routes - allow access even if authenticated
    {
      path: "/sign-in",
      name: "sign in",
      component: SignInView,
      meta: { requiresAuth: false },
    },
    {
      path: "/sign-up",
      name: "sign up",
      component: SignUpView,
      meta: { requiresAuth: false },
    },
    {
      path: "/verify",
      name: "verify",
      component: VerifyPage,
      meta: { requiresAuth: false },
    },

    // Protected routes - require authentication
    {
      path: "/profile",
      name: "profile",
      component: UserProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-post-media",
      name: "add-post-media",
      component: CreatePostMediaView,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-post-audio",
      name: "add-post-audio",
      component: CreatePostAudioView,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-post-musicxml",
      name: "add-post-musicxml",
      component: CreatePostMusicXMLView,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-post-lyrics",
      name: "add-post-lyrics",
      component: CreatePostLyricsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/notifications",
      name: "notifications",
      component: NotificationsViev,
      meta: { requiresAuth: true },
    },

    // Additional public pages
    {
      path: "/premium",
      name: "premium",
      component: PremiumAboutView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/support",
      name: "support",
      component: SupportView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/about-us",
      name: "about-us",
      component: AboutUsView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/advertisers",
      name: "advertisers",
      component: ForAdvertisersView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/terms",
      name: "terms",
      component: TermsOfUseView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/socials/instagram",
      name: "socials/instagram",
      component: SocialsInstagramView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/socials/discord",
      name: "socials/discord",
      component: SocialsDiscordView,
      meta: { requiresAuth: false, guestAllowed: true },
    },
    {
      path: "/privacy",
      name: "privacy",
      component: PrivacyPolicyView,
      meta: { requiresAuth: false, guestAllowed: true },
    },

    // Premium routes - require authentication
    {
      path: "/your_premium",
      name: "your_premium",
      component: PremiumView,
      meta: { requiresAuth: true },
    },

    // Admin routes - require authentication AND admin privileges
    {
      path: "/admin/a",
      name: "admin/a",
      component: AdminAnalyticsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/c",
      name: "admin/c",
      component: AdminComplainsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // Redirect /admin to /admin/a
    {
      path: "/admin",
      redirect: "/admin/a",
    },

    // Default redirect
    {
      path: "/",
      redirect: "/home",
    },

    {
      path: "/profile/:userId",
      name: "Profile",
      component: () => import("@/views/AnotherUserProfile.vue"),
    },
  ],
});

async function checkAuth(): Promise<boolean> {
  try {
    const isMobile = isMobileDevice();
    const isIOS = isIOSSafari();

    console.log(
      `📱 Device detection - Mobile: ${isMobile}, iOS Safari: ${isIOS}`,
    );

    // Get token using enhanced storage
    const authToken = MobileAuthStorage.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("📱 Router: Using stored auth token for check");
    } else {
      console.log(
        "🍪 Router: No stored token, relying on cookies for auth check",
      );
    }

    // Enhanced fetch with better mobile compatibility
    const requestConfig: RequestInit = {
      method: "GET",
      headers: headers,
      credentials: "include", // Keep for cookie fallback
    };

    // For iOS Safari, add additional headers to prevent caching issues
    if (isIOS) {
      headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      headers["Pragma"] = "no-cache";
      headers["Expires"] = "0";
    }

    const res = await fetch(`${API_URL}/authorization/me`, requestConfig);

    const authMethod = authToken ? "header" : "cookie";
    console.log(
      `🔍 Router: Auth check response status: ${res.status} via ${authMethod}`,
    );

    if (!res.ok && authToken) {
      // If header auth failed, clear invalid token
      console.log("🗑️ Router: Clearing invalid auth token");
      MobileAuthStorage.clearToken();
    }

    return res.ok;
  } catch (error) {
    console.error("💥 Router: Auth check error:", error);
    // Clear potentially corrupted token on error
    MobileAuthStorage.clearToken();
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  console.log(`🔍 Router: Navigating from ${from.path} to ${to.path}`);
  console.log(`🔍 Route meta:`, to.meta);

  // 🔥 CRITICAL: Check for OAuth token in URL FIRST (before any auth checks)
  const urlToken = captureTokenFromUrl();
  if (urlToken) {
    console.log("🎯 OAuth: Token captured from URL and stored");
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  // Skip auth check for routes that don't require it
  if (!requiresAuth) {
    console.log("✅ Router: Public route, proceeding...");
    next();
    return;
  }

  console.log(`🔐 Router: Protected route ${to.path} requires authentication`);
  const isAuthenticated = await checkAuth();
  console.log(`🔍 Router: Is authenticated? ${isAuthenticated}`);

  if (requiresAuth && !isAuthenticated) {
    console.log("❌ Router: Authentication required, redirecting to sign-in");
    next("/sign-in");
    return;
  }

  // For admin routes, the admin guard will handle the additional checks
  if (requiresAdmin) {
    console.log(
      "🔒 Router: Admin route detected, letting admin guard handle it...",
    );
    next();
    return;
  }

  console.log("✅ Router: Authenticated user, proceeding...");
  next();
});

// Export the enhanced storage for use in components
export { MobileAuthStorage, isMobileDevice, isIOSSafari };
export default router;
