<template>
  <div
    class="mb-[10px] flex gap-10 iteam-centere mt-10 sm:gap-15 md:gap-[46px] lg:gap-[76px] xl:gap-[56px] [@media(min-width:1537px)]:gap-[76px] sm:mb-[12px] md:mb-[14px] lg:mb-[16px] xl:mb-[18px] [@media(min-width:1537px)]:mb-[20px]"
  >
    <div
      class="relative w-[84px] h-[84px] max-sm:w-[60px] max-sm:h-[60px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] lg:w-[72px] lg:h-[72px] xl:w-[84px] xl:h-[84px]"
    >
      <img
        :src="user.avatarUrl"
        :alt="user.name"
        class="rounded-full object-cover w-full h-full"
      />
      <div
        class="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.5)]"
      ></div>
    </div>

    <div class="flex flex-col gap-1 sm:gap-2.5 text-left">
      <p
        class="font-bold text-white h-[24px] sm:h-[30px] text-[18px] sm:text-[20px] xl:text-[24px] [@media(min-width:1537px)]::text-[30px] inter-font"
        style="font-weight: 700"
      >
        {{ user.name }}
      </p>
      <p
        class="text-base font-medium text-white h-[12px] text-[11px] sm:text-[12px] md:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] inter-font"
        style="font-weight: 500"
      >
        {{ user.login }}
      </p>
    </div>
    <div
      class="ml-auto flex items-center cursor-pointer relative"
      ref="containerRef"
    >
      <div @click="showModal = !showModal">
        <ThreeShortOnes />
      </div>

      <!-- Модальне вікно -->
      <div
        v-if="showModal"
        ref="modalRef"
        class="absolute z-50 w-[90px] sm:w-[95px] md:w-[100px] lg:w-[105px] xl:w-[110px] 2xl:w-[120px] bg-[#060310] rounded-[5px] shadow-md flex flex-col justify-center items-center pl-[10px] pr-[8px] py-[3px] xl:py-[8px] lg:py-[6.5px] md:py-[5.5px] sm:py-[3.5px] gap-[5px] border-[1px] border-white/50"
        :style="modalStyles"
      >
        <button
          class="w-full text-[#D0202F] cursor-pointer py-[1.25px] xl:py-[4.25px] lg:py-[2.5px] sm:py-[2px] text-sm text-left font-semibold"
        >
          Block user
        </button>
        <button
          class="w-full text-white cursor-pointer py-[1.25px] xl:py-[4.25px] lg:py-[2.5px] sm:py-[2px] text-sm text-left font-medium"
          @click="showModal = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div
    class="flex items-center gap-10 min-h-[34px] sm:gap-15 md:gap-[46px] lg:gap-[76px] xl:gap-[56px] [@media(min-width:1537px)]:gap-[60px]"
  >
    <div
      class="flex-shrink-0 min-w-[60px] max-w-[100px] w-[100px] [@media(min-width:1537px)]:w-[100px] xl:w-[84px] lg:w-[72px] md:w-[68px] sm:w-[64px] max-sm:w-[60px]"
    >
      <div
        class="h-[26px] w-full sm:h-[32px] text-sm sm:text-base text-white rounded-[5px] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] [@media(min-width:1537px)]:text-[16px] inter-font flex items-center justify-center"
        :style="{
          fontWeight: '400',
          backgroundColor:
            user.tag === 'Listener'
              ? 'white'
              : user.tag === 'Musician'
                ? '#6D01D0'
                : user.tag === 'Learner'
                  ? '#000C9C'
                  : 'rgba(0, 12, 156, 0.4)',
          color: user.tag === 'Listener' ? 'black' : 'white',
        }"
      >
        {{ user.tag }}
      </div>
    </div>

    <p
      class="grow m-auto text-white text-[11px] sm:text-[12px] md:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] inter-font biographyinput"
      style="font-weight: 400; line-height: 1.125"
    >
      {{ user.biography }}
    </p>
  </div>

  <div
    class="flex items-center h-[12px] mt-[15px] sm:mt-[20px] md:mt-[25px] lg:mt-[30px] xl:mt-[35px] [@media(min-width:1537px)]:mt-[40px] gap-6.5 sm:gap-12.5 md:gap-[40px] lg:gap-[60px] xl:gap-[50px] [@media(min-width:1537px)]:gap-[60px]"
  >
    <div
      class="flex-shrink-0 min-w-[60px] max-w-[100px] w-[100px] [@media(min-width:1537px)]:w-[100px] xl:w-[90px] lg:w-[88px] md:w-[74px] sm:w-[74px] max-sm:w-[74px]"
    >
      <div
        class="h-[26px] w-full sm:h-[32px] text-sm sm:text-base text-white rounded-[5px] text-[16px] inter-font flex items-center justify-center"
        style="font-weight: 400"
      ></div>
    </div>

    <section
      class="flex gap-[20px] sm:gap-[40px] md:gap-[30px] lg:gap-[40px] xl:gap-[20px] [@media(min-width:1537px)]:gap-[40px] mb-1.25 inter-font font-medium h-[12px] justify-end"
    >
      <p
        class="font-medium text-white inter-font text-[10px] sm:text-[10px] md:text-[10px] xl:text-[11px] [@media(min-width:1537px)]:text-[12px] h-[12px]"
        style="font-weight: 500"
      >
        {{ stats.posts }} posts
      </p>
      <p
        class="font-medium text-white inter-font text-[10px] sm:text-[10px] md:text-[10px] xl:text-[11px] [@media(min-width:1537px)]:text-[12px] h-[12px]"
        style="font-weight: 500"
      >
        Listeners: {{ stats.listeners }}
      </p>
      <p
        class="font-medium text-white inter-font text-[10px] sm:text-[10px] md:text-[10px] xl:text-[11px] [@media(min-width:1537px)]:text-[12px] h-[12px]"
        style="font-weight: 500"
      >
        Listened to: {{ stats.listenedTo }}
      </p>
    </section>
  </div>
  <!-- Статистика (після біографії) -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ThreeShortOnes from "../SVG/AnotherProfile/ThreeShortOnes.vue";
defineProps<{
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    biography: string;
    tag?: string | "add tag";
  };
  stats: {
    posts: number;
    listeners: number;
    listenedTo: number;
  };
}>();

const showModal = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);

const modalStyles = computed(() => {
  if (!containerRef.value) return {};

  const screenWidth = window.innerWidth;
  let rightOffset = 20;

  if (screenWidth >= 1536) {
    rightOffset = 40;
  } else if (screenWidth >= 1280) {
    rightOffset = 36;
  } else if (screenWidth >= 1024) {
    rightOffset = 32;
  } else if (screenWidth >= 768) {
    rightOffset = 28;
  } else if (screenWidth >= 640) {
    rightOffset = 24;
  }

  return {
    top: "50%",
    right: `${rightOffset}px`,
    transform: "translateY(-50%)",
  };
});

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

function onClickOutside(e: MouseEvent) {
  if (
    modalRef.value &&
    containerRef.value &&
    !modalRef.value.contains(e.target as Node) &&
    !containerRef.value.contains(e.target as Node)
  ) {
    showModal.value = false;
  }
}
</script>
<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
