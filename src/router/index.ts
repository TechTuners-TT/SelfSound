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
      path: "/post-page",
      name: "post-page",
      component: PostPage,
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
    const res = await fetch(`${API_URL}/authorization/me`, {
      method: "GET",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  console.log(`🔍 Router: Navigating from ${from.path} to ${to.path}`);
  console.log(`🔍 Route meta:`, to.meta);

  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  // Skip auth check for routes that don't require it
  if (!requiresAuth) {
    console.log("✅ Router: Public route, proceeding...");
    next();
    return;
  }

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

export default router;
