import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { MODEL, OPENROUTER_API_URL } from "@/config/constants";

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

export function cleanText(text: string): string {
  return text
    .replace(/\r\n|\r/g, "\n") // Normalize line breaks
    .replace(/\n{2,}/g, "\n\n") // Collapse extra line breaks
    .replace(/[ \t]+/g, " ") // Collapse extra spaces/tabs
    .replace(/ +\n/g, "\n") // Remove trailing spaces before newlines
    .trim(); // Remove leading/trailing whitespace
}
