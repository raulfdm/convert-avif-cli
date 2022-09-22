import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

import { ALLOWED_EXTENSIONS } from './config.js';

export async function imageParser({ filePath, extension, output }) {
  if (filePath === undefined || Boolean(filePath.trim()) === false) {
    console.error('Input file must be defined.\n');
    return process.exit(1);
  }

  const outputInfo = getOutputFileInfo();

  if (isValidExtension(outputInfo.extension) === false) {
    console.error(
      `Extension not allowed. Choose one of: "${ALLOWED_EXTENSIONS.join(
        ', '
      )}"\n`
    );
    return process.exit(1);
  }

  if (isInputFileAvif() === false) {
    console.error('File must be ".avif" extension.\n');
    return process.exit(1);
  }

  if (outputFolderExists() === false) {
    createOutputFolder();
  }

  await sharp(filePath)
    .toFormat(outputInfo.extension)
    .toFile(outputInfo.filePath);

  console.log(`File converted successfully: "${outputInfo.filePath}"\n`);
  return process.exit(0);

  function getOutputFileInfo() {
    if (output) {
      const outputExtension = path.extname(output).replace('.', '');

      return {
        filePath: output,
        extension: outputExtension,
      };
    } else {
      return {
        filePath: filePath.replace('.avif', `.${extension}`),
        extension,
      };
    }
  }

  function isInputFileAvif() {
    return path.extname(filePath) === '.avif';
  }

  function outputFolderExists() {
    return existsSync(path.dirname(outputInfo.filePath));
  }

  function createOutputFolder() {
    mkdirSync(path.dirname(outputInfo.filePath));
  }
}

function isValidExtension(ext) {
  return ALLOWED_EXTENSIONS.includes(ext);
}
