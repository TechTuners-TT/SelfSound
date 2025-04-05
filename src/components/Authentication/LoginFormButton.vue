<template>
  <button
    :type="type"
    class="w-full h-9 text-base font-bold text-white rounded-md bg-[rgba(2,3,61,1)] transition duration-300 ease-in-out"
    :class="[
      { 'flex gap-2 justify-center items-center': hasIcon },
      marginClass,
    ]"
    @click="$emit('click')"
  >
    <slot name="icon"></slot>
    <span><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
// import { defineProps, defineEmits } from "vue";

/*
const props = defineProps<{
  type?: "button" | "submit" | "reset";
  marginClass?: string;
  hasIcon?: boolean;
}>();
*/ 

defineEmits<{
  (e: "click"): void;
}>();
</script>
<style scoped>
button:hover {
  background-color: rgba(10, 20, 120, 1);
}
</style>
