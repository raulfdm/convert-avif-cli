import sharp from "sharp";
import path from "path";

import { ALLOWED_EXTENSIONS } from "./config.js";

export async function imageParser(filePath, extension) {
  if (filePath === undefined || Boolean(filePath.trim()) === false) {
    console.error("Input file must be defined.\n");
    return process.exit(1);
  }

  if (ALLOWED_EXTENSIONS.includes(extension) === false) {
    console.error(
      `Extension not allowed. Choose one of: "${ALLOWED_EXTENSIONS.join(
        ", "
      )}"\n`
    );
    return process.exit(1);
  }

  const isAvif = path.extname(filePath) === ".avif";

  if (isAvif === false) {
    console.error(`File must be an ".avif".\n`);
    return process.exit(1);
  }

  const outputFileName = filePath.replace(".avif", `.${extension}`);

  await sharp(filePath).toFormat(extension).toFile(outputFileName);

  console.log(`File converted successfully: "${outputFileName}"\n`);
  return process.exit(0);
}
