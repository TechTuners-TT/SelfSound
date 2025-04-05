<template>
  <!-- Я не знаю, чи краще header чи main -->
  <header>
    <NavBar />
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
