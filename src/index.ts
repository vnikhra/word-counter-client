import {locallyProcessFile} from "./processor/localFileProcessor";
import {checkFileStatus, submitFileForProcessing} from "./processor/remoteFileProcessor";

export async function main() {
  const args = process.argv.slice(2);

  if (args.length === 1 && (args.includes('--local') || args.includes('--check-result'))) {
    console.error('Usage: node client.js [--local | --check-result] <file_path | fileId>');
    return;
  }

  if (args.length > 1 && (!args.includes('--local') && !args.includes('--check-result'))) {
    console.error('Usage: node client.js [--local | --check-result] <file_path | fileId>');
    return;
  }

  const localIndex = args.indexOf('--local');
  const checkResultIndex = args.indexOf('--check-result');

  if ([localIndex, checkResultIndex].filter(index => index !== -1).length > 1) {
    console.error('Options --local, and --check-result cannot be used together.');
    return;
  }

  const optionIndex = [localIndex, checkResultIndex].find(index => index !== -1)!;
  const option = args[optionIndex];
  const fileId = args.find((_: any, index: any) => index !== optionIndex); // Get fileId or file path depending on the option used

  if(!fileId){
    console.error('FileId or File path are mandatory');
    return;
  }
  if (option === '--local') {
    await locallyProcessFile(fileId);
  } else if (option === '--check-result') {
    await checkFileStatus(fileId);
  } else {
    await submitFileForProcessing(fileId);
  }
}

if (require.main === module) {
  main().catch(() => {
    process.exit(1);
  });
}