<template>
  <div class="flex flex-col gap-2 mb-4.5">
    <label :for="id" class="text-base text-white">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="updateValue"
        class="px-3 w-full h-9 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        :class="{ 'border-red-500': error }"
        :placeholder="placeholder"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Toggle password visibility"
      >
        <component :is="passwordVisible ? 'EyeIcon' : 'EyeOffIcon'" />
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-500 -mt-2 max-h-[10px]">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import EyeIcon from '../SVG/Authentication/EyeIcon.vue';
import EyeOffIcon from '../SVG/Authentication/EyeOffIcon.vue';

export default defineComponent({
  name: 'InputField',
  components: {
    EyeIcon,
    EyeOffIcon,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const passwordVisible = ref(false);

    const inputType = computed(() => {
      if (props.type === 'password') {
        return passwordVisible.value ? 'text' : 'password';
      }
      return props.type;
    });

    const id = computed(() =>
      `input-${props.label.toLowerCase().replace(/\s+/g, '-')}-${Math.random()
        .toString(36)
        .substring(2, 9)}`
    );

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    return {
      id,
      updateValue,
      passwordVisible,
      togglePasswordVisibility,
      inputType,
    };
  },
});
</script>
