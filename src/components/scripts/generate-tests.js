#!/usr/bin/env node
import { mkdirSync, existsSync, renameSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import glob from "fast-glob";
import { execa } from "execa";

const COMPONENT_GLOB = "src/components/**/*.{vue,ts,tsx}";
const OUT_DIR = "tests/generated";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Знаходимо всі компоненти
const files = await glob(COMPONENT_GLOB);

for (const file of files) {
  // 1) викликаємо TestGPT CLI
  await execa("npx", ["testgpt", "generate", file], { stdio: "inherit" });

  // 2) TestGPT створює test поряд із файлом; переносимо його в OUT_DIR
  const testFilename = basename(file).replace(extname(file), "") + ".test.ts";
  const source = join(dirname(file), testFilename);
  const target = join(OUT_DIR, testFilename);
  renameSync(source, target);
}

console.log(`✅ Tests generated in ./${OUT_DIR}`);
