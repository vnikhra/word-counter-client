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

    // Redirect console.log output
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await printWordCount(filePath);

    // Verify that fs.createReadStream was called with the correct file path
    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    // Verify that countWords was called with the file stream
    expect(countWords).toHaveBeenCalledWith(mockFileStream);
    // Verify console.log output
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

    // Redirect console.error output
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await printWordCount(filePath);

    // Verify that fs.createReadStream was called with the correct file path
    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    // Verify that countWords was called with the file stream
    expect(countWords).toHaveBeenCalled();
    // Verify console.error output
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", mockError.message);

    consoleErrorSpy.mockRestore();
  });
});
