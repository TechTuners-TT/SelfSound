<template>
  <section class="flex flex-col gap-2.5 max-w w-full mx-auto  ">
    <button  
      class=" max-w-[560px] w-full h-8 text-sm sm:text-base  text-white rounded-xl border shadow-sm border-white border-opacity-50 mx-auto block "
      style="background-color:rgba(2, 3, 61, 1)"
      @click="isModalOpen = true">

      Edit profile

    </button>
    <div class="mt-5.5 sm:mt-7.5 w-full h-px bg-white bg-opacity-50"></div>
    <p class="mt-10 sm:mt-32 text-sm sm:text-base text-white text-center">
      There's nothing here yet, add your first post!
    </p>


 
    









    <div
      v-if="isModalOpen"
      class="absolute inset-0 flex justify-center items-center z-50 pointer-events-none"
    >
      <div
        class="rounded-xl p-6 relative pointer-events-auto shadow-xl"
        style="width: 640px; height: auto; background-color: #060310;"
      >
        <button
          class="absolute top-2 right-3 text-white text-xl"
          @click="isModalOpen = false"
        >
          &times;
        </button>
        <img
          :src="user.avatarUrl"
          :alt="user.name"
          class="object-contain self-center max-w-full aspect-square w-[100px] h-[100px] rounded-full mx-auto mt-4"
        />
        <div
          class="flex flex-col px-12 mt-9 w-full max-md:px-5 max-md:max-w-full"
        >
          <div
            class="flex flex-wrap gap-10 items-center font-medium whitespace-nowrap max-md:max-w-full"
          >
            <div class="self-stretch my-auto">Name:</div>
            <div
              class="flex grow shrink self-stretch my-auto h-5 rounded-md border border-solid bg-zinc-950 border-white border-opacity-20 min-w-60 w-[390px]"
            >
              <input
                v-model="formData.name"
                class="w-full h-full bg-transparent border-none outline-none px-2 text-white"
                type="text"
              />
            </div>
          </div>
          <div
            class="flex flex-wrap gap-10 items-center mt-5 font-medium whitespace-nowrap max-md:max-w-full"
          >
            <div class="grow shrink self-stretch my-auto w-[38px]">Login:</div>
            <div
              class="flex grow shrink self-stretch my-auto h-5 rounded-md border border-solid bg-zinc-950 border-white border-opacity-20 min-w-60 w-[391px]"
            >
              <input
                v-model="formData.login"
                class="w-full h-full bg-transparent border-none outline-none px-2 text-white"
                type="text"
              />
            </div>
          </div>
          <div
            class="flex flex-wrap gap-10 items-start mt-5 font-medium whitespace-nowrap max-md:max-w-full"
          >
            <div>Biography:</div>
            <div
              class="flex grow shrink w-96 rounded-md border border-solid bg-zinc-950 border-white border-opacity-20 h-[54px] min-w-60"
            >
              <textarea
                v-model="formData.biography"
                class="w-full h-full bg-transparent border-none outline-none px-2 py-1 text-white resize-none"
              ></textarea>
            </div>
          </div>
          <div
            class="flex flex-wrap gap-10 items-center self-start mt-8 whitespace-nowrap max-md:max-w-full"
          >
            <div class="self-stretch my-auto font-medium">Tag:</div>
            <div class="flex gap-5 items-center self-stretch my-auto min-w-60 max-md:flex-wrap max-md:justify-center">
              <div
                :class="[
                  'gap-2.5 self-stretch py-2.5 px-5 my-auto rounded-xl border border-solid border-white border-opacity-50 min-h-8 w-[100px] cursor-pointer text-center',
                  formData.selectedTag === 'listener'
                    ? 'text-black bg-white'
                    : 'text-white bg-transparent',
                ]"
                @click="selectTag('listener')"
              >
                Listener
              </div>
              <div
                :class="[
                  'gap-2.5 self-stretch py-2.5 px-4 my-auto rounded-xl border border-solid border-white border-opacity-50 min-h-8 w-[100px] cursor-pointer text-center',
                  formData.selectedTag === 'musician'
                    ? 'bg-purple-700'
                    : 'text-white bg-transparent',
                ]"
                @click="selectTag('musician')"
              >
                Musician
              </div>
              <div
                :class="[
                  'gap-2.5 self-stretch py-2.5 px-5 my-auto rounded-xl border border-solid border-white border-opacity-50 min-h-8 w-[100px] cursor-pointer text-center',
                  formData.selectedTag === 'learner'
                    ? 'bg-blue-900'
                    : 'text-white bg-transparent',
                ]"
                @click="selectTag('learner')"
              >
                Learner
              </div>
            </div>
          </div>
          <div
            class="self-end mt-16 font-bold max-md:mt-10 cursor-pointer hover:underline"
            @click="saveChanges"
          >
            Save changes
          </div>
        </div>
      </div>
    </div>



  </section>
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
        username: string;
        avatarUrl: string;
        biography?: string;
        tag?: string;
      },
      required: true,
    },
  },
  emits: ["update:user"],
  setup(props, { emit }) {
    const isModalOpen = ref(false);

    // Initialize form data from user props
    const formData = reactive<FormData>({
      name: props.user.name || "",
      login: props.user.username || "",
      biography: props.user.biography || "",
      selectedTag: props.user.tag || null,
    });

    // Update form data when user prop changes
    watch(
      () => props.user,
      (newUser) => {
        formData.name = newUser.name || "";
        formData.login = newUser.username || "";
        formData.biography = newUser.biography || "";
        formData.selectedTag = newUser.tag || null;
      },
      { deep: true },
    );

    const selectTag = (tag: string) => {
      formData.selectedTag = formData.selectedTag === tag ? null : tag;
    };

    const saveChanges = () => {
      // Emit updated user data to parent component
      emit("update:user", {
        ...props.user,
        name: formData.name,
        username: formData.login,
        biography: formData.biography,
        tag: formData.selectedTag,
      });

      // Close the modal
      isModalOpen.value = false;
    };

    return {
      isModalOpen,
      formData,
      selectTag,
      saveChanges,
    };
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




@media (max-width: 768px) {
  .mt-11 {
    margin-top: 2rem;
  }

  .mt-16 {
    margin-top: 3rem;
  }

  .mt-10 {
    margin-top: 2rem;
  }
  button {
    
    max-width: 520px;
  
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
    margin-top: 1.5rem;
  }

  .text-base {
    font-size: 0.875rem;
  }

  button {
    height: 2rem;
    max-width: 500px;
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
    margin-top: 1rem;
  }

  .text-base {
    font-size: 0.75rem;
  }

  button {
    height: 1.75rem;
    font-size: 0.75rem;
    max-width: 300px;
  
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