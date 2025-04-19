import pdflatex from "node-pdflatex";
import { deepseekPleaseFixTheLatexCode } from "./call-deepseek";

export async function compileLatexToPdf(latexCode: string) {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // Try the LaTeX compilation
      const pdf = await pdflatex(latexCode);
      return pdf; // Return the PDF if successful
    } catch (err: any) {
      const errorMessage =
        err?.stderr?.toString?.() ||
        err?.message ||
        "Unknown LaTeX compilation error";

      console.error(
        `Attempt ${attempts + 1}: LaTeX compilation failed:\n`,
        errorMessage
      );

      if (attempts >= maxAttempts - 1) {
        // If it's the last attempt, throw the error
        throw new Error("Failed to compile LaTeX after multiple attempts.");
      }

      // Attempt to fix LaTeX code using AI if compilation fails
      try {
        const fixed = await deepseekPleaseFixTheLatexCode(
          latexCode,
          errorMessage
        );
        latexCode = fixed; // Update the latexCode with the fixed version
      } catch (fixErr: any) {
        console.error(
          `Attempt ${attempts + 1}: AI fix also failed:\n`,
          fixErr?.stderr?.toString?.() || fixErr?.message || fixErr
        );
        throw new Error("AI fix failed during LaTeX compilation.");
      }
    }
    attempts++;
  }
}
