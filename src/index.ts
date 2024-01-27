import { printWordCount } from "./printWordCount";

export async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error("Usage: ts-node index.ts <file-path>");
    throw new Error("Invalid number of arguments");
  }

  const filePath = args[0];

  try {
    await printWordCount(filePath);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("error while reading file:", error.message);
    throw new Error("Error while reading file");
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("error while reading file:", error.message);
    process.exit(1);
  });
}
