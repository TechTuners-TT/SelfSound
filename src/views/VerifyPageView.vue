<template>
  <main class="flex justify-center items-center w-full h-screen px-4">
    <div
      class="bg-[#02033D] text-white flex flex-col justify-center items-center p-8 rounded-lg aspect-square w-full max-w-[480px]"
    >
      <svg
        class="mb-6"
        width="64"
        height="64"
        viewBox="0 0 66 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="32" fill="white" />
        <path
          d="M42.6665 21.3335H21.3332C19.8665 21.3335 18.6798 22.5335 18.6798 24.0002L18.6665 40.0002C18.6665 41.4668 19.8665 42.6668 21.3332 42.6668H42.6665C44.1332 42.6668 45.3332 41.4668 45.3332 40.0002V24.0002C45.3332 22.5335 44.1332 21.3335 42.6665 21.3335ZM42.6665 26.6668L31.9998 33.3335L21.3332 26.6668V24.0002L31.9998 30.6668L42.6665 24.0002V26.6668Z"
          fill="#02033D"
        />
      </svg>

      <h1 class="text-xl font-bold inter-font mb-6">Check Your Email</h1>

      <p class="text-md inter-font">We've sent a verification link to</p>
      <p class="text-md inter-font">email@example.com</p>

      <hr class="border-t border-white/20 w-full my-6 inter-font" />

      <p class="text-md mb-6 inter-font">Didn't receive the email?</p>
      <button
        class="relative inter-font mb-6 bg-white hover:bg-[#000C9C]/50 text-[#02033D] hover:text-white font-bold inter-font text-md px-[16px] py-[12px] rounded-lg"
      >
        Resend Email
      </button>
      <p class="text-md text-center inter-font">
        Make sure to check your spam folder if you don't see the email in your
        inbox
      </p>
    </div>
  </main>
</template>
