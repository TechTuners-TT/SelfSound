<template>
  <svg
    viewBox="0 0 1920 3300"
    fill="none"
    :width="widthAttr"
    :height="heightAttr"
    overflow="visible"
    class="absolute inset-0 -z-10 w-full h-full"
    preserveAspectRatio="none"
  >
    <rect width="1920" height="3300" fill="url(#paint0_linear_871_96)" />
    <defs>
      <linearGradient
        id="paint0_linear_871_96"
        x1="960"
        y1="0"
        x2="960"
        y2="3300"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#060310" />
        <stop offset="0.46" stop-color="#000C9C" />
        <stop offset="0.59" stop-color="#000C9C" />
        <stop offset="1" stop-color="#6D01D0" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Типізація пропсів через TypeScript
interface Props {
  width?: string;
  height?: string;
  size?: string;
}

// Отримуємо пропси
const props = defineProps<Props>();

// Обчислювані значення
const widthAttr = computed(() => {
  if (props.height) return undefined;
  if (props.size) return props.size;
  return props.width || "1920px";
});

const heightAttr = computed(() => {
  if (props.width) return undefined;
  if (props.size) return props.size;
  return props.height || "3300px";
});
</script>
