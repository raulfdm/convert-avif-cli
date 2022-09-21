# Convert AVIF CLI

> Convert an .avif image to regular common image extensions

## Why

[AVIF](https://en.wikipedia.org/wiki/AVIF) is a new image format with better compression over jpeg.

The problem is that the adoption is still getting traction, and many websites still do not recognize `.avif` files as a valid image format to upload, for example.

Unfortunately, we cannot simply change the file extension from `.avif` to `.png`, for example.

So, this tool was created only for this purpose.

## Requirements

To use this CLI, you need NodeJS 16 or higher (due to ESModules usage).

## Usage

### Installing it globally

```bash
pnpm add -g convert-avif-cli
# Or
npm add -g convert-avif-cli
# Or
yarn add -g convert-avif-cli
```

Then you can:

```bash
convert-avif ./path/to/my/file.avif
```

This command will produce a new file in the exact location with the extension `.jpg`: `./path/to/my/file.jpg`.

In case you want to define another extension, you can use the flag `--extension` (or just `-e`):

```bash
convert-avif ./path/to/my/file.avif -e png
```

This will produce a new file with the given extension: `./path/to/my/file.png`.

### Using the binary without installing

You can straight use the CLI with either `pnpm dlx` or `npx`:

```bash
pnpm dlx convert-avif-cli ./path/to/my/file.avif
# OR
npx convert-avif-cli ./path/to/my/file.avif
```

## Related packages

- [`aviftojpg`](https://www.npmjs.com/package/aviftojpg) - CLI to convert AVIF files to JPEG files;
- [`avif`](https://www.npmjs.com/package/avif) - Command line utility to convert images to AVIF

## License

[MIT](LICENSE)
