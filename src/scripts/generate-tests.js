#!/usr/bin/env node

// Завантажуємо змінні з .env
import "dotenv/config";

import { mkdirSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import glob from "fast-glob";

// Динамічний імпорт execa, щоб уникнути проблем з CommonJS/ESM
const { execa } = await import("execa");

const COMPONENT_GLOB = "src/components/**/*.{vue,ts,tsx}";
const OUT_DIR = "tests/generated";

// Якщо папки немає — створюємо
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Знаходимо всі файли компонентів
const files = await glob(COMPONENT_GLOB);

for (const file of files) {
  const testName = basename(file).replace(extname(file), "") + ".test.ts";
  const outPath = join(OUT_DIR, testName);

  console.log(`🧪 Генерується тест для: ${file}`);

  // Запускаємо testgpt через npx, передаємо вхідний файл і шлях для збереження тесту
  await execa("npx", ["testgpt", "-i", file, "-o", outPath], {
    stdio: "inherit",
  });
}

console.log(`✅  Tests saved to ./${OUT_DIR}`);
