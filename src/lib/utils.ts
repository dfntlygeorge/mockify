import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import {
  CHUNK_CONFIG,
  MODEL,
  OPENROUTER_API_URL,
  ORGANIZE_EACH_CHUNK_PROMPT,
  ORGANIZE_ORGANIZED_CHUNKS_PROMPT,
} from "@/config/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function callDeepSeek(prompt: string): Promise<string> {
  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message?.content.trim();
}

export function chunkPlainText(plainText: string): Promise<string[]> {
  try {
    const chunks: string[] = [];
    let chunkStart = 0;
    const { MAX_CHARS, OVERLAP } = CHUNK_CONFIG;

    while (chunkStart < plainText.length) {
      // 1. Look ahead for potential break points
      const nextBreak = Math.min(
        plainText.indexOf("\n\n", chunkStart + MAX_CHARS - 5000),
        plainText.indexOf("\\section{", chunkStart + MAX_CHARS - 5000),
        chunkStart + MAX_CHARS
      );

      // 2. Cut at first valid break point
      const chunkEnd = nextBreak > 0 ? nextBreak : chunkStart + MAX_CHARS;

      // 3. Store chunk
      chunks.push(plainText.slice(chunkStart, chunkEnd));

      // 4. Rewind for overlap (context preservation)
      chunkStart = Math.max(0, chunkEnd - OVERLAP);
    }

    console.log(`HOW MANY CHUNKS: ${chunks.length}`);

    return Promise.resolve(chunks);
  } catch (error) {
    console.error("Error while chunking plain text:", error);
    return Promise.reject(new Error("Failed to chunk plain text."));
  }
}

export async function organizeChunks(chunks: string[]): Promise<{
  organizedContent: string;
  organizedChunks: string[];
}> {
  try {
    console.log("🧩 Starting to organize each chunk...");

    const organizedChunks = await Promise.all(
      chunks.map(async (chunk, index) => {
        console.log(`🔹 Organizing chunk ${index + 1}/${chunks.length}`);
        return await organizeEachChunk(chunk);
      })
    );

    console.log("✅ Finished organizing all chunks.");

    const combinedContent = organizedChunks.join("\n\n");

    console.log("📦 Calling DeepSeek to organize the combined content...");

    const organizedContent = await callDeepSeek(
      ORGANIZE_ORGANIZED_CHUNKS_PROMPT(combinedContent)
    );

    console.log("✅ Received and returning final organized content.");

    return {
      organizedContent: organizedContent.trim(),
      organizedChunks,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error during content organization";

    console.error(`❌ Content organization failed: ${errorMessage}`);
    throw new Error("Failed to organize course materials");
  }
}

async function organizeEachChunk(chunk: string): Promise<string> {
  return await callDeepSeek(ORGANIZE_EACH_CHUNK_PROMPT(chunk));
}
