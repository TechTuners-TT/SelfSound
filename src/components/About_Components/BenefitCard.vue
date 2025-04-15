<template>
  <article
    class="flex flex-col justify-center items-center p-8 rounded-2xl border-4 border-white min-h-[286px] min-w-60 w-[570px] max-md:px-5 max-md:max-w-full"
    :class="bgColor"
  >
    <div class="flex flex-col w-full max-w-[653px] max-md:max-w-full">
      <div v-if="icon" class="flex gap-10 items-center self-start text-4xl">
        <component
          :is="icon"
          class="w-[70px] h-[70px] object-contain shrink-0 my-auto"
          :alt="`${title} icon`"
        />
        <h3 class="self-stretch my-auto">{{ title }}</h3>
      </div>
      <h3 v-else class="gap-10 self-start text-4xl max-md:max-w-full">
        {{ title }}
      </h3>
      <p class="mt-10 text-2xl max-md:max-w-full">
        <slot name="content"></slot>
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { defineProps, type Component } from "vue";

defineProps<{
  title: string;
  bgColor?: string;
  icon?: Component; // Проп для іконки, яка тепер є компонентом
}>();
</script>
