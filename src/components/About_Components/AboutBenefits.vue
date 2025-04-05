<script lang="ts" setup>
import BenefitCard from "./BenefitCard.vue";
</script>

<template>
  <section
    class="flex overflow-hidden flex-col justify-center items-center px-20 py-40 max-md:px-5 max-md:py-24 max-md:max-w-full"
    aria-labelledby="benefits-heading"
  >
    <div class="mb-0 w-full max-w-[1552px] max-md:mb-2.5 max-md:max-w-full">
      <div class="mx-2.5 w-full text-white max-md:max-w-full">
        <h2
          id="benefits-heading"
          class="text-5xl font-bold text-center uppercase max-md:max-w-full max-md:text-4xl"
        >
          SelfSound Benefits
        </h2>
        <div
          class="flex flex-wrap gap-10 items-start mt-16 w-full max-md:mt-10 max-md:max-w-full"
        >
          <BenefitCard
            title="Profile Feature"
            iconSrc= ""
            bgColor="bg-slate-900"
          >
            <template #content>
              <span>Your profile is a</span>
              <span class="font-medium italic">personal hub </span>
              <span>
                where you can showcase your music journey, whether you're an
                artist, learner, or listener. It helps you
              </span>
              <span class="font-bold"> connect </span>
              <span> with others and </span>
              <span class="font-bold"> express </span>
              <span> your creativity within the community.</span>
            </template>
          </BenefitCard>

          <BenefitCard
            title="Role Tagging"
            iconSrc=""
             bgColor="bg-blue-900"
          >
            <template #content>
              <span>You can choose a</span>
              <span class="font-bold"> role tag </span>
              <span> (</span>
              <span class="font-medium italic">artist </span>
              <span>,</span>
              <span class="font-medium italic">learner </span>
              <span>, or</span>
              <span class="font-medium italic">listener </span>
              <span>
                ) to define your role within the community. This helps users
                connect based on their interests and expertise, creating a more
                tailored experience.
              </span>
            </template>
          </BenefitCard>

          <BenefitCard
            title="Post Creation"
            iconSrc=""
            bgColor="bg-blue-900"
          >
            <template #content>
              <span> SelfSound lets you share your music through </span>
              <span class="font-medium italic">four post types </span>
              <span>: </span>
              <span class="font-bold"> media posts </span>
              <span>,</span>
              <span class="font-bold"> audio posts </span>
              <span>,</span>
              <span class="font-bold"> sheet music posts </span>
              <span>(compositions), and</span>
              <span class="font-bold"> lyric posts </span>
              <span>
                . Each format helps you share your work in the most fitting way,
                fostering collaboration and feedback.
              </span>
            </template>
          </BenefitCard>

          <BenefitCard
            title="Reactions – Comments and Likes"
            iconSrc=""
            bgColor="bg-slate-900"
          >
            <template #content>
              <span class="font-medium italic">Engage </span>
              <span>
                with the community by liking and commenting on posts, providing
                feedback or simply showing support. This fosters
              </span>
              <span class="font-bold"> interaction </span>
              <span>,</span>
              <span class="font-bold"> collaboration </span>
              <span>, and</span>
              <span class="font-bold"> inspiration </span>
              <span> among music lovers and creators.</span>
            </template>
          </BenefitCard>
        </div>
      </div>
    </div>
  </section>
</template>

