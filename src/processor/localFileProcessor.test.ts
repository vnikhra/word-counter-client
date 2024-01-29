import { locallyProcessFile } from "./localFileProcessor";
import { printWordCount } from "../utils/printWordCount";

jest.mock("../utils/printWordCount");

describe("locallyProcessFile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call printWordCount with the provided filePath", async () => {
        const filePath = "/path/to/test/file.txt";

        await locallyProcessFile(filePath);

        expect(printWordCount).toHaveBeenCalledWith(filePath);
    });

    it("should rethrow any error caught during execution", async () => {
        const filePath = "/path/to/nonexistent/file.txt";
        const mockError = new Error("Test error");
        (printWordCount as jest.Mock).mockRejectedValueOnce(mockError);

        await expect(locallyProcessFile(filePath)).rejects.toThrowError(mockError);
        expect(printWordCount).toHaveBeenCalledWith(filePath);
    });
});
