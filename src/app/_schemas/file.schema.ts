import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/config/constants";
import { z } from "zod";

export const FileSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, {
      message: "The uploaded file is not a valid file.",
    })
    .refine(
      (file) =>
        ACCEPTED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE,
      {
        message: "Only PDF, Word, and PowerPoint files under 5MB are allowed.",
      }
    ),
});
