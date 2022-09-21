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

	Examples
    $ convert-avif my-image.avif
    $ convert-avif my-image.avif --extension png
`,
  {
    importMeta: import.meta,
    flags: {
      extension: {
        type: "string",
        alias: "e",
        default: "jpg",
      },
    },
  }
);

imageParser(cli.input[0], cli.flags.extension);
