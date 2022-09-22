#!/usr/bin/env node
import meow from "meow";
import { imageParser } from "../lib/parser.js";
import { ALLOWED_EXTENSIONS_STRING } from "../lib/config.js";

const cli = meow(
  `
  Usage
	  $ convert-avif <input>

	Options
	  --extension, -r  Output file extension. Supported: ${ALLOWED_EXTENSIONS_STRING}
                    default: "jpg"
	  --output,    -o  Output file. default: The same as input file

	Examples
    $ convert-avif my-image.avif
    $ convert-avif my-image.avif --extension png
    $ convert-avif my-image.avif --output ./demo/my-image.png
`,
  {
    importMeta: import.meta,
    flags: {
      extension: {
        type: "string",
        alias: "e",
        default: "jpg",
      },
      output: {
        type: "string",
        alias: "o",
      },
    },
  }
);

imageParser({
  filePath: cli.input[0],
  extension: cli.flags.extension,
  output: cli.flags.output,
});
