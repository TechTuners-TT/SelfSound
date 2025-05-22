<template>
  <div
    v-for="(file, index) in content"
    :key="index"
    class="relative bg-[#000C9C]/40 rounded-[10px] p-5 text-white w-full mb-4"
  >
    <div class="flex items-center justify-between">
      <!-- Ліва частина -->
      <div class="flex items-center gap-5 w-3/4 min-w-0">
        <div
          class="w-16 h-16 rounded-[10px] overflow-hidden flex items-center justify-center bg-white/10 shrink-0"
        >
          <div class="w-[32px] h-[32px] flex items-center justify-center">
            <svg width="21" height="26" viewBox="0 0 23 28" fill="none">
              <path
                d="M14.125 1H3.625C2.92881 1 2.26113 1.27393 1.76884 1.76152C1.27656 2.24912 1 2.91044 1 3.6V24.4C1 25.0896 1.27656 25.7509 1.76884 26.2385C2.26113 26.7261 2.92881 27 3.625 27H19.375C20.0712 27 20.7389 26.7261 21.2312 26.2385C21.7234 25.7509 22 25.0896 22 24.4V8.8M14.125 1L22 8.8M14.125 1L14.125 8.8L22 8.8"
                stroke="white"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>

        <div class="flex flex-col truncate w-full min-w-0">
          <p class="truncate text-lg font-medium leading-none">
            {{ file.fileName }}
          </p>
          <p class="truncate text-sm text-white/50 leading-none mt-1">
            {{ file.composer }}
          </p>
        </div>
      </div>

      <!-- Кнопка завантаження -->
      <a
        :href="file.downloadUrl"
        download
        class="w-10 h-10 rounded-full bg-[#6D01D0] flex items-center justify-center shrink-0"
      >
        <div class="w-5 h-5 flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 18 17" fill="none">
            <path
              d="M16.5 10.3501V13.6834C16.5 14.1255 16.3244 14.5494 16.0118 14.8619C15.6993 15.1745 15.2754 15.3501 14.8333 15.3501H3.16667C2.72464 15.3501 2.30072 15.1745 1.98816 14.8619C1.67559 14.5494 1.5 14.1255 1.5 13.6834V10.3501M4.83333 6.18343L9 10.3501M9 10.3501L13.1667 6.18343M9 10.3501V0.350098"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface MusicXMLFile {
  fileName: string;
  composer: string;
  downloadUrl: string;
}

defineProps<{
  content: MusicXMLFile[];
}>();
</script>
