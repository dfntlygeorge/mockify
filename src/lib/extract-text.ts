import { getTextExtractor } from "office-text-extractor";

const extractor = getTextExtractor();

export async function extractText(files: File[]) {
  const extractedTextResults = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const text = await extractor.extractText({
        input: buffer,
        type: "buffer",
      });

      return text;
    })
  );

  const combinedText = extractedTextResults.join("\n\n");

  return combinedText;
}
