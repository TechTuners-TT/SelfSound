<template>
  <article
    class="flex flex-col grow shrink justify-center items-center p-8 rounded-2xl border-4 border-white border-solid min-h-[286px] min-w-60 w-[570px] max-md:px-5 max-md:max-w-full"
    :class="bgColor"
  >
    <div class="flex flex-col w-full max-w-[653px] max-md:max-w-full">
      <div class="flex gap-10 items-center self-start text-4xl" v-if="hasIcon">
        <img
          v-if="iconSrc"
          :src="iconSrc"
          :alt="`${title} icon`"
          class="object-contain overflow-hidden shrink-0 self-stretch my-auto aspect-square w-[70px]"
        />
        <h3 class="self-stretch my-auto">{{ title }}</h3>
      </div>
      <h3 v-else class="gap-10 self-start text-4xl max-md:max-w-full">
        {{ title }}
      </h3>
      <p class="mt-10 text-2xl max-md:max-w-full">
        <slot name="content"></slot>
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  iconSrc: {
    type: String,
    default: "",
  },
  bgColor: {
    type: String,
    default: "bg-slate-900",
  },
  hasIcon: {
    type: Boolean,
    default: true,
  },
});
</script>
