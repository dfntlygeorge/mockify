"use server";

import { PrevState } from "@/config/types";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/config/constants";

import { extractText } from "@/lib/server-utils";
import { chunkPlainText, organizeChunks } from "@/lib/utils";

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

    // const text = await extractText(files);
    // const chunkedText = await chunkPlainText(text);
    // const context = await organizeChunks(chunkedText);

    return {
      success: true,
      message: "Generated mock exam successfully!",
      context,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};
