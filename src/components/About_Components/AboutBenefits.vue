<script lang="ts" setup>
import BenefitCard from "./BenefitCard.vue";
import ProfileFeatureIcon from "@/components/SVG/About_SVG/section-function-card-profile_feature_Icon.vue";
import RoleTaggingIcon from "@/components/SVG/About_SVG/section-function-card-role-tagging_Icon.vue";
import PostCreationIcon from "@/components/SVG/About_SVG/section-function-card-post-creation_Icon.vue";
import ReactionsIcon from "@/components/SVG/About_SVG/section-function-card-reactions_Icon.vue";
</script>

<template>
  <section
    class="text-white px-4 sm:px-6 lg:px-8 w-full"
    aria-labelledby="benefits-heading"
  >
    <div class="max-w-screen-xl mx-auto">
      <h2
        id="benefits-heading"
        class="text-4xl sm:text-5xl font-bold text-center uppercase mb-12"
      >
        SelfSound Benefits
      </h2>

      <div class="space-y-6">
        <!-- Ряд 1 -->
        <div class="flex flex-col gap-6 md:flex-row md:gap-6 justify-center">
          <!-- вужча картка -->
          <div class="row-item basis-small">
            <BenefitCard
              title="Profile Feature"
              :icon="ProfileFeatureIcon"
              bgColor="bg-[#02033D]"
              class="h-full"
            >
              <template #content>
                <span>Your profile is a</span>
                <span class="font-medium italic"> personal hub </span>
                <span
                  >where you can showcase your music journey, whether you're an
                  artist, learner, or listener. It helps you
                </span>
                <span class="font-bold">connect </span>
                <span>with others and </span>
                <span class="font-bold">express </span>
                <span>your creativity within the community.</span>
              </template>
            </BenefitCard>
          </div>

          <!-- ширша картка -->
          <div class="row-item basis-large">
            <BenefitCard
              title="Role Tagging"
              :icon="RoleTaggingIcon"
              bgColor="bg-[#000C9C]"
              class="h-full"
            >
              <template #content>
                <span>You can choose a</span>
                <span class="font-bold"> role tag </span>
                <span>(</span>
                <span class="font-medium italic">artist</span>
                <span>, </span>
                <span class="font-medium italic">learner</span>
                <span>, or </span>
                <span class="font-medium italic">listener</span>
                <span
                  >) to define your role within the community. This helps users
                  connect based on their interests and expertise.</span
                >
              </template>
            </BenefitCard>
          </div>
        </div>

        <!-- Ряд 2 (дзеркально) -->
        <div class="flex flex-col gap-6 md:flex-row md:gap-6 justify-center">
          <!-- ширша картка -->
          <div class="row-item basis-large">
            <BenefitCard
              title="Post Creation"
              :icon="PostCreationIcon"
              bgColor="bg-[#000C9C]"
              class="h-full"
            >
              <template #content>
                <span>SelfSound lets you share your music through </span>
                <span class="font-medium italic">four post types</span>
                <span>: </span>
                <span class="font-bold">media posts, </span>
                <span class="font-bold">audio posts, </span>
                <span class="font-bold">sheet music posts, </span>
                <span class="font-bold">lyric posts</span>
                <span
                  >. Each format helps you share your work in the most fitting
                  way, fostering collaboration and feedback.</span
                >
              </template>
            </BenefitCard>
          </div>

          <!-- вужча картка -->
          <div class="row-item basis-small">
            <BenefitCard
              title="Reactions"
              :icon="ReactionsIcon"
              bgColor="bg-[#02033D]"
              class="h-full"
            >
              <template #content>
                <span class="font-medium italic">Engage </span>
                <span
                  >with the community by providing feedback or simply showing
                  support. This fosters
                </span>
                <span class="font-bold">interaction</span>
                <span>, </span>
                <span class="font-bold">collaboration</span>
                <span>, and </span>
                <span class="font-bold">inspiration</span>
                <span> among music lovers and creators.</span>
              </template>
            </BenefitCard>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.row-item {
  width: 100%; /* Мобільні: однакові картки по повній ширині */
  flex: none; /* Щоб basis працював без росту */
  height: 286px; /* Фіксована висота на всіх пристроях */
}

@media (min-width: 768px) {
  .basis-small {
    flex-basis: calc(50% - 35px); /* вужча на ~70px */
  }
  .basis-large {
    flex-basis: calc(50% + 35px); /* ширша на ~70px */
  }
}

/* Забезпечуємо рівну висоту карток */
.BenefitCard,
.benefit-card {
  height: 100%;
}
</style>
