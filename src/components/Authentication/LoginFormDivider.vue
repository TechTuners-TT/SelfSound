<template>
  <div class="flex gap-3 items-center mb-4.5">
    <div class="flex-1 h-px bg-white"></div>
    <p class="text-base font-medium text-white">{{ text }}</p>
    <div class="flex-1 h-px bg-white"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  text: string;
}>();
</script>
