<template>
  <main
class="overflow-hidden pb-16 bg-gray-950"
    :style="{
      backgroundColor: '#060310',
      minHeight: '100vh',
      width: '100%',
    }"
>
    <AboutHeader />
    <AboutHero />
    <AboutBenefits />
    <AboutWhyChoose />
    <AboutFooter />
  </main>
</template>

<script lang="ts" setup>
import AboutHeader from "./AboutHeader.vue";
import AboutHero from "./AboutHero.vue";
import AboutBenefits from "./AboutBenefits.vue";
import AboutWhyChoose from "./AboutWhyChoose.vue";
import AboutFooter from "./AboutFooter.vue";
</script>
