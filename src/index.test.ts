import { main } from "./index";
import { printWordCount } from "./utils/printWordCount";

// Mock console methods
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

jest.mock("./utils/printWordCount", () => ({
  printWordCount: jest.fn(),
}));

describe("Main function", () => {
  test("should call printWordCount with file path", async () => {
    const mockFilePath = "example.txt";
    const mockWordCounts = { word: 1 }; // Mock word counts

    // Mock process.argv with correct number of arguments
    process.argv = ["node", "index.ts", mockFilePath];
    // Mock printWordCount function
    (printWordCount as jest.Mock).mockResolvedValueOnce(mockWordCounts);

    // Call the main function
    await main();

    // Verify that printWordCount was called with the file path
    expect(printWordCount).toHaveBeenCalledWith(mockFilePath);
  });

  test("should print usage message for incorrect number of arguments", async () => {
    // Mock process.argv with incorrect number of arguments
    process.argv = ["node", "index.ts"];

    // Call the main function
    await expect(main()).rejects.toThrowError("Invalid number of arguments");
    // Verify console error output
    expect(console.error).toHaveBeenCalledWith(
      "Usage: ts-node index.ts <file-path>",
    );
  });

  test("should handle error from printWordCount", async () => {
    const errorMessage = "Error while reading file"; // Mock error message

    // Mock process.argv with correct number of arguments
    process.argv = ["node", "index.ts", "nonexistent.txt"];
    // Mock printWordCount function to throw an error
    (printWordCount as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    // Call the main function
    await expect(main()).rejects.toThrowError(errorMessage);

    // Verify console output
    expect(console.error).toHaveBeenCalledWith(
      "error while reading file:",
      errorMessage,
    );
  });
});
