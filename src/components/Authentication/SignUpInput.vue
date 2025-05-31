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

    <!-- Password Requirements (show when user starts typing) -->
    <div
      v-if="type === 'password' && modelValue.length > 0"
      class="mt-3 p-3 bg-white/10 rounded-md"
    >
      <p class="text-sm text-white/70 mb-2">Password must contain:</p>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div
            :class="requirements.minLength ? 'text-green-400' : 'text-red-400'"
          >
            {{ requirements.minLength ? "✓" : "✗" }}
          </div>
          <span
            :class="requirements.minLength ? 'text-green-400' : 'text-white/70'"
            class="text-sm"
          >
            At least 6 characters
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div
            :class="
              requirements.hasUppercase ? 'text-green-400' : 'text-red-400'
            "
          >
            {{ requirements.hasUppercase ? "✓" : "✗" }}
          </div>
          <span
            :class="
              requirements.hasUppercase ? 'text-green-400' : 'text-white/70'
            "
            class="text-sm"
          >
            One uppercase letter (A-Z)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div
            :class="
              requirements.hasLowercase ? 'text-green-400' : 'text-red-400'
            "
          >
            {{ requirements.hasLowercase ? "✓" : "✗" }}
          </div>
          <span
            :class="
              requirements.hasLowercase ? 'text-green-400' : 'text-white/70'
            "
            class="text-sm"
          >
            One lowercase letter (a-z)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div
            :class="requirements.hasNumber ? 'text-green-400' : 'text-red-400'"
          >
            {{ requirements.hasNumber ? "✓" : "✗" }}
          </div>
          <span
            :class="requirements.hasNumber ? 'text-green-400' : 'text-white/70'"
            class="text-sm"
          >
            One number (0-9)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div
            :class="requirements.hasSpecial ? 'text-green-400' : 'text-red-400'"
          >
            {{ requirements.hasSpecial ? "✓" : "✗" }}
          </div>
          <span
            :class="
              requirements.hasSpecial ? 'text-green-400' : 'text-white/70'
            "
            class="text-sm"
          >
            One special character (!@#$%^&*)
          </span>
        </div>
      </div>

      <!-- Password Strength Indicator (Health Bar Design) -->
      <div class="mt-3">
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

    <!-- Show error message if any -->
    <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, watch } from "vue";
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

    // Password requirements tracking
    const requirements = reactive({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
    });

    // Watch for password changes and update requirements
    watch(
      () => props.modelValue,
      (newPassword) => {
        if (props.type === "password") {
          requirements.minLength = newPassword.length >= 6;
          requirements.hasUppercase = /[A-Z]/.test(newPassword);
          requirements.hasLowercase = /[a-z]/.test(newPassword);
          requirements.hasNumber = /\d/.test(newPassword);
          requirements.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        }
      },
      { immediate: true },
    );

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

    // Advanced password validation logic (keeping your existing logic)
    const hasUppercase = (s: string): boolean => /[A-Z]/.test(s);
    const hasLowercase = (s: string): boolean => /[a-z]/.test(s);
    const hasNumber = (s: string): boolean => /\d/.test(s);
    const hasSpecial = (s: string): boolean => /[^A-Za-z0-9]/.test(s);
    const uniqueChars = (s: string): number => new Set(s).size;

    const baseRequirementsMet = computed(() => {
      const p = props.modelValue;
      return (
        p.length >= 6 && // Updated to match your requirements
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
      requirements,
    };
  },
});
</script>
