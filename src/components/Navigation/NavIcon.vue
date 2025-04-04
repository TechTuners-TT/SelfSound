<template>
  <button
    class="nav-button flex items-center justify-center w-full
       hover:scale-110 "
    @click="handleClick"
  >
    <span v-html="svg"></span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Props {
  svg: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
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
