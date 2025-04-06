<template>
  <div class="flex flex-col gap-2 mb-0">
    <label :for="id" class="text-base font-medium text-white mt-4.5">{{
      label
    }}</label>
    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        class="px-3 w-full h-9 bg-white rounded-md border border-gray-300"
        :class="{ 'border-red-500': error }"
        :aria-label="label"
        :aria-invalid="!!error"
        :placeholder="placeholder"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Toggle password visibility"
      >
        <svg
          v-if="!passwordVisible"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
          ></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-500 -mt-2 max-h-[10px]">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";

const props = defineProps<{
  label: string;
  type: string;
  modelValue: string;
  id: string;
  error?: string;
  placeholder?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// State for password visibility
const passwordVisible = ref(false);

// Computed property to determine the input type
const inputType = computed(() => {
  if (props.type === "password") {
    return passwordVisible.value ? "text" : "password";
  }
  return props.type;
});

// Toggle password visibility
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>
