<template>
  <button
    class="nav-button flex items-center justify-center w-full transition-transform duration-150"
    @click="handleClick"
    ref="button"
  >
    <span ref="iconContainer" v-html="safeSvg"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import DOMPurify from "dompurify";

interface Props {
  svg: string;
  isActive?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const iconContainer = ref<HTMLElement | null>(null);
const handleClick = () => emit("click");

// Очищення SVG перед рендером
const safeSvg = computed(() =>
  DOMPurify.sanitize(props.svg, { USE_PROFILES: { svg: true } }),
);

// Змінює стилі SVG відповідно до активного стану
const updateIconStyles = () => {
  if (!iconContainer.value) return;
  const path = iconContainer.value.querySelector(
    ".nav-icon path",
  ) as HTMLElement | null;
  if (path) {
    path.setAttribute("fill", props.isActive ? "#6D01D0" : "white");
  }
};

onMounted(() => {
  updateIconStyles();
});

watch(
  () => props.isActive,
  () => {
    updateIconStyles();
  },
);
</script>

<style scoped>
.nav-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
