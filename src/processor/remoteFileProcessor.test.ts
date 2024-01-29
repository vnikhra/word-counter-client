import axios from "axios";
import { checkFileStatus } from "./remoteFileProcessor";

jest.mock("axios");
jest.mock("fs");

describe("File Processor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("checkFileStatus", () => {
        it("should download and print file content if status is 200", async () => {
            const fileId = "test-file-id";
            const data = { downloadURL: "http://example.com/download" };
            const downloadResponseData = { key: "value" };
            (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200, data });
            (axios.get as jest.Mock).mockResolvedValueOnce({ status: 200, data: downloadResponseData });

            await checkFileStatus(fileId);

            expect(axios.get).toHaveBeenNthCalledWith(1, `http://localhost:16666/api/generate-download-url?fileId=${fileId}`);
            expect(axios.get).toHaveBeenNthCalledWith(2, data.downloadURL);
        });

    });
});
