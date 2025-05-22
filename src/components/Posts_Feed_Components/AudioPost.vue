<template>
  <div
    v-for="(track, index) in content"
    :key="index"
    class="relative bg-[#000C9C]/40 rounded-[10px] p-5 mb-4 text-white"
  >
    <!-- HEADER -->
    <div class="flex items-center mb-4">
      <div class="w-16 h-16 rounded-[10px] overflow-hidden mr-4">
        <img
          v-if="track.coverUrl"
          :src="track.coverUrl"
          alt="Cover"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-white/50 flex items-center justify-center"
        >
          <AudioCover />
        </div>
      </div>

      <div class="flex flex-col truncate w-1/2">
        <p class="font-medium truncate text-lg">
          {{ track.title }}
        </p>
        <p class="truncate text-sm text-white/50">
          {{ track.artist }}
        </p>
      </div>

      <button
        @click="togglePlay(index)"
        class="ml-auto w-10 h-10 rounded-full bg-[#6D01D0] flex items-center justify-center cursor-pointer"
      >
        <PlayPauseIcon :isPlaying="isPlaying[index]" />
      </button>
    </div>

    <!-- TIMELINE -->
    <div class="flex items-center gap-2 text-sm">
      <span>{{ formatTime(currentTime[index]) }}</span>
      <input
        ref="sliderRefs"
        type="range"
        class="w-full h-1 rounded cursor-pointer range-thumb-purple"
        :max="duration[index]"
        :value="currentTime[index]"
        @input="seek($event, index)"
      />
      <span>{{ formatTime(duration[index]) }}</span>
    </div>

    <!-- АУДІО -->
    <audio
      ref="audioRefs"
      :src="track.url"
      @timeupdate="onTimeUpdate(index)"
      @loadedmetadata="onLoadedMeta(index)"
      @ended="onEnded(index)"
      class="hidden"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PlayPauseIcon from "@/components/SVG/AddPosts_Icons/PlayPauseIcon.vue";
import AudioCover from "@/components/SVG/AddPosts_Icons/AudioCover.vue";

interface AudioTrack {
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  url: string;
}

const props = defineProps<{ content: AudioTrack[] }>();

const audioRefs = ref<HTMLAudioElement[]>([]);
const sliderRefs = ref<HTMLInputElement[]>([]);
const isPlaying = ref<boolean[]>([]);
const currentTime = ref<number[]>([]);
const duration = ref<number[]>([]);

function togglePlay(index: number) {
  const audio = audioRefs.value[index];
  if (!audio) return;

  if (isPlaying.value[index]) {
    audio.pause();
    isPlaying.value[index] = false;
  } else {
    // Зупини всі інші
    audioRefs.value.forEach((a, i) => {
      if (i !== index && a) {
        a.pause();
        isPlaying.value[i] = false;
      }
    });
    audio.play();
    isPlaying.value[index] = true;
  }
}

function onTimeUpdate(index: number) {
  const audio = audioRefs.value[index];
  if (audio) {
    currentTime.value[index] = audio.currentTime;
    updateFill(index);
  }
}

function onLoadedMeta(index: number) {
  const audio = audioRefs.value[index];
  if (audio) {
    duration.value[index] = audio.duration;
  }
}

function onEnded(index: number) {
  isPlaying.value[index] = false;
}

function seek(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  const val = parseFloat(input.value);
  const audio = audioRefs.value[index];
  if (audio) {
    audio.currentTime = val;
    currentTime.value[index] = val;
    updateFill(index);
  }
}

function updateFill(index: number) {
  const slider = sliderRefs.value[index];
  if (!slider || duration.value[index] === 0) return;
  const pct = (currentTime.value[index] / duration.value[index]) * 100;
  slider.style.setProperty("--percent", pct + "%");
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Ініціалізація масивів
onMounted(() => {
  const count = props.content.length;
  for (let i = 0; i < count; i++) {
    isPlaying.value.push(false);
    currentTime.value.push(0);
    duration.value.push(0);
  }
});
</script>

<style scoped>
.range-thumb-purple {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: transparent;
  cursor: pointer;
  background-image: linear-gradient(
    to right,
    #6d01d0 0%,
    #6d01d0 var(--percent, 0%),
    #ffffff var(--percent, 0%),
    #ffffff 100%
  );
}

/* WebKit track */
.range-thumb-purple::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: transparent;
}

/* Firefox track + progress */
.range-thumb-purple::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: #ffffff;
}
.range-thumb-purple::-moz-range-progress {
  height: 4px;
  border-radius: 2px;
  background: #6d01d0;
}

/* Thumb styling */
.range-thumb-purple::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  background: #6d01d0;
  border-radius: 50%;
  margin-top: -4px; /* vertically center */
}
.range-thumb-purple::-moz-range-thumb {
  height: 12px;
  width: 12px;
  background: #6d01d0;
  border: none;
  border-radius: 50%;
}
</style>
