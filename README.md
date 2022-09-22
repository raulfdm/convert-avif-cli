# Convert AVIF CLI

> Convert an .avif image to regular common image extensions

## Why

[AVIF](https://en.wikipedia.org/wiki/AVIF) is a new image format with better compression over jpeg or png.

The problem is that the adoption is still getting traction, and many websites still do not recognize `.avif` files as a valid image format to upload.

There are online options to do that, but we need to trust our image to a third party, which is not convenient.

Because we can't simply change the file extension from `.avif` to `.png`, we need a tool that has this power, and that's why this CLI exists.

## Requirements

To use this CLI, you need NodeJS 16 or higher (due to ESModules usage).

## Usage

You can either install it globally:

```bash
pnpm add -g convert-avif-cli
# Or
npm add -g convert-avif-cli
# Or
yarn add -g convert-avif-cli
```

Then call the binary:

```bash
convert-avif ./path/to/my/file.avif
```

Or you can straight use the CLI with either `pnpm dlx` or `npx`:

```bash
pnpm dlx convert-avif-cli ./path/to/my/file.avif
# OR
npx convert-avif-cli ./path/to/my/file.avif
```

### Options

You must always specify a file path:

```bash
convert-avif file.avif
```

This will produce a new file in the same folder, with the same name but with a `.jpg` extension:

```
.
├── file.avif
└── file.jpg
```

#### `--extension` flag

The default extension is `jpg`.

In case you want to define another extension, you can use the flag `--extension` (or just `-e`):

```bash
convert-avif ./path/to/my/file.avif -e png
```

Then you'll have this:

```
./path/to/my/
├── file.avif
└── file.png
```

#### `--output` flag

You can specify an output file path with the extension you want using the `--output` flag (or just `-o`).

In this case, the `--extension` flag will be ignored, and the output file will be created where you've specified:

```bash
convert-avif file.avif -o ~/Desktop/demo.png
```

In this case, a `demo.png` file will be created in your `$HOME/Desktop` folder.

> If you specify a folder that does not exist, the CLI will try to create this folder for you out of the box.

## Related packages

- [`aviftojpg`](https://www.npmjs.com/package/aviftojpg) - CLI to convert AVIF files to JPEG files;
- [`avif`](https://www.npmjs.com/package/avif) - Command line utility to convert images to AVIF

## License

[MIT](LICENSE)
