<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 z-50 w-full h-full flex justify-start items-center [@media(min-width:1537px)]:ml-25 xl:ml-[70px] lg:ml-[60px] md:ml-[60px] sm:ml-[0px] max-md:justify-center max-md:items-end"
    @click.self="close"
  >
    <div
      class="rounded-xl p-1 flex flex-col justify-between items-center max-md:mb-20 gap-1 w-[120px] h-[120px] sm:w-32 sm:h-32 sm:p-2 sm:gap-1 md:w-33 md:h-33 md:p-2 md:gap-2.5 lg:w-36 lg:h-36 lg:p-2 lg:gap-3.5 xl:w-38 xl:h-38 xl:p-2 xl:gap-3.5 [@media(min-width:1537px)]:w-[175px] [@media(min-width:1537px)]:h-[175px] [@media(min-width:1537px)]:p-3.5 [@media(min-width:1537px)]:gap-3.5"
      style="background-color: rgba(0, 12, 156, 0.4)"
    >
      <div
        class="flex gap-[15px] sm:gap-[15px] md:gap-[20px] lg:gap-[20px] xl:gap-[20px] [@media(min-width:1537px)]:gap-[20px]"
      >
        <button>
          <NavBarAddPost name="Media" />
        </button>
        <button>
          <NavBarAddPost name="Audio" />
        </button>
      </div>
      <div
        class="flex gap-[15px] sm:gap-[15px] md:gap-[20px] lg:gap-[20px] xl:gap-[20px] [@media(min-width:1537px)]:gap-[20px]"
      >
        <button>
          <NavBarAddPost name="Lyrics" />
        </button>
        <button>
          <NavBarAddPost name="MusicXML" />
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
