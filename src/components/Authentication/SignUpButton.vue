<template>
  <button
    type="button"
    @click="$emit('click')"
    class="flex gap-1.5 justify-center items-center w-full h-9 text-base font-bold text-white rounded-md bg-[rgba(2,3,61,1)] transition duration-300 ease-in-out"
  >
    <div v-if="icon">
      <component :is="iconComponent" />
    </div>
    <span>{{ text }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Component } from "vue";
import GoogleIcon from "../SVG/Authentication/Sign_Up_In_If_button_Google.vue";

export default defineComponent({
  name: "SocialButton",
  props: {
    icon: {
      type: String,
      required: true,
      validator: (value: string) => ["google"].includes(value),
    },
    text: {
      type: String,
      required: true,
    },
  },
  emits: ["click"],
  computed: {
    iconComponent(): Component | null {
      switch (this.icon) {
        case "google":
          return GoogleIcon;
        default:
          return null;
      }
    },
  },
});
</script>
