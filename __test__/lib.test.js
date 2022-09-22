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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
        `File must be an ".avif".\n`
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
});
