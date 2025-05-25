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

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/about-selfsound",
      name: "about selfsound",
      component: AboutView,
    },
    {
      path: "/sign-in",
      name: "sign in",
      component: SignInView,
    },
    {
      path: "/sign-up",
      name: "sign up",
      component: SignUpView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },

    {
      path: "/post-page",
      name: "post-page",
      component: PostPage,
    },
    {
      path: "/profile",
      name: "profile",
      component: UserProfile,
    },
    {
      path: "/another-user-rofile",
      name: "another-user-rofile",
      component: AnotherUserProfile,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
    {
      path: "/add-post-media",
      name: "add-post-media",
      component: CreatePostMediaView,
    },
    {
      path: "/add-post-audio",
      name: "add-post-audio",
      component: CreatePostAudioView,
    },
    {
      path: "/add-post-musicxml",
      name: "add-post-musicxml",
      component: CreatePostMusicXMLView,
    },
    {
      path: "/add-post-lyrics",
      name: "add-post-lyrics",
      component: CreatePostLyricsView,
    },

    {
      path: "/search",
      name: "search",
      component: SearchView,
    },
    {
      path: "/notifications",
      name: "notifications",
      component: NotificationsViev,
    },
    {
      path: "/premium",
      name: "premium",
      component: PremiumAboutView,
    },
    {
      path: "/support",
      name: "support",
      component: SupportView,
    },
    {
      path: "/about-us",
      name: "about-us",
      component: AboutUsView,
    },
    {
      path: "/advertisers",
      name: "advertisers",
      component: ForAdvertisersView,
    },
    {
      path: "/terms",
      name: "terms",
      component: TermsOfUseView,
    },
    {
      path: "/socials/instagram",
      name: "socials/instagram",
      component: SocialsInstagramView,
    },
    {
      path: "/socials/discord",
      name: "socials/discord",
      component: SocialsDiscordView,
    },
    {
      path: "/privacy",
      name: "privacy",
      component: PrivacyPolicyView,
    },
    {
      path: "/admin/a",
      name: "admin/a",
      component: AdminAnalyticsView,
    },
    {
      path: "/admin/c",
      name: "admin/c",
      component: AdminComplainsView,
    },
    {
      path: "/your_premium",
      name: "your_premium",
      component: PremiumView,
    },
    {
      path: "/verify",
      name: "verify",
      component: VerifyPage,
    },

    //{
    //  path: "/about",
    //  name: "about",
    //  // route level code-splitting
    //  // this generates a separate chunk (About.[hash].js) for this route
    //  // which is lazy-loaded when the route is visited.
    //  component: () => import("../views/AboutView.vue"),
    //},
  ],
});

export default router;
