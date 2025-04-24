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
import { nextTick } from "vue";

interface Props {
  svg: string;
  isActive?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const iconContainer = ref<HTMLElement | null>(null);
const isActive = ref(false); // Стан для фіксації кольору

const handleClick = () => {
  isActive.value = !isActive.value; // Змінюємо стан активності
  emit("click");
};

onMounted(() => {
  const icon = iconContainer.value?.querySelector(
    ".add-post-icon-background"
  ) as SVGElement | null;

  if (icon) {
    icon.style.backgroundColor = "#6D01D0";
    icon.style.borderRadius = "5px";
    icon.style.cursor = "pointer";

    icon.addEventListener("mouseover", () => {
      if (!isActive.value) {
        icon.style.backgroundColor = "#000C9C"; // Якщо не активний, змінюємо колір
      }
    });

    icon.addEventListener("mouseout", () => {
      if (!isActive.value) {
        icon.style.backgroundColor = "#6D01D0"; // Якщо не активний, повертаємо колір
      }
    });

    // При натисканні на іконку змінюємо колір і фіксуємо стан
    icon.addEventListener("click", (event) => {
      event.stopPropagation(); // Запобігаємо поширенню події, щоб не викликати подію на документі
      isActive.value = !isActive.value;
      icon.style.backgroundColor = isActive.value ? "#000C9C" : "#6D01D0";
    });
  }

  // Закриття кольору при натисканні поза елементом
  document.addEventListener("click", (event) => {
    const icon = iconContainer.value?.querySelector(".add-post-icon-background") as SVGElement | null;
    if (icon && !icon.contains(event.target as Node)) {
      isActive.value = false;
      icon.style.backgroundColor = "#6D01D0"; // Скидаємо колір
    }
  });

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
