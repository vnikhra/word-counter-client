import {printWordCount} from "../utils/printWordCount";

export async function locallyProcessFile(filePath: string){
    try {
        await printWordCount(filePath);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("error while reading file:", error.message);
        }
        throw new Error("Error while reading file");
    }
}
