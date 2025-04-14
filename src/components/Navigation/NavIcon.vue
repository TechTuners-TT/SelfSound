<template>
  <button
    class="nav-button flex items-center justify-center w-full hover:scale-110"
    @click="handleClick"
    ref="button"
  >
    <span ref="iconContainer" v-html="svg"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Props {
  svg: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const iconContainer = ref<HTMLElement | null>(null);
const handleClick = () => emit("click");

onMounted(() => {
  const icon = iconContainer.value?.querySelector(
    ".add-post-icon",
  ) as SVGElement | null;

  if (icon) {
    icon.style.backgroundColor = "#6D01D0";
    icon.style.borderRadius = "5px";
    icon.style.cursor = "pointer";

    icon.addEventListener("mouseover", () => {
      icon.style.backgroundColor = "#000C9C";
    });

    icon.addEventListener("mouseout", () => {
      icon.style.backgroundColor = "#6D01D0";
    });
  }
});
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
