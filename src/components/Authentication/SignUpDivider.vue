<template>
    <div class="flex gap-4 items-center mb-4.5">
      <div class="flex-1 h-px bg-white"></div>
      <p class="text-base text-white">{{ text }}</p>
      <div class="flex-1 h-px bg-white"></div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'DividerWithText',
    props: {
      text: {
        type: String,
        required: true
      }
    }
  });
  </script>
  