<template>
  <section class="flex flex-col gap-1">
    <div class="flex flex-col sm:flex-row gap-19 items-center sm:items-start">
      <div class="relative h-[84px] w-[84px]">
        <img
          :src="user.avatarUrl"
          :alt="user.name"
          class="w-[84px] h-[84px] rounded-full"
        />
        <div
          class="absolute inset-0 rounded-full border border-white border-opacity-50"
        ></div>
      </div>
      <div class="flex flex-col gap-2.5 text-center sm:text-left ">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          {{ user.name }}
        </h1>
        <p class="text-base font-medium text-white">{{ user.username }}</p>
      </div>
    </div>
    <div   
      class="flex gap-4  items-center justify-center sm:justify-start gap-15"
    >
      <button
        class=" h-8 text-sm sm:text-base text-white rounded-xl border bg-slate-900 border-white border-opacity-50 w-[100px]" style="background-color:rgba(2, 3, 61, 1)"
      >
        Add tag  
      </button>
      <p class="grow shrink self-stretch my-auto w-[380px] text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.
    </p> </div> 
  </section>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    username: string;
    avatarUrl: string;
  };
}>();
</script>
<style scoped>

@media (max-width: 768px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
  }

  .gap-20 {
    gap: 2rem;
  }

  .gap-15 {
    gap: 2rem;
  }
 
}

@media (min-width: 479.5px) and (max-width: 640px) {
  .gap-20 {
    gap: 1.25rem;
  }

  .gap-15 {
    gap: 1rem;
  }

 

  .text-3xl {
    font-size: 1.5rem;
  }

  section {
    padding-left: 2px;
    padding-right: 2px;
  }

  .max-w-\[\400px\] {
    max-width: 300px;
  }
}

@media (max-width: 479.5px) {
  .gap-19 {
    gap: 0.75rem; 
  }

  .w-\[84px\] {
    width: 70px;
  }

  .h-\[84px\] {
    height: 70px;
  }
  .text-3xl {
    font-size: 1.25rem;
  }
  .gap-15 {
    gap: 1rem;
  }

  .text-base {
    font-size: 0.875rem;
  }

  .max-w-\[\400px\] {
    max-width: 250px;
  }
}

@media (max-width: 420px) {
  .flex {
    flex-direction: column; 
    align-items: center; 
  }
  .gap-19 {
    gap: 0.75rem; 
  }
  .gap-15 {
    gap: 0.25rem;
  }
  .w-\[84px\] {
    width: 70px;
  }

  .h-\[84px\] {
    height: 70px;
  }
  .text-3xl {
    font-size: 1.25rem;
  }

  .text-base {
    font-size: 0.875rem;
  }

  .max-w-\[\400px\] {
    max-width: 250px;
  }
  .w-\[380px\] {
    width: 100%; /* Текст займає всю ширину контейнера */
    word-wrap: break-word; /* Ламаємо слова, якщо вони занадто довгі */
  }

  .text-white {
    font-size: 0.875rem; /* Зменшуємо шрифт на малих екранах */
  }
}

</style>