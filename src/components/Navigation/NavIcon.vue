<template>
    <button
      :aria-label="name"
      class="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md hover:scale-110 transition-transform duration-200"
      @click="handleClick"
    >
      <div v-html="svg" class="scale-80 transform-origin-center"></div>
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "NavIcon",
    props: {
      svg: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    setup(props, { emit }) {
      const handleClick = () => {
        emit("click", props.name);
      };
  
      return {
        handleClick,
      };
    },
  });
  </script>
  
  <style scoped>
  .scale-80 {
    transform: scale(0.8);
  }
  .transform-origin-center {
    transform-origin: center;
  }
  </style>
  