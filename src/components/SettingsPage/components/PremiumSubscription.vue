<template>
  <!-- From Uiverse.io by pajenri -->
  <router-link to="/your_premium">
    <div class="card">
      <div class="block-content">
        <p class="block-font sm:text-[20px] text-[18px]">
          Learn about <br />
          Premium
        </p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
/* From Uiverse.io by pajenri */
/*Neo Brutalism pricing card*/
.card {
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 100%;
  background: #6d01d080;
  padding: 1rem;
  padding-top: 1.8rem;
  border-radius: 1rem;
  border: 0.5vmin solid #ffffff;
  box-shadow: 0.2rem 0.2rem #ffffff;
  overflow: hidden;
  color: rgb(255, 255, 255);
}

/*Card content*/
.block-content {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.block-font {
  color: #fcfcfd;
  /*font-size: 20px;*/
  line-height: 1.25;
  font-weight: 700;
}
</style>
