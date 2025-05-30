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

    <!-- Password Strength Indicator (Health Bar Design) -->
    <div v-if="type === 'password'" class="mt-2">
      <div class="flex gap-1 mb-1">
        <div
          v-for="stage in 3"
          :key="stage"
          class="h-1 rounded-full flex-1 transition-all"
          :class="getStrengthClass(stage)"
        />
      </div>

      <p class="text-sm max-h-[10px] font-bold" :class="strengthColorClass">
        {{ strengthLabel }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import EyeIcon from "../SVG/Authentication/Sign_Up_In_Show_password_button.vue";
import EyeOffIcon from "../SVG/Authentication/Sign_Up_In_Not_show_password_button.vue.vue";

export default defineComponent({
  name: "SignUpInput",
  components: {
    EyeIcon,
    EyeOffIcon,
  },
  props: {
    label: { type: String, required: true },
    type: { type: String, default: "text" },
    modelValue: { type: String, default: "" },
    error: { type: String, default: "" },
    placeholder: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const passwordVisible = ref(false);

    const inputType = computed(() =>
      props.type === "password"
        ? passwordVisible.value
          ? "text"
          : "password"
        : props.type,
    );

    const id = computed(
      () =>
        `input-${props.label.toLowerCase().replace(/\s+/g, "-")}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
    );

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    // Advanced password validation logic
    const hasUppercase = (s: string): boolean => /[A-Z]/.test(s);
    const hasLowercase = (s: string): boolean => /[a-z]/.test(s);
    const hasNumber = (s: string): boolean => /\d/.test(s);
    const hasSpecial = (s: string): boolean => /[^A-Za-z0-9]/.test(s);
    const uniqueChars = (s: string): number => new Set(s).size;

    const baseRequirementsMet = computed(() => {
      const p = props.modelValue;
      return (
        p.length >= 6 &&
        hasUppercase(p) &&
        hasLowercase(p) &&
        hasNumber(p) &&
        hasSpecial(p)
      );
    });

    const passwordStrength = computed(() => {
      if (!baseRequirementsMet.value) return "invalid";
      const length = props.modelValue.length;
      const unique = uniqueChars(props.modelValue);
      if (length >= 12 && unique >= 6) return "strong";
      if (length >= 12 || unique >= 6) return "ok";
      return "weak";
    });

    const strengthLabel = computed(() => {
      switch (passwordStrength.value) {
        case "invalid":
          return "";
        case "weak":
          return "Weak password";
        case "ok":
          return "Ok password";
        case "strong":
          return "Strong password";
        default:
          return "";
      }
    });

    const strengthColorClass = computed(() => {
      switch (passwordStrength.value) {
        case "invalid":
        case "weak":
          return "text-[#D0202F]"; // red
        case "ok":
          return "text-[#F2C849]"; // yellow
        case "strong":
          return "text-[#3BAA5F]"; // green
        default:
          return "text-white";
      }
    });

    const getStrengthClass = (stage: number): string => {
      switch (passwordStrength.value) {
        case "invalid":
          return "bg-white/30";
        case "weak":
          return stage === 1 ? "bg-[#D0202F]" : "bg-white/30";
        case "ok":
          return stage <= 2 ? "bg-[#F2C849]" : "bg-white/30";
        case "strong":
          return "bg-[#3BAA5F]";
        default:
          return "bg-white/30";
      }
    };

    return {
      id,
      updateValue,
      passwordVisible,
      togglePasswordVisibility,
      inputType,
      getStrengthClass,
      strengthLabel,
      strengthColorClass,
    };
  },
});
</script>
