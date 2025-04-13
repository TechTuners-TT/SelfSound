<template>
  <section class="flex flex-col gap-15 max-w w-full mx-auto  section_1">
    <button  
      class=" cursor-pointer  max-w-[560px] w-full h-8 text-sm sm:text-base text-white rounded-xl shadow-sm border border-[rgba(255,255,255,0.5)]  mx-auto block inter-font"  
      style="background-color:rgba(2, 3, 61, 1) ;font-weight: 500;"
      @click="isModalOpen = true">
      Edit profile
    </button>
    <div class="w-full h-px border border-[rgba(255,255,255,0.5)]"></div>
    <p class="mt-10 sm:mt-47.5 text-sm sm:text-base text-white text-center inter-font" style="font-weight: 400; ">
      There's nothing here yet, add your first post!
    </p>
  </section>
<!--  -->
    <div v-if="isModalOpen" class="absolute inset-0 flex justify-center items-center z-50 pointer-events-none " @click.self="isModalOpen = false" >
  <div class="rounded-xl relative pointer-events-auto shadow-xl w-[640px] bg-[#060310]  border border-[rgba(255,255,255,0.5)]  rounded-xl  max-md:px-4  max-sm:px-2"  >
   
    <img :src="user.avatarUrl" :alt="user.name" class="object-contain self-center max-w-full aspect-square w-[100px] h-[100px] rounded-full mx-auto [@media(min-width:1536px)]:mt-11.25 max-md:w-[80px] max-md:h-[80px] max-sm:w-[64px] max-sm:h-[64px]  max-2xl:mt-10 max-xl:mt-8 max-lg:mt-7   max-md:mt-6" />

    <div class="flex flex-col px-[50px] mt-9.25 w-full  max-md:mt-6">
      
       <!-- Name -->
       <div class="flex items-center gap-[91px] font-medium mb-5 max-md:gap-15 max-md:mb-4 justify-end w-[540px] h-[20px] ">
            <div class="text-white text-[16px] h-[16px] w-[50px] max-md:text-sm max-md:w-[70px] inter-font " style="font-weight: 500; ">Name:</div>
            <div class="h-[20px]  w-[400px] rounded-md border border-[rgba(255,255,255,0.2)] bg-[#04020B] flex items-center">
              <input v-model="formData.name" class=" w-full text-[12px]  h-full bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font  rounded-md" style="font-weight: 500; " type="text" />
            </div>
          </div>

          <!-- Login -->
          <div class="flex items-center gap-23.5 font-medium mb-5 max-md:gap-15 max-md:mb-4 justify-end w-[540px] h-[20px]">
            <div class="text-white text-[16px] h-[16px] w-[47px] max-md:text-sm max-md:w-[70px] inter-font " style="font-weight: 500; ">Login:</div>
            <div class="h-[20px] w-[400px] w-full rounded-md border border-[rgba(255,255,255,0.2)] bg-[#04020B] flex items-center">
              <input v-model="formData.login" class="w-full text-[12px]  h-full bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font  rounded-md" style="font-weight: 500; " type="text" />
            </div>
          </div>
<!-- Biography -->
<div class="flex items-center gap-[59px] font-medium max-md:gap-11 max-md:mb-4 justify-end  w-[540px]">
  <div class="text-white  text-[16px] h-[12px] w-[82px] max-md:text-sm max-md:w-[70px] inter-font  relative -top-[20px] " style="font-weight: 500; ">Biography:</div>
  <div class="flex-1 h-[54px]  w-[400px] rounded-md border border-[rgba(255,255,255,0.2)] bg-[#04020B] max-md:h-[38px]  flex items-center ">
    <input v-model="formData.biography" class="w-full h-full text-[12px]  bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font  rounded-md" style="font-weight: 500; " />
  </div>
</div>

      <!-- Tags -->
    
<div class="flex items-center gap-[62px] font-medium mt-[30px] mb-[65px] max-md:flex-row max-md:gap-2">
  <div class="text-white text-[16px] h-[16px] w-[80px] max-md:text-sm inter-font" style="font-weight: 500; ">Tag:</div>
  <div class="flex gap-[20px] w-[400px] max-md:w-full flex-nowrap ">
    <div
      :class="[  
        'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-xl border  inter-font text-black bg-[#FFFFFF] border-opacity-50 cursor-pointer text-center select-none tag_type'  ,
        formData.selectedTag === 'listener' ? 'border-2  border-red-500/50' : 'border-white  border-opacity-50',
        'max-md:w-[80px] max-md:h-[30px] max-md:text-xs' 
      ]"
      @click="selectTag('listener')"
    >
      Listener
    </div>
    <div
      :class="[
        'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-xl border inter-font  border-opacity-50 cursor-pointer text-center text-white bg-[#6D01D0] select-none tag_type',
        formData.selectedTag === 'musician' ? 'border-2  border-red-500/50' : 'border-white  border-opacity-50',
        'max-md:w-[80px] max-md:h-[30px] max-md:text-xs'
      ]"
      @click="selectTag('musician')"
    >
      Musician
    </div>
    <div
      :class="[
        'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-xl border inter-font border-opacity-50 cursor-pointer  text-center bg-[#000C9C]  text-white  select-none tag_type',
        formData.selectedTag === 'learner' ? 'border-2  border-red-500/50' : 'border-white  border-opacity-50',
        'max-md:w-[80px] max-md:h-[30px] max-md:text-xs'
      ]"
      @click="selectTag('learner')"
    >
      Learner
    </div>
  </div>
</div>

      <!-- Save Button -->
      <div class="self-end mb-[45px] font-bold cursor-pointer text-white hover:text-[#6D01D0] max-md:self-center" @click="saveChanges">
        Save changes
      </div>
    </div>
  </div>
</div>
  
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue';

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
        tag?: string | null;
      },
      required: true,
    },
  },
  setup(props, { emit }) {
    const isModalOpen = ref(false);
    const closeModal = () => {
      isModalOpen.value = false;
    };

    const formData = reactive<FormData>({
      name: props.user.name,
      login: props.user.login,
      biography: props.user.biography,
      selectedTag: props.user.tag || null,
    });

    const selectTag = (tag: string) => {
      formData.selectedTag = formData.selectedTag === tag ? null : tag;
    };

    const saveChanges = () => {
      emit('update:user', {
        name: formData.name,
        login: formData.login,
        biography: formData.biography,
        tag: formData.selectedTag,
        avatarUrl: props.user.avatarUrl,
      });
      isModalOpen.value = false;
    };

    watch(
      () => props.user,
      (newUser) => {
        formData.name = newUser.name;
        formData.login = newUser.login;
        formData.biography = newUser.biography;
        formData.selectedTag = newUser.tag || null;
      },
      { deep: true }
    );

    return { formData, isModalOpen, selectTag, saveChanges, closeModal };
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
  .w-\[540px\]{
    width: 510px;
  }
  .w-\[640px\]{
    width: 610px;
  }
  .px-\[50px\]{
    padding-left: 48px;
    padding-right: 48px;
  }
  .mb-\[45px\]{
    margin-bottom: 40px;
  }
  .mb-\[65px\] {
    margin-bottom: 58px;
  }
  .gap-\[62px\]{
    gap:67px;
  }
}

@media (max-width: 1280px) {
  .mt-10 {
    margin-top: 36px;
  }
  .section_1{
    gap:52px;
  }
  .w-\[540px\]{
    width: 490px;
  }
  .w-\[640px\]{
    width: 580px;
  }
  .px-\[50px\]{
    padding-left: 44px;
    padding-right: 44px;
  }
  .mb-\[45px\]{
    margin-bottom: 36px;
  }
  .mb-\[65px\] {
    margin-bottom: 50px;
  }
  .gap-\[62px\]{
    gap:70.5px;
  }
}


@media (max-width: 1024px) {
  .mt-10 {
    margin-top: 32px;
  }
  .section_1{
    gap:48px;
  }
  .w-\[540px\]{
    width: 480px;
  }
  .w-\[640px\]{
    width: 540px;
  }
  .px-\[50px\]{
    padding-left: 28.5px;
    padding-right: 28.5px;
  }
  .mb-\[45px\]{
    margin-bottom: 30px;
  }
  .mb-\[65px\] {
    margin-bottom: 45px;
  }
  .gap-\[62px\]{
    gap:73px;
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
  .w-\[540px\]{
    width: 460px;
  }
  .w-\[640px\]{
    width: 520px;
  }
  .px-\[50px\]{
    padding-left: 13px;
    padding-right: 13px;
  }
  .mb-\[45px\]{
    margin-bottom: 25px;
  }
  .mb-\[65px\] {
    margin-bottom: 40px;
  }
  .mt-\[30px\]{
    margin-top: 14px;
  }
  .gap-\[91px\]{
    gap: 52px;
  }
  .gap-\[59px\]{
    gap: 43px;
  }
  .gap-\[62px\]{
    gap:53.5px;
  }
  .-top-\[20px\]{
    top:-10px
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
  .w-\[540px\]{
    width: 420px;
  }
  .w-\[640px\]{
    width: 480px;
  }
  .px-\[50px\]{
    padding-left: 13px;
    padding-right: 13px;
  }
  .mb-\[45px\]{
    margin-bottom: 20px;
  }
  .mb-\[65px\] {
    margin-bottom: 35px;
  }
  .gap-\[91px\]{
    gap: 57.5px;
  }
  .gap-\[59px\]{
    gap: 41px;
  }
  .gap-\[62px\]{
    gap:52.5px;
  }
 
}


@media (max-width: 580px) {
  button {
    height: 2rem;
    max-width: 400px;
  }
  .w-\[540px\]{
    width: 380px;
  }
  .w-\[640px\]{
    width: 430px;
  }
  .px-\[50px\]{
    padding-left: 8px;
    padding-right: 8px;
  }
  .gap-\[91px\]{
    gap: 62.5px;
  }
  .gap-\[59px\]{
    gap: 39.5px;
  }
  .gap-\[62px\]{
    gap:51.5px;
  }
  .tag_type{
    width: 75px;
  }
}

@media (max-width: 480px) {
  .px-\[50px\]{
    padding-left: 16px;
    padding-right: 16px;
  }
  .gap-\[91px\]{
    gap: 63px;
  }
  .gap-\[59px\]{
    gap: 39.5px;
  }
  .gap-\[62px\]{
    gap:52.5px;
  }
  .tag_type{
    width: 75px;
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
  .w-\[540px\]{
    width: 330px;
  }
  .w-\[640px\]{
    width: 350px;
  }
  .px-\[50px\]{
    padding-left: 2px;
    padding-right: 2px;
  }
  .gap-\[91px\]{
    gap: 64px;
  }
  .gap-\[59px\]{
    gap: 37.5px;
  }
  .gap-\[62px\]{
    gap:53.5px;
  }
  .tag_type{
    width: 60px;
  }
}

@media (max-width: 350px) {
  button {
    height: 1.75rem;
    font-size: 0.75rem;
    max-width: 260px;
  }
  .w-\[540px\]{
    width: 290px;
  }
  .w-\[640px\]{
    width: 310px;
  }
  .px-\[50px\]{
    padding-left: 1px;
    padding-right: 1px;
  }
  .gap-\[91px\]{
    gap: 61px;
  }
  .gap-\[59px\]{
    gap: 34.5px;
  }
  .gap-\[62px\]{
    gap:40.5px;
  }
  .tag_type{
    width: 60px;
  }
}
</style>