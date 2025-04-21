export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

export const CHUNK_CONFIG = {
  MAX_CHARS: 30000, // 30k tokens (25% of context window)
  OVERLAP: 8000, // 2k tokens overlap
  MAX_PAGES_PER_CHUNK: 20, // For PPT/DOCX sanity check
};

export const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";
export const MODEL = "deepseek/deepseek-r1:free";

export const ORGANIZE_EACH_CHUNK_PROMPT = (chunk: string): string => {
  return `
You are helping organize a piece of course material. The text may be incomplete at the start or end. Do NOT drop anything just because it looks cut off. If the text seems to be missing a beginning or an ending, include a clear note like:

[⚠️ This section might be a continuation or partial segment.]

Organize the content to make it easier to process later, but do NOT rewrite or paraphrase. Keep the original wording exactly as-is.

Here is the chunk to organize:
"""
${chunk}
"""

Return only the organized text. Do not include explanations, JSON, or formatting instructions.
  `.trim();
};

export const ORGANIZE_ORGANIZED_CHUNKS_PROMPT = (
  organizedChunks: string
): string => {
  return `
You are organizing processed course materials. You will now take all the previously organized chunks and clean them further. 

Your goal:
- Remove unrelated or non-instructional content such as: author names, dates, page numbers, headers/footers.
- Do NOT change any actual course-related wording, explanations, or content.
- Organize the material logically based on topics or flow, but keep all original instructional text intact.
- Do NOT paraphrase or summarize.

Here are the organized chunks:
"""
${organizedChunks}
"""

Return only the final cleaned and organized text. Do not include explanations, JSON, or any extra output.
  `.trim();
};
