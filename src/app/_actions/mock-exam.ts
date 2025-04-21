"use server";

import { PrevState } from "@/config/types";
import { FileSchema } from "../_schemas/file.schema";
import { compileLatexToPdf, extractText } from "@/lib/server-utils";
import { callDeepSeek, cleanText } from "@/lib/utils";
import { GENERATE_LATEX_CODE_PROMPT } from "@/config/constants";

export const generateMockExamAction = async (
  _: PrevState,
  formData: FormData
) => {
  try {
    const { data, success, error } = FileSchema.safeParse({
      file: formData.get("file") as File,
    });
    if (!success)
      return {
        success: false,
        message: error.message,
      };
    if (!data) {
      return {
        success: false,
        message: "File not valid",
      };
    }
    const file = data?.file;
    const rawText = await extractText(file);
    console.log(`Raw extracted text: ${rawText.length}`);
    const context = cleanText(rawText);
    console.log(`Cleaned text: ${context.length}`);

    const prompt = GENERATE_LATEX_CODE_PROMPT(context);
    console.log("generating the latex code");
    const latexCode = await callDeepSeek(prompt);
    console.log(latexCode);
    console.log("compiling the latex code");
    const pdfBuffer = await compileLatexToPdf(latexCode);

    return {
      success: true,
      message: "Generated mock exam successfully!",
      pdf: pdfBuffer.toString("base64"),
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};
