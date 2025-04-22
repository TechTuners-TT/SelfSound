import { createRouter, createWebHashHistory } from "vue-router";
import AboutView from "../views/AboutView.vue";
import SignInView from "../views/SignInView.vue";
import SignUpView from "../views/SignUpView.vue";
import HomeView from "../views/HomeView.vue";
import UserProfile from "@/views/UserProfile.vue";
import SettingsView from "@/views/SettingsView.vue";
import CreatePostMediaView from "../views/AddPosts/CreatePostMediaView.vue";
import CreatePostAudioView from "../views/AddPosts/CreatePostAudioView.vue";
import CreatePostMusicXMLView from "../views/AddPosts/CreatePostMusicXML.vue";
import CreatePostLyricsView from "../views/AddPosts/CreatePostLyricsView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "about",
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
      path: "/profile",
      name: "profile",
      component: UserProfile,
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
