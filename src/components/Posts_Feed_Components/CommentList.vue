<template>
  <div class="flex flex-col gap-2 mb-20">
    <p
      v-if="comments.length === 0"
      class="text-white/40 text-sm text-center pt-4 mt-20"
    >
      No comments yet. Be the first to comment!
    </p>

    <CommentItem
      v-for="(comment, index) in comments"
      :key="index"
      :comment="comment"
    />
  </div>
</template>

<script setup lang="ts">
import CommentItem from "./CommentItem.vue";

defineProps<{
  comments: {
    id: string;
    avatarUrl: string;
    displayName: string;
    username: string;
    role: string;
    text: string;
  }[];
}>();
</script>
