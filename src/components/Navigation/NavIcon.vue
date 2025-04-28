<!--

<template>
  <button
    class="nav-button flex items-center justify-center w-full hover:scale-110"
    @click="handleClick"
    ref="button"
  >
    <span ref="iconContainer" v-html="svg"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Props {
  svg: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const iconContainer = ref<HTMLElement | null>(null);
const handleClick = () => emit("click");

// Зберігаємо активну іконку
let activeIcon: Element | null = null;

onMounted(() => {
  const icon = iconContainer.value?.querySelector(
    ".add-post-icon-background",
  ) as HTMLElement | null;

  if (icon) {
    icon.style.backgroundColor = "#6D01D0"; // початковий фіолетовий
    icon.style.borderRadius = "5px";
    icon.style.cursor = "pointer";

    icon.addEventListener("mouseover", () => {
      if (icon !== activeIcon) {
        icon.style.backgroundColor = "#000C9C"; // синій при наведенні
      }
    });

    icon.addEventListener("mouseout", () => {
      if (icon !== activeIcon) {
        icon.style.backgroundColor = "#6D01D0"; // фіолетовий якщо не активна
      }
    });

    icon.addEventListener("click", (e) => {
      e.stopPropagation(); // запобігає поширенню події

      // Якщо була інша активна іконка
      if (activeIcon && activeIcon !== icon) {
        if (activeIcon.classList.contains("add-post-icon-background")) {
          (activeIcon as HTMLElement).style.backgroundColor = "#6D01D0"; // попередня назад фіолетова
        } else {
          const path = activeIcon.querySelector("path");
          if (path) path.setAttribute("fill", "white"); // повернення білий path
        }
      }

      // Активуємо цю іконку
      icon.style.backgroundColor = "#000C9C"; // синій і залишається синім

      // Зміна кольору частини іконки (наприклад, .nav-icon)
      const navIcon = icon.querySelector(".nav-icon");
      if (navIcon) {
        const path = navIcon.querySelector("path");
        if (path) {
          path.setAttribute("fill", "#6D01D0"); // Змінюємо колір на фіолетовий
        }
      }

      activeIcon = icon;
    });
  }

  // Додатково обробляємо всі інші .nav-icon
  document.querySelectorAll(".nav-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      if (activeIcon && activeIcon !== icon) {
        if (activeIcon.classList.contains("add-post-icon-background")) {
          (activeIcon as HTMLElement).style.backgroundColor = "#6D01D0"; // попередня назад фіолетова
        } else {
          const path = activeIcon.querySelector("path");
          if (path) path.setAttribute("fill", "white"); // повернення білий path
        }
      }

      if (icon.classList.contains("add-post-icon-background")) {
        (icon as HTMLElement).style.backgroundColor = "#000C9C"; // Синій фон
      } else {
        const path = icon.querySelector("path");
        if (path) {
          path.setAttribute("fill", "#6D01D0"); // Фіолетовий path
        }
      }

      activeIcon = icon;
    });
  });
});
</script>

<style scoped>
.nav-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>

-->

<!--

<template>
  <button
    class="nav-button flex items-center justify-center w-full hover:scale-110"
    @click="handleClick"
    ref="button"
  >
    <span ref="iconContainer" v-html="svg"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Props {
  svg: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const iconContainer = ref<HTMLElement | null>(null);
const handleClick = () => emit("click");

onMounted(() => {
  const icon = iconContainer.value?.querySelector(
    ".add-post-icon-background ",
  ) as SVGElement | null;

  if (icon) {
    icon.style.backgroundColor = "#6D01D0";
    icon.style.borderRadius = "5px";
    icon.style.cursor = "pointer";

    icon.addEventListener("mouseover", () => {
      icon.style.backgroundColor = "#000C9C";
    });

    icon.addEventListener("mouseout", () => {
      icon.style.backgroundColor = "#6D01D0";
    });
  }

  // Логіка для .nav-icon
  document.querySelectorAll(".nav-icon").forEach((icon) => {
    icon.addEventListener("mousedown", () => {
      icon.querySelector("path")?.setAttribute("fill", "#6D01D0");

      // Змінюємо колір на фіолетовий на 1 секунди
      setTimeout(() => {
        icon.querySelector("path")?.setAttribute("fill", "white");
      }, 1000);
    });

    icon.addEventListener("mouseup", () => {
      icon.querySelector("path")?.setAttribute("fill", "white");
    });

    icon.addEventListener("mouseleave", () => {
      icon.querySelector("path")?.setAttribute("fill", "white");
    });
  });
});
</script>

<style scoped>
.nav-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>

-->

<template>
  <button
    class="nav-button flex items-center justify-center w-full hover:scale-110"
    @click="handleClick"
    ref="button"
  >
    <span ref="iconContainer" v-html="svg"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Props {
  svg: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.nav-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
