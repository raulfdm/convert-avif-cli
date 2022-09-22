import {
  expect,
  test,
  describe,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { ALLOWED_EXTENSIONS } from "../lib/config";
import { imageParser } from "../lib/parser";

const processMock = {
  exit: vi.fn(),
};
vi.stubGlobal("process", processMock);

const sharpToFormatMock = vi.fn();
const sharpToFileMock = vi.fn();

const sharpMock = vi.fn(() => {
  const api = {
    toFormat: (...args) => {
      sharpToFormatMock(...args);
      return api;
    },
    toFile: (...args) => {
      sharpToFileMock(...args);
      return api;
    },
  };

  return api;
});

vi.mock("sharp", () => ({
  default: (...args) => sharpMock(...args),
}));

const existsSyncMock = vi.fn().mockReturnValue(true);
const mkdirSyncMock = vi.fn();

vi.mock("node:fs", () => ({
  existsSync: (...args) => existsSyncMock(...args),
  mkdirSync: (...args) => mkdirSyncMock(...args),
}));

describe("imageParser", () => {
  let originalConsoleError;
  let originalConsoleLog;

  const consoleErrorMock = vi.fn();
  const consoleLogMock = vi.fn();

  beforeAll(() => {
    originalConsoleError = console.error;
    originalConsoleLog = console.log;

    console.error = consoleErrorMock;
    console.log = consoleLogMock;
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  beforeEach(vi.clearAllMocks);

  test("exit with 1 and console.error if input file is undefined", async () => {
    await imageParser({
      extension: "jpg",
      filePath: undefined,
    });

    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Input file must be defined.\n"
    );
    expect(processMock.exit).toHaveBeenCalledWith(1);
  });

  test("exit with 1 and console.error if extension is not allowed", async () => {
    for await (const extension of ["pdf", "txt", "ppm", "v", "fits"]) {
      vi.clearAllMocks();

      await imageParser({
        filePath: "my-file.avif",
        extension,
      });

      expect(consoleErrorMock).toHaveBeenCalledWith(
        `Extension not allowed. Choose one of: "jpg, jpeg, png, webp, gif"\n`
      );
      expect(processMock.exit).toHaveBeenCalledWith(1);
    }
  });

  test("exit with 1 and console.error if input file is not .avif", async () => {
    for await (const filePath of ["a.png", "a.jpg", "a.gif"]) {
      vi.clearAllMocks();

      await imageParser({
        filePath,
        extension: "jpg",
      });

      expect(consoleErrorMock).toHaveBeenCalledWith(
        `File must be ".avif" extension.\n`
      );

      expect(processMock.exit).toHaveBeenCalledWith(1);
    }
  });

  test("exit with 0 and console.log if input file is .avif", async () => {
    const expectedFilePath = "./my-file/file.avif";

    for await (const expectedExtension of ALLOWED_EXTENSIONS) {
      const expectedOutputFilePath = `./my-file/file.${expectedExtension}`;

      await imageParser({
        filePath: expectedFilePath,
        extension: expectedExtension,
      });

      expect(sharpMock).toHaveBeenCalledWith(expectedFilePath);
      expect(sharpToFormatMock).toHaveBeenCalledWith(expectedExtension);
      expect(sharpToFileMock).toHaveBeenCalledWith(expectedOutputFilePath);

      expect(consoleLogMock).toHaveBeenCalledWith(
        `File converted successfully: "${expectedOutputFilePath}"\n`
      );
      expect(processMock.exit).toHaveBeenCalledWith(0);
    }
  });

  describe("output", () => {
    test("exit with 1 if output has no extension", async () => {
      await imageParser({
        filePath: "./my-file/file.avif",
        extension: "jpg",
        output: "./my-file/another-file.pdf",
      });

      expect(consoleErrorMock).toHaveBeenCalledWith(
        `Extension not allowed. Choose one of: "jpg, jpeg, png, webp, gif"\n`
      );
      expect(processMock.exit).toHaveBeenCalledWith(1);
    });

    test("exit with 1 if output extension is not valid", async () => {
      await imageParser({
        filePath: "./my-file/file.avif",
        extension: "jpg",
        output: "./my-file/another-file",
      });

      expect(consoleErrorMock).toHaveBeenCalledWith(
        `Extension not allowed. Choose one of: "jpg, jpeg, png, webp, gif"\n`
      );
      expect(processMock.exit).toHaveBeenCalledWith(1);
    });

    test("converts the avif with the received output definition", async () => {
      const config = {
        filePath: "./my-file/file.avif",
        extension: "jpg",
        output: "./my-file/another-file.png",
      };

      await imageParser(config);

      expect(sharpMock).toHaveBeenCalledWith(config.filePath);
      expect(sharpToFormatMock).toHaveBeenCalledWith("png");
      expect(sharpToFileMock).toHaveBeenCalledWith(config.output);

      expect(consoleLogMock).toHaveBeenCalledWith(
        `File converted successfully: "${config.output}"\n`
      );
      expect(processMock.exit).toHaveBeenCalledWith(0);
    });

    describe("output folder creation", () => {
      test("creates the output dirname folder if it does not exist", async () => {
        const config = {
          filePath: "./my-file/file.avif",
          extension: "jpg",
          output: "./path/to/dist/another-file.png",
        };

        existsSyncMock.mockReturnValueOnce(false);

        await imageParser(config);

        expect(mkdirSyncMock).toHaveBeenCalledWith("./path/to/dist");
        expect(consoleLogMock).toHaveBeenCalledWith(
          `File converted successfully: "${config.output}"\n`
        );
        expect(processMock.exit).toHaveBeenCalledWith(0);
      });

      test("does not creates output if it exists", async () => {
        const config = {
          filePath: "./my-file/file.avif",
          extension: "jpg",
          output: "./path/to/dist/another-file.png",
        };

        existsSyncMock.mockReturnValueOnce(true);

        await imageParser(config);

        expect(mkdirSyncMock).not.toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalledWith(
          `File converted successfully: "${config.output}"\n`
        );
        expect(processMock.exit).toHaveBeenCalledWith(0);
      });
    });
  });
});
