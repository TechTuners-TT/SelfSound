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
      <EyeOffIcon v-if="!passwordVisible" />
      <EyeIcon v-else />
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-500 -mt-2 max-h-[10px]">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";
import EyeOffIcon from "../SVG/Authentication/EyeOffIcon.vue";
import EyeIcon from "../SVG/Authentication/EyeIcon.vue";
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
