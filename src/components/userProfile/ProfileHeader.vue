<template>
  <section class="flex flex-col gap-5">
    <div class="flex flex-row gap-19 items-center sm:items-start w-[560px]  h-[84px]  ">
      <div class="relative h-[84px] w-[84px]       "    >
        <img
          :src="user.avatarUrl"
          :alt="user.name"
          class="w-[84px] h-[84px]      rounded-full"
        />
        <div
          class="absolute inset-0 rounded-full border border-white border-opacity-50"
        ></div>
      </div>
      <div class="flex flex-col gap-2.5 text-center text-left ">
        <h1 class=" font-bold text-white  w-[400px] h-[30px]   text-[30px] inter-font" style="font-weight: 700;">
          {{ user.name }}
        </h1>
        <p class="text-base font-medium text-white  w-[400px] h-[12px]  text-[16px] inter-font" style="font-weight: 500; ">{{ user.login }}</p>
      </div>
    </div>
    <div   
      class="flex gap-4  items-center justify-center sm:justify-start gap-15 w-[560px]  h-[54px]"
    >
      <button
        class=" h-8 text-sm sm:text-base text-white rounded-xl border bg-slate-900 border-white border-opacity-50 w-[100px] text-[16px] inter-font" style="font-weight: 400; background-color:rgba(2, 3, 61, 1)"
      >
        Add tag  
      </button>
      <p class="grow shrink self-stretch my-auto w-[400px]  text-white text-[16px] inter-font" style="font-weight: 400; line-height: 1.125 " >
        {{ user.biography }}  
    </p> </div> 
  </section>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    biography: string;
  };
}>();
</script>
<style scoped>


.inter-font {
  font-family: 'Inter', sans-serif;
}
@media (max-width: 768px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
  }
}

  
  @media (max-width: 768px) {
  

  .w-\[560px\] {
    width: 100%; 
  }

  .w-\[400px\] {
    width: 100%; 
  }

  .h-\[84px\] {
    height: 84px; 
  }

  .h-\[54px\] {
    height: 50px; 
  }

  .text-\[\30px\] {
    font-size: 24px; 
  }

  .text-\[\16px\] {
    font-size: 14px; 
  }
  .text-\[\30px\] {
    font-size: 24px; 
  }

  .gap-19 {
    gap: 1rem; 
  }

  .gap-15 {
    gap: 1rem; 
  }

  .text-base {
    font-size: 14px; 
  }
}

@media (max-width: 640px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
  }

  .w-\[400px\] {
    width: 200px; 
  }

  .text-\[\30px\] {
    font-size: 18px; 
  }

  .text-\[\16px\] {
    font-size: 13px; 
  }

  

  .h-\[54px\] {
    height: 45px; 
  }

  .gap-19 {
    gap: 0.75rem; 
  }

  .gap-15 {
    gap: 0.75rem; 
  }
}

</style>