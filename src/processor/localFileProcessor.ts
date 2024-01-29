import {printWordCount} from "../utils/printWordCount";

export async function locallyProcessFile(filePath: string){
    try {
        await printWordCount(filePath);
    } catch (error: unknown) {
        throw error;
    }
}
