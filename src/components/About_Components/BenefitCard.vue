<template>
  <article class="card" :class="[bgColor, $attrs.class]">
    <div class="card-content">
      <div v-if="icon" class="card-header">
        <component :is="icon" class="icon" :alt="`${title} icon`" />
        <h3 class="title">{{ title }}</h3>
      </div>
      <p class="content">
        <slot name="content" />
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { defineProps, type Component } from "vue";

const props = defineProps<{
  title: string;
  bgColor?: string;
  icon?: Component;
}>();

const { title, bgColor, icon } = props;
</script>

<style scoped>
.card {
  border: 4px solid white;
  border-radius: 0.5rem;
  padding: clamp(1rem, 2vw, 1.5rem);
  height: auto;
  min-height: 286px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 1rem);
  margin-bottom: clamp(0.75rem, 2vh, 1.5rem);
}

.icon {
  flex-shrink: 0;
  width: clamp(2rem, 3vw, 3rem);
  height: clamp(2rem, 3vw, 3rem);
}

.title {
  font-family: "Oswald", sans-serif;
  font-weight: 600;
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);
  line-height: 1.2;
  margin: 0;
  word-break: break-word;
  flex: 1;
}

.content {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
  line-height: 1.5;
  margin: 0;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;

  /* multi-line truncation */
  display: -webkit-box;
  -webkit-box-orient: vertical;

  overflow: hidden;
}
</style>
