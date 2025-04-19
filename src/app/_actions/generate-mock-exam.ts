"use server";

import { PrevState } from "@/config/types";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/config/constants";
import pdfParse from "pdf-parse";
import OpenAI from "openai";

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

    const extractedTextResults = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await pdfParse(buffer);
        return result.text;
      })
    );

    const combinedText = extractedTextResults.join("\n\n");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // already in your .env
    });

    const prompt = `
      You are an assistant that generates mock exams based on course material.

      Generate a mock exam using the following source material. Organize the exam into clear sections:
      1. True or False
      2. Multiple Choice (4 options per question)
      3. Fill in the Blank

      Each question should include:
      - The question text
      - The correct answer
      - Options if applicable (for multiple choice)

      Output it in this JSON format, grouped by section:

      {
        "true_false": [
          { "question": "...", "answer": true },
          ...
        ],
        "multiple_choice": [
          {
            "question": "...",
            "options": ["A", "B", "C", "D"],
            "answer": "C"
          },
          ...
        ],
        "fill_in_the_blank": [
          { "question": "...", "answer": "..." },
          ...
        ]
      }

      Here is the source material to use as reference:
      """${combinedText}"""
      `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if you want faster responses
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // You can tune this if needed
    });

    const gptResponse = completion.choices[0].message?.content;
    console.log("GPT Response:", gptResponse);

    return {
      success: true,
      message: "Files processed successfully!",
      mockExam: gptResponse,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};
