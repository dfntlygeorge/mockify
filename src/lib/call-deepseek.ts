import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-r1:free";

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

export async function deepseekPleaseFixTheLatexCode(
  latexCode: string,
  errorMessage: string
): Promise<string> {
  const prompt = `
  You are an expert LaTeX debugger.
  
  A user attempted to compile the following LaTeX code, but it failed due to the error message shown below. Your job is to fix the LaTeX code and return ONLY the corrected code wrapped in a single pair of backticks like this:
  
  \`\`\`
  \\documentclass...
  ...
  \\end{document}
  \`\`\`
  
  Do not include any explanations or commentary.
  
  --- LaTeX CODE ---
  ${latexCode}
  
  --- ERROR MESSAGE ---
  ${errorMessage}
    `;

  const result = await callDeepSeek(prompt);
  return result;
}
