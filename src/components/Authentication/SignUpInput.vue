<template>
  <div class="flex flex-col gap-2 mb-4.5">
    <label :for="id" class="text-base text-white">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="updateValue"
      class="px-3 w-full h-9 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
      :class="{ 'border-red-500': error }"
      :placeholder="placeholder"
    />
    <p v-if="error" class="text-sm text-red-500 -mt-2 max-h-[10px]">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "InputField",
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // Generate a unique ID for the input field
    const id = computed(
      () =>
        `input-${props.label.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 9)}`,
    );

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
    };

    return {
      id,
      updateValue,
    };
  },
});
</script>
