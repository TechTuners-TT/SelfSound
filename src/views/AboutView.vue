<script setup lang="ts">
import AboutHeader from "@/components/About_Components/AboutHeader.vue";
import AboutHero from "@/components/About_Components/AboutHero.vue";
import AboutGradientBackground from "@/components/About_Components/AboutGradientBackground.vue";
import AboutBenefits from "@/components/About_Components/AboutBenefits.vue";
import AboutWhyChoose from "@/components/About_Components/AboutWhyChoose.vue";
import AboutFooter from "@/components/About_Components/AboutFooter.vue";
</script>

<template>
  <main>
    <AboutHeader />
    <AboutHero />

    <section class="relative w-full">
      <AboutGradientBackground />
      <div
        class="relative z-10 px-[10vw] pt-[17.59vh] max-md:pt-[6vh] pb-[13.89vh] space-y-20"
      >
        <AboutBenefits />
        <AboutWhyChoose />
      </div>
    </section>

    <AboutBenefits />
    <AboutWhyChoose />
    <AboutFooter />

    <!-- Main Content Area -->
    <div class="container mx-auto p-0">
      <router-view />
    </div>
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
