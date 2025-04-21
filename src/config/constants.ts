export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

export const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";
export const MODEL = "deepseek/deepseek-r1:free";
export const GENERATE_LATEX_CODE_PROMPT = (context: string) => `
Generate exam paper with strict LaTeX rules:

\\documentclass[12pt]{article}
\\usepackage{amsmath, amssymb, geometry, enumitem}
\\geometry{a4paper, margin=1in}
\\title{Mock Exam: [Core Concepts]}
\\begin{document}

\\section*{True/False (10 items)}
\\begin{enumerate}
  \\item \\rule{2cm}{0.15mm} \\[\\forall n \\in \\mathbb{Z}, n^2 \\geq 0\\]
\\end{enumerate}

\\section*{Multiple Choice (10 items)}
\\begin{enumerate}
  \\item How many relations exist on a 3-element set?
  \\begin{enumerate}[label=(\\alph*)]
    \\item \\(2^6\\) \\quad \\item \\(3^3\\) \\quad \\item \\(2^9\\)
  \\end{enumerate}
\\end{enumerate}

\\section*{Fill-in-Blank (10 items)}
\\begin{enumerate}
  \\item \\(|P(A)| = \\rule{3cm}{0.15mm}\\) where \\(|A| = n\\)
\\end{enumerate}

\\section*{Problem Solving (Optional)}
\\begin{enumerate}
  \\item Prove: If \\(n\\) is odd, then \\(n^2\\) is odd
  \\begin{enumerate}[label=Step \\arabic*:]
    \\item Let \\(n = \\rule{2cm}{0.15mm}\\) (definition of odd)
    \\item Then \\(n^2 = \\rule{3cm}{0.15mm}\\)
  \\end{enumerate}
\\end{enumerate}

\\section*{Proofs (Optional)}
\\begin{enumerate}
  \\item Show that \\(R \\cap S\\) is transitive if both relations are transitive
  \\begin{enumerate}
    \\item Start with: Let \\((a,b) \\in R \\cap S\\) and \\rule{3cm}{0.15mm}
  \\end{enumerate}
\\end{enumerate}

\\end{document}

STRICT RULES:
1. Core Requirements (MANDATORY):
   - 10 T/F (mix direct statements and formulas)
   - 10 MCQs (3-4 choices with key math concepts)
   - 10 Fill-in (missing terms in key theorems)

2. Conditional Sections (ONLY IF CONTENT SUPPORTS):
   - Problem Solving: Add 2-3 multi-step questions IF context contains:
     * Solved examples
     * Algorithmic processes
     * Derivations
   - Proofs: Add 1-2 proof starters IF context contains:
     * Theorem statements
     * "Show that..." examples
     * Logical equivalences

3. Math Safety Protocol:
   - All variables: \\(n\\), \\(x\\) not n, x
   - Set notation: \\(\\mathbb{Z}\\), \\(\\mathcal{P}(A)\\)
   - Relations: \\(R \\circ S\\) not R o S
   - Quantifiers: \\[\\exists x \\forall y\\]

4. Error Prevention:
   - NEVER use: theorem, proof, or custom environments
   - For proofs: Use standard enumerate with step hints
   - Ensure all \\[ brackets close \\]
   - Test matrix rendering: 
     \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}

5. Content Extraction:
   - Scan ${context} for:
     * Theorem boxes
     * Example solutions
     * Practice problems
     * Key definitions
   - Prioritize verbatim reuse of context examples

OUTPUT ONLY RAW LATEX CODE BETWEEN \\documentclass AND \\end{document}
NO BACKTICKS, NO DISCLAIMERS
`;
// VERSION 2: WORKS BUT DOENSNT ACCOUNT PROVING AND PROBLEM SOLVING

// export const GENERATE_LATEX_CODE_PROMPT = (context: string) => `
// Generate exam paper with STRICT LaTeX rules:

// \\documentclass[12pt]{article}
// \\usepackage{amsmath, amssymb, geometry, enumitem}
// \\geometry{a4paper, margin=1in}
// \\title{Mock Exam: [Extracted Topic]}
// \\begin{document}

// \\section*{True/False (10 items)}
// \\begin{enumerate}
//   \\item \\rule{2cm}{0.15mm} \\[\\forall x \\in \\mathbb{R}, x^2 \\geq 0\\]
//   \\item \\rule{2cm}{0.15mm} \\(\\frac{d}{dx} \\ln(x) = \\frac{1}{x}\\)
// \\end{enumerate}

// \\section*{Multiple Choice (10 items)}
// \\begin{enumerate}
//   \\item What is \\[\\int_0^1 x^2 dx\\]?
//   \\begin{enumerate}[label=(\\alph*)]
//     \\item \\(\\frac{1}{2}\\) \\quad \\item \\(\\frac{1}{3}\\) \\quad \\item \\(\\frac{1}{4}\\)
//   \\end{enumerate}

// \\end{enumerate}

// \\section*{Fill-in-Blank (10 items)}
// \\begin{enumerate}
//   \\item The solution to \\(x^2 = 9\\) is \\rule{3cm}{0.15mm}
//   \\item \\[\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\rule{3cm}{0.15mm}\\]
// \\end{enumerate}

// \\end{document}

// IRONCLAD RULES:
// 1. Minimum 10 items PER SECTION
// 2. Math Requirements:
//    - All equations: \\[ ... \\] or \\( ... \\)
//    - Matrices: \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}
//    - Sets: \\mathbb{N}, \\mathbb{R}
//    - Derivatives: \\frac{d}{dx} not d/dx

// 3. Error Prevention:
//    a) Escape ALL special chars: & → \\&, % → \\%, _ → \\_
//    b) NO custom commands/packages
//    c) Verify \\begin{enumerate} ↔ \\end{enumerate} pairs
//    d) Use ONLY: amsmath, amssymb, geometry, enumitem

// 4. Content Rules:
//    - Extract 3 core topics from: ${context}
//    - Create variations of key formulas/theorems
//    - For proofs: "Show that..." questions
//    - Use context examples FIRST before creating new ones

// OUTPUT ONLY RAW LATEX CODE BETWEEN \\documentclass AND \\end{document}
// NO EXPLANATIONS, NO MARKDOWN
// `;

// VERSION 1: WORKS BUT TOO SHORT ITEMS
// export const GENERATE_LATEX_CODE_PROMPT = (context: string) => `
// Generate minimal error-free LaTeX exam code ONLY using this structure:

// \\documentclass[12pt]{article}
// \\usepackage{amsmath, amssymb, geometry, enumitem}
// \\geometry{a4paper, margin=1in}
// \\title{Mock Exam: [Core Topic]}
// \\begin{document}

// \\section*{Part I: True/False}
// \\begin{enumerate}
//   \\item \\rule{3cm}{0.15mm} Statement about $R = \\{(x,y) \\mid y = -2x\\}$
// \\end{enumerate}

// \\section*{Part II: Multiple Choice}
// \\begin{enumerate}
//   \\item Question text
//   \\begin{enumerate}[label=(\\alph*)]
//     \\item Choice 1 \\quad \\item Choice 2
//   \\end{enumerate}
// \\end{enumerate}

// \\section*{Part III: Fill-in-Blank}
// \\begin{enumerate}
//   \\item The derivative of $e^x$ is \\rule{4cm}{0.15mm}
// \\end{umerate}

// \\end{document}

// STRICT RULES:
// 1. Use ONLY these packages: amsmath, amssymb, geometry, enumitem
// 2. FORBIDDEN: Custom commands, proof environments, fragile packages
// 3. Math safety:
//    - Inline: \\(...\\) NEVER $
//    - Display: \\[...\\]
//    - Escape special chars: \\&, \\%, \\_
// 4. Error prevention:
//    - No undefined commands
//    - Match all \\begin with \\end
//    - Simple enumerate only
// 5. Content rules:
//    - Extract 3-5 key topics from: ${context}
//    - Mix question types evenly
//    - Use course examples verbatim when possible

// OUTPUT ONLY RAW LATEX CODE BETWEEN \\documentclass AND \\end{document}
// `;
