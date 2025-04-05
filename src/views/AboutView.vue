<script setup lang="ts">
import AboutPage from "@/components/About_Components/AboutPage.vue";
import AboutHeader from "@/components/About_Components/AboutHeader.vue";
import AboutHero from "@/components/About_Components/AboutHero.vue";
import BenefitCard from "@/components/About_Components/BenefitCard.vue";
import AboutBenefits from "@/components/About_Components/AboutBenefits.vue";
import AboutWhyChoose from "@/components/About_Components/AboutWhyChoose.vue";
import AboutFooter from "@/components/About_Components/AboutFooter.vue";
</script>

<template>
  <main>
<AboutHeader />
                        <AboutHero />
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
