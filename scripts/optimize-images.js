import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.resolve(__dirname, "../src/assets");

const imagesToOptimize = [
  // { input: "about_hero_new.png", dir: "" },
  { input: "about_hero_new.png", dir: "" },
  { input: "bgimage3.png", dir: "images" },
  { input: "ramadan_fashion_hero_banner.png", dir: "images" },
  { input: "banner_section_image.png", dir: "images" },
  { input: "collection1.png", dir: "images" },
  { input: "collection2.png", dir: "images" },
  { input: "collection3.png", dir: "images" },
  { input: "collection4.png", dir: "images" },
  { input: "homeherofusion_copy.png", dir: "images" },
  { input: "img2.png", dir: "images" },
  { input: "img3.png", dir: "images" },
  { input: "img4.png", dir: "images" },
  { input: "img5.png", dir: "images" },
  { input: "faqbgimg.png", dir: "images" },
  { input: "fontimg.png", dir: "images" }
];

async function main() {

  let totalSaved = 0;
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const img of imagesToOptimize) {
    const inputPath = path.join(baseDir, img.dir, img.input);
    const ext = path.extname(img.input);
    const baseName = path.basename(img.input, ext);
    const outputPath = path.join(baseDir, img.dir, `${baseName}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Warning: File not found at ${inputPath}. Skipping.`);
      continue;
    }

    const originalStats = fs.statSync(inputPath);
    const originalSizeKb = originalStats.size / 1024;

    try {
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 }) // Effort 4 is a great balance of speed and size
        .toFile(outputPath);

      const optimizedStats = fs.statSync(outputPath);
      const optimizedSizeKb = optimizedStats.size / 1024;
      const savedKb = originalSizeKb - optimizedSizeKb;
      const savedPercent = (savedKb / originalSizeKb) * 100;

      totalOriginal += originalStats.size;
      totalOptimized += optimizedStats.size;
      totalSaved += originalStats.size - optimizedStats.size;

    } catch (error) {
      console.error(`❌ Failed to convert ${img.input}:`, error);
    }
  }

  const overallOriginalMb = totalOriginal / (1024 * 1024);
  const overallOptimizedMb = totalOptimized / (1024 * 1024);
  const overallSavedMb = totalSaved / (1024 * 1024);
  const overallSavedPercent = (totalSaved / totalOriginal) * 100;

}

main();
