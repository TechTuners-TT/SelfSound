<template>
  <section class="flex flex-col gap-15 max-w w-full mx-auto  section_1">
    <button  
      class=" cursor-pointer  max-w-[560px] w-full h-8 text-sm sm:text-base text-white rounded-xl border shadow-sm border-white border-opacity-50 mx-auto block inter-font"  
      style="background-color:rgba(2, 3, 61, 1) ;font-weight: 500;"
      @click="isModalOpen = true">
      Edit profile
    </button>
    <div class="w-full h-px bg-white bg-opacity-50"></div>
    <p class="mt-10 sm:mt-47.5 text-sm sm:text-base text-white text-center inter-font" style="font-weight: 400; ">
      There's nothing here yet, add your first post!
    </p>
  </section>
<!--  -->
    <div v-if="isModalOpen" class="absolute inset-0 flex justify-center items-center z-50 pointer-events-none " @click.self="isModalOpen = false" >
  <div class="rounded-xl relative pointer-events-auto shadow-xl w-[640px] bg-[#060310] max-md:w-[95%] border-1 border-white rounded-xl  max-md:px-4  max-sm:px-2" @click.stop >
   
    <img :src="user.avatarUrl" :alt="user.name" class="object-contain self-center max-w-full aspect-square w-[100px] h-[100px] rounded-full mx-auto mt-11.25 max-md:w-[80px] max-md:h-[80px] max-md:mt-6" />

    <div class="flex flex-col px-12.5 mt-9.25 w-full max-md:px-4 max-sm:px-1 max-md:mt-6">
      
       <!-- Name -->
       <div class="flex items-center gap-22.75 font-medium mb-5 max-md:gap-15 max-md:mb-4 justify-end w-[540px] h-[20px] ">
            <div class="text-white text-[16px] h-[12px] w-[50px] max-md:text-sm max-md:w-[70px] inter-font" style="font-weight: 500; ">Name:</div>
            <div class="h-[20px]  w-[400px] rounded-md border border-white border-opacity-20 bg-zinc-950 flex items-center">
              <input v-model="formData.name" class=" w-full text-[12px]  h-full bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font  rounded-md" style="font-weight: 500; " type="text" />
            </div>
          </div>

          <!-- Login -->
          <div class="flex items-center gap-23.5 font-medium mb-5 max-md:gap-15 max-md:mb-4 justify-end w-[540px] h-[20px]">
            <div class="text-white text-[16px] h-[12px] w-[47px] max-md:text-sm max-md:w-[70px] inter-font" style="font-weight: 500; ">Login:</div>
            <div class="h-[20px] w-[400px] w-full rounded-md border border-white border-opacity-20 bg-zinc-950 flex items-center">
              <input v-model="formData.login" class="w-full text-[12px]  h-full bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font  rounded-md" style="font-weight: 500; " type="text" />
            </div>
          </div>
<!-- Biography -->
<div class="flex items-center gap-14.75 font-medium max-md:gap-11 max-md:mb-4 justify-end  w-[540px]">
  <div class="text-white  text-[16px] h-[12px] w-[82px] max-md:text-sm max-md:w-[70px] inter-font" style="font-weight: 500; ">Biography:</div>
  <div class="flex-1 h-[54px]  w-[400px] rounded-md border border-white border-opacity-20 bg-zinc-950 max-md:h-[38px]  flex items-center ">
    <input v-model="formData.biography" class="w-full h-full text-[12px]  bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font  rounded-md" style="font-weight: 500; " />
  </div>
</div>

      <!-- Tags -->
    
<div class="flex items-center gap-15.25 font-medium mt-7.5 mb-16.25 max-md:flex-row max-md:gap-2">
  <div class="text-white text-[16px] h-[16px] w-[80px] max-md:text-sm inter-font" style="font-weight: 500; ">Tag:</div>
  <div class="flex gap-[20px] w-[400px] max-md:w-full flex-nowrap max-md:gap-2">
    <div
      :class="[  
        'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-xl border border-white inter-font border-opacity-50 cursor-pointer text-center'  ,
        formData.selectedTag === 'listener' ? 'text-black bg-[#FFFFFF]' : 'text-white bg-transparent',
        'max-md:w-[80px] max-md:h-[30px] max-md:text-xs' 
      ]"
      @click="selectTag('listener')"
    >
      Listener
    </div>
    <div
      :class="[
        'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-xl border inter-font border-white border-opacity-50 cursor-pointer text-center',
        formData.selectedTag === 'musician' ? 'bg-[#6D01D0] text-white' : 'text-white bg-transparent',
        'max-md:w-[80px] max-md:h-[30px] max-md:text-xs'
      ]"
      @click="selectTag('musician')"
    >
      Musician
    </div>
    <div
      :class="[
        'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-xl border inter-font border-white border-opacity-50 cursor-pointer text-center',
        formData.selectedTag === 'learner' ? 'bg-[#000C9C] text-white' : 'text-white bg-transparent',
        'max-md:w-[80px] max-md:h-[30px] max-md:text-xs'
      ]"
      @click="selectTag('learner')"
    >
      Learner
    </div>
  </div>
</div>

      <!-- Save Button -->
      <div class="self-end mb-11.25 font-bold cursor-pointer text-white hover:text-[#6D01D0] max-md:self-center max-md:mb-8" @click="saveChanges">
        Save changes
      </div>
    </div>
  </div>
</div>
  
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";

interface FormData {
  name: string;
  login: string;
  biography: string;
  selectedTag: string | null;
}

export default defineComponent({
  props: {
    user: {
      type: Object as () => {
        name: string;
        login: string;
        avatarUrl: string;
        biography: string; 
      },
      required: true,
    },
  },
  setup(props, { emit }) {
    const isModalOpen = ref(false);
    const formData = reactive<FormData>({
      name: props.user.name,
      login: props.user.login,
      biography: props.user.biography,  
      selectedTag: null,
    });

    const selectTag = (tag: string) => {
      if (formData.selectedTag === tag) {
    formData.selectedTag = null; 
  } else {
    formData.selectedTag = tag; 
  }
    };

    const saveChanges = () => {
      // Emit updated user data back to parent
      emit("update:user", { ...props.user, ...formData });
      isModalOpen.value = false;
    };

    watch(
      () => props.user,
      (newUser) => {
        formData.name = newUser.name;
        formData.login = newUser.login;
        formData.biography = newUser.biography;
      },
      { deep: true }
    );

    return { formData, isModalOpen, selectTag, saveChanges };
  },
});
</script>
<style scoped>
/* Ignore any external margin from parent containers */
section {
  margin: 0 !important; /* Forces section to ignore any margins */
}
section .max-w {
  max-width: 640px;
}


.inter-font {
  font-family: 'Inter', sans-serif;
}




@media (max-width: 1536px) {
  .mt-10 {
    margin-top: 38px;
  }
  .section_1{
    gap:56px;
  }
}

@media (max-width: 1280px) {
  .mt-10 {
    margin-top: 36px;
  }
  .section_1{
    gap:52px;
  }
}


@media (max-width: 1024px) {
  .mt-10 {
    margin-top: 32px;
  }
  .section_1{
    gap:48px;
  }
}

@media (max-width: 768px) {
  .mt-11 {
    margin-top: 2rem;
  }

  .mt-16 {
    margin-top: 3rem;
  }

  .mt-10 {
    margin-top: 28px;
  }
  button {
    
    max-width: 520px;
  
  }
  .section_1{
    gap:44px;
  }
}



@media (max-width: 640px) {
  .mt-11 {
    margin-top: 1.5rem;
  }

  .mt-16 {
    margin-top: 2rem;
  }

  .mt-10 {
    margin-top: 25px;
  }

  .text-base {
    font-size: 0.875rem;
  }

  button {
    height: 2rem;
    max-width: 500px;
  }
  .section_1{
    gap:40px;
  }
}


@media (max-width: 580px) {
  button {
    height: 2rem;
    max-width: 400px;
  }
}

@media (max-width: 450px) {
  .mt-11 {
    margin-top: 1rem;
  }

  .mt-16 {
    margin-top: 1.5rem;
  }

  .mt-10 {
    margin-top: 20px;
  }

  .text-base {
    font-size: 0.75rem;
  }

  button {
    height: 1.75rem;
    font-size: 0.75rem;
    max-width: 300px;
  
  }
  .section_1{
    gap:35px;
  }
}

@media (max-width: 350px) {
  button {
    height: 1.75rem;
    font-size: 0.75rem;
    max-width: 260px;
  
  }
}
</style>