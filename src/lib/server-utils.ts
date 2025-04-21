import pdflatex from "node-pdflatex";
import { getTextExtractor } from "office-text-extractor";

export async function compileLatexToPdf(latexCode: string) {
  try {
    const pdf = await pdflatex(latexCode);
    return pdf;
  } catch (err) {
    if (err instanceof Error) {
      console.log("LaTeX compilation error:\n", err.message);
    } else {
      console.log("Unknown LaTeX compilation error:\n", err);
    }
    throw new Error("LaTeX compilation failed.");
  }
}

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
