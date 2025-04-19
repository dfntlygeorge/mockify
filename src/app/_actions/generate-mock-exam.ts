"use server";

import { PrevState } from "@/config/types";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/config/constants";
import { extractText } from "@/lib/extract-text";
import { compileLatexToPdf } from "@/lib/latexToPdf";
import { generateMockExamPrompt } from "@/lib/generate-prompt";
import { callDeepSeek } from "@/lib/call-deepseek";

export const generateMockExamAction = async (
  _: PrevState,
  formData: FormData
) => {
  try {
    const files = formData.getAll("files") as File[];

    const invalidFiles = files.filter(
      (file) =>
        !ACCEPTED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      return {
        success: false,
        message:
          "One or more files are invalid. Please upload valid file types under 5MB.",
      };
    }

    const context = await extractText(files);
    const prompt = generateMockExamPrompt(context);
    const latexCode = await callDeepSeek(prompt);

    if (!latexCode)
      return {
        success: false,
        message: "Deepseek is dumb",
      };

    const pdf = await compileLatexToPdf(latexCode);

    if (!pdf) {
      return {
        success: false,
        message: "not compiled",
      };
    }

    return {
      success: true,
      message: "Files processed successfully!",
      pdf: Buffer.from(pdf).toString("base64"),
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};
