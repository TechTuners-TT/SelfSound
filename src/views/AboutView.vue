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

    <!-- Секція з градієнтним фоном тільки під компонентами AboutBenefits і AboutWhyChoose -->
    <section class="relative w-full">
      <AboutGradientBackground />
      <!-- Градієнтний фон -->
      <div class="relative z-10 space-y-20 px-4 py-16">
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
