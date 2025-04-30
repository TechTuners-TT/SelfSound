<template>
  <section class="flex flex-col gap-15 mx-auto section_1">
    <button
      class="cursor-pointer w-full h-8 text-sm sm:text-base text-white rounded-[5px] shadow-sm mx-auto block inter-font"
      style="background-color: rgba(2, 3, 61, 1); font-weight: 500"
      @click="isModalOpen = true"
    >
      Edit profile
    </button>
    <div class="w-full h-px border border-[rgba(255,255,255,0.5)]"></div>
    <p
      class="mt-10 sm:mt-47.5 text-sm sm:text-base text-white text-center inter-font text_size"
      style="font-weight: 400"
    >
      There's nothing here yet, add your first post!
    </p>
  </section>
  <!--  -->
  <div
    v-if="isModalOpen"
    class="absolute inset-0 flex justify-center items-center z-999"
    @click.self="isModalOpen = false"
  >
    <div
      class="rounded-xl relative pointer-events-auto shadow-[10px] w-5/6 sm:w-5/7 md:w-4/5 lg:w-5/6 xl:w-9/10 bg-[#060310] border border-[rgba(255,255,255,0.5)] rounded-xl max-md:px-4 max-sm:px-2"
    >
      <img
        :src="formData.avatarUrl"
        :alt="formData.name"
        @click="triggerFileInput"
        class="object-contain self-center max-w-full aspect-square w-[100px] h-[100px] border rounded-full mx-auto [@media(min-width:1536px)]:mt-11.25 max-md:w-[80px] max-md:h-[80px] max-sm:w-[64px] max-sm:h-[64px] max-2xl:mt-10 max-xl:mt-8 max-lg:mt-7 max-md:mt-6"
      />
      <!-- Схований input для вибору зображення -->
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        class="hidden"
      />

      <div class="flex flex-col px-[50px] mt-9.25 w-full max-md:mt-6">
        <!-- Name -->
        <div
          class="flex items-center gap-[91px] font-medium mb-5 max-md:gap-15 max-md:mb-4 justify-end w-[540px] h-[20px]"
        >
          <div
            class="text-white text-[16px] h-[16px] w-[50px] max-md:text-sm max-md:w-[70px] inter-font"
            style="font-weight: 500"
          >
            Name:
          </div>
          <div
            class="h-[20px] w-[400px] rounded-[5px] border border-[rgba(255,255,255,0.2)] bg-[#04020B] flex items-center"
          >
            <input
              v-model="formData.name"
              maxlength="15"
              class="w-full text-[12px] h-full bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font rounded-md"
              style="font-weight: 500"
              type="text"
            />
          </div>
        </div>

        <!-- Login -->
        <div
          class="flex items-center gap-23.5 font-medium mb-5 max-md:gap-15 max-md:mb-4 justify-end w-[540px] h-[20px]"
        >
          <div
            class="text-white text-[16px] h-[16px] w-[47px] max-md:text-sm max-md:w-[70px] inter-font"
            style="font-weight: 500"
          >
            Login:
          </div>
          <div
            class="h-[20px] w-[400px] w-full rounded-[5px] border border-[rgba(255,255,255,0.2)] bg-[#04020B] flex items-center"
          >
            <input
              v-model="formData.login"
              @input="onLoginInput"
              maxlength="20"
              class="w-full text-[12px] h-full bg-[#04020B] border-none outline-none text-white px-2 max-md:text-sm inter-font rounded-md"
              style="font-weight: 500"
              type="text"
            />
          </div>
        </div>
        <!-- Biography -->
        <div
          class="flex items-center gap-[59px] font-medium max-md:gap-11 max-md:mb-4 justify-end w-[540px]"
        >
          <div
            class="text-white text-[16px] h-[12px] w-[82px] max-md:text-sm max-md:w-[70px] inter-font relative -top-[20px]"
            style="font-weight: 500"
          >
            Biography:
          </div>
          <div
            class="flex-1 h-[54px] w-[400px] rounded-[5px] border border-[rgba(255,255,255,0.2)] bg-[#04020B] max-md:h-[38px] flex items-center"
          >
            <textarea
              v-model="formData.biography"
              maxlength="130"
              class="w-full h-full text-[12px] bg-[#04020B] border-none outline-none text-white px-2 py-2 max-md:text-sm inter-font rounded-md resize-none"
              style="font-weight: 500"
              placeholder="Enter your biography..."
            ></textarea>
          </div>
        </div>

        <!-- Tags -->

        <div
          class="flex items-center gap-[62px] font-medium mt-[30px] mb-[65px] max-md:flex-row max-md:gap-2"
        >
          <div
            class="text-white text-[16px] h-[16px] w-[80px] max-md:text-sm inter-font"
            style="font-weight: 500"
          >
            Tag:
          </div>
          <div class="flex gap-[20px] w-[400px] max-md:w-full flex-nowrap">
            <div
              :class="[
                'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-[5px]   inter-font text-black bg-[#FFFFFF]  cursor-pointer text-center select-none tag_type',
                formData.selectedTag === 'listener'
                  ? 'border border-2  border-red-500/50 border-opacity-50'
                  : '',
                'max-md:w-[80px] max-md:h-[30px] max-md:text-xs',
              ]"
              @click="selectTag('listener')"
            >
              Listener
            </div>
            <div
              :class="[
                'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-[5px]  inter-font   cursor-pointer text-center text-white bg-[#6D01D0] select-none tag_type',
                formData.selectedTag === 'musician'
                  ? 'border border-2  border-red-500/50 border-opacity-50'
                  : '',
                'max-md:w-[80px] max-md:h-[30px] max-md:text-xs',
              ]"
              @click="selectTag('musician')"
            >
              Musician
            </div>
            <div
              :class="[
                'w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-[5px]  inter-font  cursor-pointer  text-center bg-[#000C9C]  text-white  select-none tag_type',
                formData.selectedTag === 'learner'
                  ? 'border border-2  border-red-500/50 border-opacity-50'
                  : '',
                'max-md:w-[80px] max-md:h-[30px] max-md:text-xs',
              ]"
              @click="selectTag('learner')"
            >
              Learner
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div
          class="self-end mb-[45px] font-bold cursor-pointer text-white hover:text-[#6D01D0] max-md:mr-[30px]"
          @click="saveChanges"
        >
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
  avatarUrl: string;
  selectedTag: string | "Add tag";
}

export default defineComponent({
  props: {
    user: {
      type: Object as () => {
        name: string;
        login: string;
        avatarUrl: string;
        biography: string;
        tag?: string;
      },
      required: true,
    },
  },
  setup(props, { emit }) {
    const isModalOpen = ref(false);

    const formData = reactive<FormData>({
      name: props.user.name,
      login: props.user.login,
      avatarUrl: props.user.avatarUrl,
      biography: props.user.biography,
      selectedTag: props.user.tag || "Add tag",
    });

    const onLoginInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      formData.login = input.value.replace(/[@\s.]/g, "");
    };

    const selectTag = (tag: string) => {
      formData.selectedTag = formData.selectedTag === tag ? "Add tag" : tag;
    };

    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        formData.avatarUrl = URL.createObjectURL(file);
      }
    };

    const saveChanges = () => {
      emit("update:user", {
        name: formData.name,
        login: formData.login,
        biography: formData.biography,
        tag: formData.selectedTag,
        avatarUrl: formData.avatarUrl,
      });
      isModalOpen.value = false;
    };

    watch(
      () => props.user,
      (newUser) => {
        formData.name = newUser.name;
        formData.login = newUser.login;
        formData.biography = newUser.biography;
        formData.avatarUrl = newUser.avatarUrl;
        formData.selectedTag = newUser.tag || "Add tag";
      },
    );

    return {
      isModalOpen,
      formData,
      onLoginInput,
      selectTag,
      fileInput,
      triggerFileInput,
      handleFileChange,
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

.inter-font {
  font-family: "Inter", sans-serif;
}

textarea::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* світло-сірий */
  border-radius: 8px;
}

/* Для Firefox */
textarea {
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
</style>
