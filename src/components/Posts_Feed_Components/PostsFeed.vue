<template>
  <div>
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PostCard from "@/components/Posts_Feed_Components/PostCard.vue";

// імпорт медіа з assets
import agustD from "@/assets/02. Agust D.mp3";
import btbtCover from "@/assets/btbt-cover.jpg";
import symphonyXml from "@/assets/XML.pdf";
import sampleImage from "@/assets/sampleImage.jpg";
import sampleVideo from "@/assets/sampleVideo.mp4";
import jHope from "@/assets/06.  Airplane.mp3";

interface PostBase {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  role: "Musician" | "Listener" | "Learner";
  avatarUrl: string;
  timestamp: string;
  type: "audio" | "musicxml" | "media" | "lyrics";
}

interface AudioPost extends PostBase {
  type: "audio";
  content: {
    title: string;
    artist: string;
    coverUrl: string;
    duration: string;
    url: string;
  }[];
}

interface XmlPost extends PostBase {
  type: "musicxml";
  content: {
    fileName: string;
    composer: string;
    downloadUrl: string;
  }[];
}

interface MediaPost extends PostBase {
  type: "media";
  content: {
    mediaType: "media";
    items: {
      src: string;
      type: "image" | "video";
    }[];
  };
}

interface LyricsPost extends PostBase {
  type: "lyrics";
  content: {
    title: string;
    artist: string;
    lyricsText: string;
  };
}

type FeedPost = AudioPost | XmlPost | MediaPost | LyricsPost;

const posts = ref<FeedPost[]>([]);

onMounted(() => {
  posts.value = [
    {
      id: "1",
      userId: "u1",
      username: "user1",
      displayName: "R_Valt",
      role: "Listener",
      avatarUrl: btbtCover,
      timestamp: "2h ago",
      type: "audio",
      content: [
        {
          title: "BTBT",
          artist: "B.I, Soulja Boy, DeVita",
          coverUrl: btbtCover,
          duration: "4:05",
          url: agustD,
        },
        {
          title: "Airplane",
          artist: "J-Hope",
          coverUrl: btbtCover,
          duration: "3:50",
          url: jHope,
        },
      ],
    },
    {
      id: "2",
      userId: "u2",
      username: "user2",
      displayName: "Rey",
      role: "Learner",
      avatarUrl: btbtCover,
      timestamp: "3h ago",
      type: "musicxml",
      content: [
        {
          fileName: "symphony_no9.musicxml",
          composer: "John Williams",
          downloadUrl: symphonyXml,
        },
        {
          fileName: "symphony_no9.musicxml",
          composer: "John Williams",
          downloadUrl: symphonyXml,
        },
      ],
    },
    {
      id: "3",
      userId: "u3",
      username: "user3",
      displayName: "MediaMaster",
      role: "Musician",
      avatarUrl: sampleImage,
      timestamp: "5h ago",
      type: "media",
      content: {
        mediaType: "media",
        items: [
          { src: sampleVideo, type: "video" },
          { src: sampleImage, type: "image" },
          { src: sampleVideo, type: "video" },
          { src: sampleImage, type: "image" },
        ],
      },
    },
    {
      id: "4",
      userId: "u4",
      username: "user4",
      displayName: "Lyricist",
      role: "Musician",
      avatarUrl: sampleImage,
      timestamp: "1d ago",
      type: "lyrics",
      content: {
        title: "Ode to Code",
        artist: "something here",
        lyricsText: `Roses are #FF0000, 
Violets are #0000FF, 
I write my Vue in TypeScript, 
And so can you!`,
      },
    },
  ];
});
</script>
