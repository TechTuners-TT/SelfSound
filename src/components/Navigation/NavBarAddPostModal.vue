<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 z-50 w-full h-full flex justify-start items-center [@media(min-width:1537px)]:ml-25 xl:ml-[70px] lg:ml-[60px] md:ml-[60px] sm:ml-[0px] max-md:justify-center max-md:items-end"
    @click.self="close"
  >
    <div
      class="py-[4px] gap-[4px] flex flex-col justify-between items-center max-md:mb-15 w-[95px] h-[104px] sm:w-[106px] sm:h-[118px] sm:py-[6px] sm:gap-[6px] md:w-[128px] md:h-[128px] md:py-[8px] md:gap-[8px] lg:w-[142px] lg:h-[142px] lg:py-[10px] lg:gap-[10px] xl:w-[156px] xl:h-[156px] xl:py-[12px] xl:gap-[12px] [@media(min-width:1537px)]:w-[175px] [@media(min-width:1537px)]:h-[175px] [@media(min-width:1537px)]:py-[15px] [@media(min-width:1537px)]:gap-[15px] px-[4px] sm:px-[6px] md:px-[10.7px] lg:px-[13.5px] xl:px-[16px] [@media(min-width:1537px)]:px-[20px] rounded-tr-xl rounded-br-xl max-md:rounded-br-none max-md:rounded-tl-xl max-md:rounded-tr-xl"
      style="background-color: rgba(0, 12, 156, 0.4)"
    >
      <div
        class="flex gap-[5.5px] sm:gap-[8px] md:gap-[10.7px] lg:gap-[13.5px] xl:gap-[16px] [@media(min-width:1537px)]:gap-[20px]"
      >
        <button @click="close">
          <router-link to="/add-post-media">
            <NavBarAddPost name="Media"
          /></router-link>
        </button>
        <button @click="close">
          <router-link to="/add-post-audio"
            ><NavBarAddPost name="Audio"
          /></router-link>
        </button>
      </div>
      <div
        class="flex gap-[5.5px] sm:gap-[8px] md:gap-[10.7px] lg:gap-[13.5px] xl:gap-[16px] [@media(min-width:1537px)]:gap-[20px]"
      >
        <button @click="close">
          <router-link to="/add-post-lyrics"
            ><NavBarAddPost name="Lyrics"
          /></router-link>
        </button>
        <button @click="close">
          <router-link to="/add-post-musicxml"
            ><NavBarAddPost name="MusicXML"
          /></router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBarAddPost from "../SVG/Nav_Bar_Icon/NavBarAddPost.vue";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "select"]);

const close = () => emit("close");
</script>
