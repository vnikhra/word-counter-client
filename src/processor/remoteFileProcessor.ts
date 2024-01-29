import axios from "axios";
import fs from "fs";

export async function checkFileStatus(fileId: string) {
    try {
        const url = `http://localhost:16666/api/generate-download-url?fileId=${fileId}`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const data = response.data;
            const downloadResponse = await axios.get(data.downloadURL);

            if (!(downloadResponse.status === 200)) {
                throw new Error(`Failed to download file! Status: ${downloadResponse.status}`);
            }

            const fileContent = downloadResponse.data;

            for (const key in fileContent) {
                console.log(`${key}: ${fileContent[key]}`);
            }
        } else if (response.status === 403) {
            console.log('File is still processing. Please check again later.');
        } else if (response.status === 404) {
            console.error('Invalid fileId. File not found.');
        } else {
            throw new Error(`Unexpected response from server: ${response.status}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Error while reading file");
    }
}

export async function submitFileForProcessing(filePath: string) {
    try {
        const url = `http://localhost:16666/api/request-upload-url`;

        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;
        console.log('File id:', data.fileId);

        const fileContent = await fs.promises.readFile(filePath);

        const uploadResponse = await axios.put(data.uploadURL, fileContent, {
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        if (uploadResponse.status !== 200) {
            throw new Error(`Failed to upload file! Status: ${uploadResponse.status}`);
        }

        console.log('File uploaded successfully!');

        const enqueueUrl = `http://localhost:16666/api/enqueue-file?fileId=${data.fileId}`;
        const enqueueResponse = await axios.get(enqueueUrl);

        if (enqueueResponse.status !== 200) {
            throw new Error(`Failed to enqueue file! Status: ${enqueueResponse.status}`);
        }

        console.log('File enqueued successfully!');
    } catch (error) {
        if (error instanceof Error) {
            console.error("error while reading file:", error.message);
            throw error;
        }
        throw new Error("Error while reading file");
    }
}
