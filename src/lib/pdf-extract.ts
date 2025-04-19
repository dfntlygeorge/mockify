import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const maxPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pageTexts.push(text);
  }

  return pageTexts.join("\n");
}
