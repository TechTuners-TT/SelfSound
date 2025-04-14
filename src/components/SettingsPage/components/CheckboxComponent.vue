<template>
  <!-- From Uiverse.io by catraco -->
  <label class="container">
    <input checked="checked" type="checkbox" />
    <svg
      viewBox="0 0 512 512"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
      class="chevron-down"
    >
      <path
        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
      ></path>
    </svg>
  </label>
</template>

<style scoped>
/* From Uiverse.io by catraco */
/*------ Settings ------*/
.container {
  --color: #a5a5b0;
  --size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: var(--size);
  user-select: none;
  fill: var(--color);
}

.container .chevron-down {
  position: absolute;
  animation: keyframes-return 0.5s;
}

/* ------ On check event ------ */
.container input:checked ~ .chevron-down {
  animation: keyframes-rotate 0.5s;
  transform: rotate(180deg);
}

/* ------ Hide the default checkbox ------ */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* ------ Animation ------ */
@keyframes keyframes-rotate {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }

  100% {
    transform: rotate(-180deg);
  }
}

@keyframes keyframes-return {
  0% {
    transform: rotate(-180deg);
    opacity: 0;
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>
