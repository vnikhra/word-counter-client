import * as fs from "fs";
import { countWords } from "@vnikhra/word-counter";

export async function printWordCount(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  try {
    const wordCounts = await countWords(fileStream);
    console.log("Word counts:");
    for (const word in wordCounts) {
      console.log(`${word}: ${wordCounts[word]}`);
    }
  } catch (error: unknown) {
    console.error(
      "error while reading file:",
      error instanceof Error ? error.message : "",
    );
  }
}
