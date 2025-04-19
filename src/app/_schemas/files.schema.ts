import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/config/constants";
import { z } from "zod";

export const FilesSchema = z.object({
  files: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "You must upload at least one file.",
    })
    .refine((files) => files.length <= 3, {
      message: "You can only upload up to 3 files.",
    })
    .refine(
      (files) =>
        Array.from(files).every((file) => {
          return (
            file instanceof File &&
            ACCEPTED_FILE_TYPES.includes(file.type) &&
            file.size <= MAX_FILE_SIZE
          );
        }),
      {
        message: "Only PDF, Word, and PowerPoint files under 5MB are allowed.",
      }
    ),
});
