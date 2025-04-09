<template>
  <section
    class="flex gap-10 items-center self-end mb-1.25 mr-29.25 text-base font-medium max-md:mr-10 "
  >
  
    <p class="text-base font-medium text-white">  {{ stats.posts }} posts </p>
    <p class="text-base font-medium text-white">
      Listeners: {{ stats.listeners }}
    </p>
    <p class="text-base font-medium text-white">
      Listened to: {{ stats.listenedTo }}
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    posts: number;
    listeners: number;
    listenedTo: number;
  };
}>();
</script>


<style scoped>

@media (min-width: 768px) {
  section {
    padding-left: 208px;
    padding-right: 0px;
  }


}



@media (max-width: 768px) {
  section {
    padding-left: 103px;
    padding-right: 0px;
    
  }

  .gap-12 {
    gap: 2rem;
  }

  .mt-10 {
    margin-top: 2rem;
  }
}

@media (max-width: 640px) {
  section {
    padding-left: 19px;
    padding-right: 0px;
    justify-content: center;
    
  }

  .gap-12 {
    gap: 1rem;
  }

  .mt-10 {
    margin-top: 1.5rem;
  }

  .text-base {
    font-size: 0.875rem;
  }
}


@media (max-width: 500px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
    justify-content: center;
  }
}

@media (max-width: 450px) {
  section {
    padding-left: 5px;
    padding-right: 5px;
    justify-content: center;
  }

  .gap-12 {
    gap: 0.75rem;
  }

  .mt-10 {
    margin-top: 1rem;
  }

  .text-base {
    font-size: 0.75rem;
  }
}


@media (max-width: 420px) {
  section {
    padding-left: 10px;
    padding-right: 10px;
    justify-content: center;
  }
}


</style>
