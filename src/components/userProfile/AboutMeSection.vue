<template>
  <section
    class="absolute md:right-[40px] lg:right-[60px] xl:right-[91px] md:top-[70px] lg:top-[85px] xl:top-[95px] hidden md:block lg:block"
  >
    <h2 class="text-base text-white">ABOUT ME</h2>
    <p
      class="mt-4 md:mt-5 lg:mt-6 text-base text-white md:w-[500px] lg:w-[700px] xl:w-[869px]"
    >
      {{ aboutText }}
    </p>
    <div
      class="mt-6 md:mt-7 lg:mt-9 h-6 md:h-7 lg:h-8 rounded-xl bg-[linear-gradient(270deg,#060310_16.17%,#000C9C_51.13%,#000C9C_61.01%,#6D01D0_92.17%)] md:w-[500px] lg:w-[700px] xl:w-[869px]"
    ></div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AboutMeSection",
  props: {
    aboutText: {
      type: String,
      required: true,
    },
  },
});
</script>
