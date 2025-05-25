<template>
  <div class="w-full bg-white/10 rounded-[5px] pl-4 pt-4 pb-5">
    <input
      v-model="newComment"
      type="text"
      placeholder="What's on your mind?"
      class="w-full text-white placeholder-white/50 text-sm outline-none"
      @keyup.enter="submitComment"
    />
  </div>

  <div class="flex justify-end mt-[15px]">
    <button
      @click="submitComment"
      class="px-2.5 text-lg font-bold bg-[#6D01D0]/20 text-[#6D01D0] rounded-[5px] cursor-pointer"
    >
      Publish
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "submit", commentText: string): void;
}>();

const newComment = ref("");

function submitComment() {
  if (newComment.value.trim() !== "") {
    emit("submit", newComment.value.trim());
    newComment.value = "";
  }
}
</script>
