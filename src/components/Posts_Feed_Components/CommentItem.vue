<template>
  <div class="pt-4">
    <!-- Контейнер з аватаром та ім'ям + бейджем -->
    <div class="flex items-center gap-3">
      <img
        :src="comment.avatarUrl"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover"
      />
      <div
        @click="goToProfile(comment.id)"
        class="flex items-center gap-2 cursor-pointer"
      >
        <div class="flex flex-col leading-tight">
          <div
            class="text-white font-semibold text-[clamp(12px,0.833vw,16px)] font-inter"
          >
            {{ comment.displayName }}
          </div>
          <div
            class="text-white font-normal text-[clamp(10px,0.729vw,14px)] mt-1 font-inter"
          >
            @{{ comment.username }}
          </div>
        </div>
        <span
          :style="getBadgeStyle(comment.role)"
          class="ml-2 whitespace-nowrap font-semibold font-inter"
        >
          {{ comment.role }}
        </span>
      </div>
    </div>

    <!-- Контейнер з текстом, вирівняний зліва під аватаром -->
    <div class="flex mt-2.5">
      <p
        class="text-white text-sm leading-snug break-words whitespace-pre-line flex-1"
      >
        {{ comment.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

defineProps<{
  comment: {
    id: string;
    avatarUrl: string;
    displayName: string;
    username: string;
    role: string;
    text: string;
  };
}>();

function getBadgeStyle(role: string) {
  const base = {
    width: "clamp(50px, 3.229vw, 50px)",
    height: "clamp(21px, 1.354vw, 21px)",
    borderRadius: "5px",
    padding: "4px 8px",
    fontSize: "clamp(10px, 0.729vw, 12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  if (role === "Musician")
    return { ...base, backgroundColor: "#6D01D0", color: "#FFFFFF" };
  if (role === "Learner")
    return { ...base, backgroundColor: "#000C9C", color: "#FFFFFF" };
  if (role === "Listener")
    return { ...base, backgroundColor: "#FFFFFF", color: "#000000" };
  return base;
}

function goToProfile(userId: string) {
  router.push({ name: "Profile", params: { userId } });
}
</script>
