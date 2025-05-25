<template>
  <div class="relative w-full min-h-screen flex flex-col bg-[#060310]">
    <main class="flex flex-col flex-grow overflow-auto">
      <NavBar />

      <div class="flex-grow max-h-full">
        <div class="relative flex items-start justify-center w-full h-full">
          <div
            class="relative w-full md:w-3/5 xl:w-1/3 bg-black/30 flex flex-col min-h-screen overflow-y-auto"
          >
            <div class="m-[20px]">
              <a href="#home">
                <CloseButton
                  class="cursor-pointer 2xl:w-[25px] 2xl:h-[25px] xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[18px] md:h-[18px] sm:w-[16px] sm:h-[16px] w-[14px] h-[14px]"
                />
              </a>
            </div>

            <div>
              <hr class="border-t border-white/50" />
            </div>

            <div class="mt-2">
              <PostCard :post="mockPost" />
            </div>

            <div class="px-6 mt-7">
              <h3 class="text-white font-semibold text-lg mb-7">Comments</h3>
              <CommentForm @submit="handleNewComment" />
              <CommentList :comments="comments" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import NavBar from "@/components/Navigation/NavBar.vue";
import CloseButton from "@/components/SVG/AddPosts_Icons/CloseIcon.vue";
import PostCard from "../Posts_Feed_Components/PostCard.vue";
import CommentList from "./CommentList.vue";
import CommentForm from "./CommentForm.vue";
import cover from "@/assets/btbt-cover.jpg";

interface AudioTrack {
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  url: string;
}

interface AudioPost {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  role: "Musician" | "Listener" | "Learner";
  avatarUrl: string;
  timestamp: string;
  type: "audio";
  content: AudioTrack[];
}

const mockPost = ref<AudioPost>({
  id: "1",
  userId: "u1",
  username: "user1",
  displayName: "Test User",
  role: "Musician",
  avatarUrl: cover,
  timestamp: "2025-05-24T12:00:00Z",
  type: "audio",
  content: [
    {
      title: "Agust D",
      artist: "Agust D",
      coverUrl: cover,
      duration: "3:50",
      url: "https://example.com/audio/agust-d.mp3",
    },
    {
      title: "Airplane",
      artist: "J-Hope",
      coverUrl: cover,
      duration: "3:35",
      url: "https://example.com/audio/airplane.mp3",
    },
  ],
});

const comments = ref<
  {
    id: string; // змінив з commentId на id
    avatarUrl: string;
    displayName: string;
    username: string;
    role: string;
    text: string;
  }[]
>([]);

function handleNewComment(commentText: string) {
  comments.value.unshift({
    id: Date.now().toString(), // унікальний id замість "1"
    avatarUrl: cover,
    displayName: "Rey",
    username: "user",
    role: "Learner",
    text: commentText,
  });
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: "auto" });
});
</script>
