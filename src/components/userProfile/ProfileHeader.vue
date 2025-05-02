<template>
  <div
    class="flex gap-10 iteam-centere mt-10 sm:gap-15 md:gap-[46px] lg:gap-[76px] xl:gap-[56px] 2xl:gap-[76px]"
  >
    <div
      class="relative w-[84px] h-[84px] max-sm:w-[60px] max-sm:h-[60px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] lg:w-[72px] lg:h-[72px] xl:w-[84px] xl:h-[84px]"
    >
      <img
        :src="user.avatarUrl"
        :alt="user.name"
        class="rounded-full object-cover w-full h-full"
      />
      <div
        class="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.5)]"
      ></div>
    </div>
    <div class="flex flex-col gap-1 sm:gap-2.5 text-left">
      <p
        class="font-bold text-white h-[24px] sm:h-[30px] text-[20px] sm:text-[24px] xl:text-[22px] 2xl:text-[30px] inter-font"
        style="font-weight: 700"
      >
        {{ user.name }}
      </p>
      <p
        class="text-base font-medium text-white h-[12px] text-[13px] sm:text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] inter-font"
        style="font-weight: 500"
      >
        {{ user.login }}
      </p>
    </div>
  </div>

  <div
    class="flex items-center gap-10 h-[54px] sm:gap-15 md:gap-[46px] lg:gap-[76px] xl:gap-[56px] 2xl:gap-[60px]"
  >
    <div
      class="flex-shrink-0 min-w-[60px] max-w-[100px] w-[100px] 2xl:w-[100px] xl:w-[84px] lg:w-[72px] md:w-[68px] sm:w-[64px] max-sm:w-[60px]"
    >
      <div
        class="h-[26px] w-full sm:h-[32px] text-sm sm:text-base text-white rounded-[5px] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] inter-font flex items-center justify-center"
        :style="{
          fontWeight: '400',
          backgroundColor:
            user.tag === 'Listener'
              ? 'white'
              : user.tag === 'Musician'
                ? '#6D01D0'
                : user.tag === 'Learner'
                  ? '#000C9C'
                  : 'rgba(0, 12, 156, 0.5)',
          color: user.tag === 'Listener' ? 'black' : 'white',
        }"
      >
        {{ user.tag }}
      </div>
    </div>

    <p
      class="grow m-auto text-white text-[12px] sm:text-[13px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] inter-font biographyinput"
      style="font-weight: 400; line-height: 1.125"
    >
      {{ user.biography }}
    </p>
  </div>

  <div
    class="flex items-center h-[12px] mt-5 sm:mt-5 md:mt-10 lg:mt-5 xl:mt-10 gap-6.5 sm:gap-12.5 md:gap-[40px] lg:gap-[60px] xl:gap-[50px] 2xl:gap-[60px]"
  >
    <div
      class="flex-shrink-0 min-w-[60px] max-w-[100px] w-[100px] 2xl:w-[100px] xl:w-[90px] lg:w-[88px] md:w-[74px] sm:w-[74px] max-sm:w-[74px]"
    >
      <div
        class="h-[26px] w-full sm:h-[32px] text-sm sm:text-base text-white rounded-[5px] text-[16px] inter-font flex items-center justify-center"
        style="font-weight: 400"
      ></div>
    </div>

    <section
      class="flex gap-[20px] sm:gap-[40px] md:gap-[30px] lg:gap-[40px] xl:gap-[20px] 2xl:gap-[40px] mb-1.25 inter-font font-medium h-[12px] justify-end"
    >
      <p
        class="font-medium text-white inter-font text-[10px] sm:text-[9px] md:text-[10px] xl:text-[11px] 2xl:text-[12px] h-[12px]"
        style="font-weight: 500"
      >
        {{ stats.posts }} posts
      </p>
      <p
        class="font-medium text-white inter-font text-[10px] sm:text-[10px] md:text-[10px] xl:text-[11px] 2xl:text-[12px] h-[12px]"
        style="font-weight: 500"
      >
        Listeners: {{ stats.listeners }}
      </p>
      <p
        class="font-medium text-white inter-font text-[10px] sm:text-[10px] md:text-[10px] xl:text-[11px] 2xl:text-[12px] h-[12px]"
        style="font-weight: 500"
      >
        Listened to: {{ stats.listenedTo }}
      </p>
    </section>
  </div>
  <!-- Статистика (після біографії) -->
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    biography: string;
    tag?: string | "add tag";
  };
  stats: {
    posts: number;
    listeners: number;
    listenedTo: number;
  };
}>();
</script>
<style scoped>
.inter-font {
  font-family: "Inter", sans-serif;
}
</style>
