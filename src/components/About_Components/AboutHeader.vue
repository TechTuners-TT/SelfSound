<template>
  <header
    class="flex flex-col justify-center items-end px-28 py-6 w-full text-white bg-gray-950 min-h-[100px] max-md:px-5 max-md:max-w-full"
  >
    <div
      class="flex flex-wrap gap-10 justify-between items-center max-w-full w-[1642px]"
    >
      <h1 class="self-stretch my-auto text-5xl w-[165px] max-md:text-4xl">
        SelfSound
      </h1>
      <nav
        class="flex flex-wrap gap-10 items-center self-stretch my-auto text-2xl min-w-60 max-md:max-w-full"
        aria-label="Main navigation"
      >
        <a href="#premium" class="self-stretch my-auto">Premium</a>
        <a href="#support" class="self-stretch my-auto">Support</a>
        <div
          class="flex shrink-0 self-stretch my-auto w-px bg-white h-[30px]"
          aria-hidden="true"
        ></div>
        <a href="#guest" class="self-stretch my-auto"> Guest mode </a>
        <a href="#login" class="self-stretch my-auto">log in</a>
        <a
          href="#signup"
          class="overflow-hidden gap-2.5 self-stretch px-7 py-3 my-auto font-semibold text-blue-900 bg-white min-h-[50px] rounded-[40px] w-[140px] max-md:px-5"
        >
          Sign up
        </a>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
// Header component for the About page
</script>
