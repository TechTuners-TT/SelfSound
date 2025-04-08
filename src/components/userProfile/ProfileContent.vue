<template>
  <section class="flex flex-col gap-2.5 max-w w-full mx-auto  ">
    <button  
      class=" max-w-[560px] w-full h-8 text-sm sm:text-base  text-white rounded-xl border shadow-sm bg-gray-950 border-white border-opacity-50 mx-auto block "
      style="background-color:rgba(2, 3, 61, 1)">
      Edit profile
    </button>
    <div class="mt-5.5 sm:mt-7.5 w-full h-px bg-white bg-opacity-50"></div>
    <p class="mt-10 sm:mt-32 text-sm sm:text-base text-white text-center">
      There's nothing here yet, add your first post!
    </p>
  </section>
</template>

<script setup lang="ts">
// No props needed for this component
</script>
<style scoped>
/* Ignore any external margin from parent containers */
section {
  margin: 0 !important; /* Forces section to ignore any margins */
}
section .max-w {
  max-width: 640px;
}
</style>