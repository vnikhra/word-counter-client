import * as fs from "fs";
import { printWordCount } from "./printWordCount";
import { countWords } from "@vnikhra/word-counter";

jest.mock("fs");
jest.mock("@vnikhra/word-counter");

describe("printWordCount", () => {
  test("should print word counts", async () => {
    const filePath = "example.txt";
    const mockWordCounts = { hello: 2, world: 1 };
    const mockFileStream = {} as fs.ReadStream;

    (fs.createReadStream as jest.Mock).mockReturnValue(mockFileStream);
    (countWords as jest.Mock).mockResolvedValueOnce(mockWordCounts);

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await printWordCount(filePath);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    expect(countWords).toHaveBeenCalledWith(mockFileStream);
    expect(consoleLogSpy).toHaveBeenCalledWith("Word counts:");
    expect(consoleLogSpy).toHaveBeenCalledWith("hello: 2");
    expect(consoleLogSpy).toHaveBeenCalledWith("world: 1");

    consoleLogSpy.mockRestore();
  });

  test("should handle error", async () => {
    const filePath = "nonexistent.txt";
    const mockError = new Error("File not found");

    (fs.createReadStream as jest.Mock).mockReturnValue({} as fs.ReadStream);
    (countWords as jest.Mock).mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await printWordCount(filePath);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    expect(countWords).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("error while reading file:", mockError.message);

    consoleErrorSpy.mockRestore();
  });
});
