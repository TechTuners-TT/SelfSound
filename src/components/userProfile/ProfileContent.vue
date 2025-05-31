<template>
  <section class="flex flex-col gap-15 mx-auto section_1">
    <div
      class="px-[10px] sm:px-[40px] md:px-[20px] lg:px-[30px] xl:px-[20px] 2xl:px-[40px]"
    >
      <button
        class="cursor-pointer w-full h-8 text-[12px] sm:text-[13px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px] text-white rounded-[5px] shadow-sm mx-auto block inter-font"
        style="background-color: rgba(0, 12, 156, 0.4); font-weight: 500"
        @click="isModalOpen = true"
      >
        Edit profile
      </button>
    </div>

    <!-- Posts are handled by parent component, so no divider needed here -->
  </section>

  <!-- Edit Profile Modal - POSITIONED HIGHER -->
  <Teleport to="body">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex justify-center items-start pt-16 z-[9999] bg-black/70"
      @click.self="isModalOpen = false"
    >
      <div
        class="rounded-xl relative pointer-events-auto shadow-[10px] w-5/6 sm:w-6/8 md:w-5/6 lg:w-8/9 xl:w-9/10 2xl:w-full max-w-2xl bg-[#060310] border border-[rgba(255,255,255,0.5)] max-md:px-4 max-sm:px-2"
      >
        <!-- Error message display -->
        <div
          v-if="errorMessage"
          class="mx-4 mt-4 p-3 bg-red-600 text-white rounded text-sm"
        >
          {{ errorMessage }}
        </div>

        <img
          :src="formData.avatarPreview"
          :alt="formData.name"
          @click="triggerFileInput"
          class="object-cover self-center max-w-full border rounded-full mx-auto w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] md:w-[74px] md:h-[74px] lg:w-[84px] lg:h-[84px] xl:h-[90px] xl:w-[90px] 2xl:w-[100px] 2xl:h-[100px] 2xl:mt-[45px] xl:mt-[42px] lg:mt-[40px] md:[36px] sm:mt-[32px] mt-[30px] cursor-pointer"
        />
        <!-- Hidden input for image selection -->
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="image/*"
          class="hidden"
        />

        <div
          class="flex flex-col px-[7px] sm:px-[8px] md:px-[25px] lg:px-[30px] xl:px-[25px] 2xl:px-[50px] w-full 2xl:mt-[37px] xl:mt-[32px] lg:mt-[27px] md:[25px] sm:mt-[22px] mt-[20px]"
        >
          <!-- Name -->
          <div
            class="flex items-center gap-[41px] sm:gap-[51px] md:gap-[51px] lg:gap-[71px] xl:gap-[81px] 2xl:gap-[91px] font-medium mb-5 h-[20px]"
          >
            <div
              class="text-white text-[16px] h-[16px] max-md:text-sm inter-font"
              style="font-weight: 500"
            >
              Name:
            </div>
            <div
              class="h-[20px] w-full rounded-[5px] border border-[rgba(255,255,255,0.2)] bg-[#04020B] flex items-center"
            >
              <input
                v-model="formData.name"
                maxlength="15"
                class="w-full text-[10px] sm:text-[11px] md:text-[12px] h-full bg-[#04020B] border-none outline-none text-white px-2 inter-font rounded-md"
                style="font-weight: 500"
                type="text"
              />
            </div>
          </div>

          <!-- Login -->
          <div
            class="flex items-center gap-[44px] sm:gap-[54px] md:gap-[54px] lg:gap-[74px] xl:gap-[84px] 2xl:gap-[94px] font-medium mb-5 h-[20px]"
          >
            <div
              class="text-white text-[16px] h-[16px] max-md:text-sm inter-font"
              style="font-weight: 500"
            >
              Login:
            </div>
            <div
              class="h-[20px] w-full rounded-[5px] border border-[rgba(255,255,255,0.2)] bg-[#04020B] flex items-center"
            >
              <input
                v-model="formData.login"
                @input="onLoginInput"
                maxlength="20"
                class="w-full text-[10px] sm:text-[11px] md:text-[12px] h-full bg-[#04020B] border-none outline-none text-white px-2 inter-font rounded-md"
                style="font-weight: 500"
                type="text"
              />
            </div>
          </div>
          <!-- Biography -->
          <div
            class="flex items-center gap-[13px] sm:gap-[23px] md:gap-[19px] lg:gap-[39px] xl:gap-[49px] 2xl:gap-[59px] font-medium"
          >
            <div
              class="text-white text-[16px] h-[12px] max-md:text-sm inter-font relative max-md:-top-[12px] -top-[20px]"
              style="font-weight: 500"
            >
              Biography:
            </div>
            <div
              class="flex-1 h-[54px] w-full rounded-[5px] border border-[rgba(255,255,255,0.2)] bg-[#04020B] max-md:h-[38px] flex items-center"
            >
              <textarea
                v-model="formData.biography"
                maxlength="130"
                class="w-full h-full text-[10px] sm:text-[11px] md:text-[12px] bg-[#04020B] border-none outline-none text-white px-2 py-1 inter-font rounded-md resize-none"
                style="font-weight: 500"
                placeholder="Enter your biography..."
              ></textarea>
            </div>
          </div>

          <!-- Tags -->
          <div
            class="flex items-center gap-[57px] sm:gap-[67px] md:gap-[70px] lg:gap-[89px] xl:gap-[99px] 2xl:gap-[109px] font-medium 2xl:mt-[30px] xl:mt-[28px] lg:mt-[26px] md:mt-[24px] sm:mt-[22px] mt-[20px] 2xl:mb-[65px] xl:mb-[60px] lg:mb-[55px] md:mb-[50px] sm:mb-[45px] mb-[40px] max-md:flex-row"
          >
            <div
              class="text-white text-[16px] h-[16px] max-md:text-sm inter-font"
              style="font-weight: 500"
            >
              Tag:
            </div>
            <div
              class="flex gap-[14px] sm:gap-[14px] md:gap-[14px] lg:gap-[16px] xl:gap-[18px] [@media(min-width:1537px)]:gap-[20px] flex-nowrap w-full"
            >
              <div
                :class="[
                  'flex-1 max-w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-[5px] inter-font text-black bg-[#FFFFFF] cursor-pointer text-center select-none tag_type',
                  formData.selectedTag === 'Listener'
                    ? 'ring-2 ring-[#6D01D0]'
                    : '',
                  'max-md:h-[30px] max-md:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px]',
                ]"
                @click="selectTag('Listener')"
              >
                Listener
              </div>
              <div
                :class="[
                  'flex-1 max-w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-[5px] inter-font cursor-pointer text-center text-white bg-[#6D01D0] select-none tag_type',
                  formData.selectedTag === 'Musician'
                    ? 'ring-2 ring-white '
                    : '',
                  'max-md:h-[30px] max-md:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px]',
                ]"
                @click="selectTag('Musician')"
              >
                Musician
              </div>
              <div
                :class="[
                  'flex-1 max-w-[100px] h-[32px] leading-[32px] py-0 px-0 rounded-[5px] inter-font cursor-pointer text-center text-white bg-[#000C9C] select-none tag_type',
                  formData.selectedTag === 'Learner' ? 'ring-2 ring-white' : '',
                  'max-md:h-[30px] max-md:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[14px] [@media(min-width:1537px)]:text-[16px]',
                ]"
                @click="selectTag('Learner')"
              >
                Learner
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div
            class="self-end [@media(min-width:1537px)]:mb-[45px] xl:mb-[45px] lg:mb-[40px] md:mb-[35px] sm:mb-[30px] mb-[30px] font-bold cursor-pointer text-white hover:text-[#6D01D0] text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] [@media(min-width:1537px)]:text-[16px]"
            @click="saveChanges"
            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
          >
            {{ isSubmitting ? "Saving..." : "Save changes" }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface FormData {
  name: string;
  login: string;
  biography: string;
  avatarPreview: string;
  selectedTag: string | "Add tag";
  avatarFile: File | null;
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
    const isSubmitting = ref(false);
    const errorMessage = ref("");

    const formData = reactive<FormData>({
      name: props.user.name,
      login: props.user.login,
      avatarPreview: props.user.avatarUrl,
      biography: props.user.biography,
      selectedTag: props.user.tag || "Add tag",
      avatarFile: null,
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
      if (!isSubmitting.value) {
        fileInput.value?.click();
      }
    };

    const handleFileChange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        // Validate file type on frontend first
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowedTypes.includes(file.type)) {
          errorMessage.value = "Please select a PNG or JPEG image";
          return;
        }

        // Validate file size (optional - e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          errorMessage.value = "Image must be smaller than 5MB";
          return;
        }

        formData.avatarFile = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          formData.avatarPreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);

        try {
          errorMessage.value = "";
          console.log("Uploading avatar immediately...");

          const newAvatarUrl = await uploadAvatar();
          if (newAvatarUrl) {
            // Update the preview with the actual uploaded URL
            formData.avatarPreview = newAvatarUrl;
            // Clear the file since it's already uploaded
            formData.avatarFile = null;

            // Emit update to parent immediately
            emit("update:user", {
              ...props.user,
              avatarUrl: newAvatarUrl,
            });
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          errorMessage.value =
            error instanceof Error ? error.message : "Failed to upload avatar";
          // Reset file input on error
          formData.avatarFile = null;
          formData.avatarPreview = props.user.avatarUrl;
        }
      }
    };

    // Upload avatar function
    const uploadAvatar = async (): Promise<string | null> => {
      if (!formData.avatarFile) return null;

      const data = new FormData();
      data.append("avatar", formData.avatarFile);

      const res = await fetch(`${API_URL}/profile/me/avatar`, {
        method: "PATCH",
        credentials: "include",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Avatar upload failed");
      }

      const json = await res.json();
      return json.avatar_url;
    };

    // Save changes function with actual API calls
    const saveChanges = async () => {
      if (isSubmitting.value) return;

      isSubmitting.value = true;
      errorMessage.value = "";

      try {
        // 1) Update text fields
        const profilePayload = {
          name: formData.name,
          login: formData.login,
          description: formData.biography,
          tag_id:
            formData.selectedTag === "Add tag" ? null : formData.selectedTag,
        };

        console.log("Sending profile update:", profilePayload);

        const resProfile = await fetch(`${API_URL}/profile/me`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profilePayload),
        });

        if (!resProfile.ok) {
          const err = await resProfile.json();
          throw new Error(err.detail || "Profile update failed");
        }

        console.log("Profile updated successfully");

        // 2) Upload avatar if changed
        if (formData.avatarFile) {
          console.log("Uploading avatar...");
          await uploadAvatar();
          console.log("Avatar uploaded successfully");
        }

        // 3) Fetch updated profile data
        const profileRes = await fetch(`${API_URL}/profile/me/profile`, {
          credentials: "include",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!profileRes.ok) {
          throw new Error("Failed to fetch updated profile");
        }

        const updatedProfile = await profileRes.json();
        console.log("Updated profile data:", updatedProfile);

        // 4) Emit the updated user to parent
        emit("update:user", {
          id: updatedProfile.id,
          name: updatedProfile.name || "",
          login: updatedProfile.login || "",
          biography: updatedProfile.description || "",
          avatarUrl: updatedProfile.avatar_url || "",
          tag: updatedProfile.tag_id || "Add tag",
        });

        // 5) Close modal
        isModalOpen.value = false;
      } catch (error: unknown) {
        console.error("Error in saveChanges:", error);
        let msg = "Unknown error occurred";
        if (error instanceof Error) {
          msg = error.message;
        }
        errorMessage.value = msg;
      } finally {
        isSubmitting.value = false;
      }
    };

    watch(
      () => props.user,
      (newUser) => {
        formData.name = newUser.name;
        formData.login = newUser.login;
        formData.biography = newUser.biography;
        formData.avatarPreview = newUser.avatarUrl;
        formData.selectedTag = newUser.tag || "Add tag";
        formData.avatarFile = null;
      },
    );

    return {
      isModalOpen,
      isSubmitting,
      errorMessage,
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

/* For Firefox */
textarea {
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
</style>
