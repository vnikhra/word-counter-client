import fs from "fs";

export async function checkFileStatus(fileId: string){
    // Call API to check result
    const url = `http://localhost:16666/api/generate-download-url?fileId=${fileId}`;
    const response = await fetch(url);

    if (response.status === 200) {
        const data = await response.json();
        // Download the file from the download URL
        const downloadResponse = await fetch(data.downloadURL);
        if (!downloadResponse.ok) {
            throw new Error(`Failed to download file! Status: ${downloadResponse.status}`);
        }

        // Read the content of the downloaded file
        const fileContent = await downloadResponse.json();

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
}

export async function submitFileForProcessing(filePath: string){
    try {
        const url = `http://localhost:16666/api/request-upload-url`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('File id:', data.fileId)
        // Read file content into a buffer
        const fileContent = await fs.promises.readFile(filePath);

        // Upload file using the upload url
        const uploadResponse = await fetch(data.uploadURL, {
            method: 'PUT',
            body: fileContent,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload file! Status: ${uploadResponse.status}`);
        }

        console.log('File uploaded successfully!');

        // Call another API to enqueue file
        const enqueueUrl = `http://localhost:16666/api/enqueue-file?fileId=${data.fileId}`;
        const enqueueResponse = await fetch(enqueueUrl);
        if (!enqueueResponse.ok) {
            throw new Error(`Failed to enqueue file! Status: ${enqueueResponse.status}`);
        }

        console.log('File enqueued successfully!');
    } catch (error) {
        if (error instanceof Error)
            console.error("error while reading file:", error.message);
        throw new Error("Error while reading file");
    }
}