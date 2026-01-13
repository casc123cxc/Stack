import { GoogleGenAI } from "@google/genai";
import { ProjectConfig } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSystemInstruction = async (config: ProjectConfig): Promise<string> => {
  const ai = createClient();
  
  const activeConstraints = config.constraints
    .filter(c => c.active)
    .map(c => `- ${c.label}: ${c.description}`)
    .join('\n');

  const stackList = config.selectedStacks.join(', ');

  const prompt = `
    You are an expert Prompt Engineer and Technical Lead. Your task is to generate a comprehensive "System Instruction" (also known as a System Prompt) that a user can copy and paste into another LLM configuration to build a specific application.

    **User's Project Details:**
    - **Project Name:** ${config.name}
    - **Selected Tech Stack:** ${stackList}
    - **Tone:** ${config.tone}
    - **Description/Goal:** ${config.description}
    - **Specific Context:** ${config.additionalContext}

    **Required Constraints & Behavior Rules:**
    ${activeConstraints || "No specific extra constraints selected."}

    **Task:**
    Create a highly structured, professional System Instruction block.
    
    The System Instruction MUST follow this structure:
    1.  **Role Definition**: Who the AI is (e.g., Senior ${stackList} Engineer).
    2.  **Tech Stack & Syntax**: 
        - Define strict versions for: ${stackList}.
        - If "Strict Syntax Adherence" is active, emphasize idiomatic patterns (e.g., React Hooks, Python type hinting).
    3.  **Code Output Standards**:
        - If "Require Code Examples" is active, strictly mandate that the AI MUST provide code examples for every explanation.
        - Define file structure if relevant.
    4.  **Behavioral Guidelines**: How to handle errors, how to explain code, and tone.
    5.  **The "Rules of Engagement"**: Incorporate the user's constraints strictly (e.g., if "Prevent Breaking Changes" is active, forbid legacy deprecations).

    **Output Format:**
    Return ONLY the raw Markdown content of the system instruction. Do not include introductory conversational text like "Here is your prompt". Start directly with the prompt content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      }
    });

    return response.text || "Failed to generate prompt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with Gemini API. Please check your API key.");
  }
};

export const suggestImprovements = async (currentPrompt: string): Promise<string> => {
    const ai = createClient();
    const prompt = `
      Analyze the following System Instruction and suggest 3 specific improvements or missing edge cases that could make it more robust for a production-grade application.

      System Instruction:
      ${currentPrompt}

      Output format: A bulleted list of 3 short tips.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "No improvements found.";
    } catch (e) {
        return "Could not fetch suggestions.";
    }
}

export const analyzeProjectUrl = async (url: string): Promise<Partial<ProjectConfig>> => {
  const ai = createClient();
  
  const prompt = `
    Analyze this URL: ${url}
    
    You are a technical analyst. I need you to extract or infer project details to scaffold a developer system instruction.
    If it is a GitHub repo, analyze the languages and readme.
    If it is a YouTube video, analyze the transcript/topic to find what stack is being taught or used.
    If it is a website, analyze the technology and purpose.

    1. **Project Name**: Inferred from title or repo name.
    2. **Description**: A concise summary of what the code/project/video does (max 2 sentences).
    3. **Tech Stack**: Identify languages and frameworks. 
       Return an array of strings. prioritize matching these exactly if present: 
       [Python, TypeScript, React, Node.js, Next.js, Tailwind CSS, Vue, Svelte, Angular, Go, Rust, C++, Java, C#, SQL, PostgreSQL, MongoDB, Docker, AWS, Swift, Flutter]. 
       If others are found, include them as well.
    4. **Tone**: Suggest one of [Professional, Educational, Concise, Socratic].

    Return JSON format only.
    Schema:
    {
      "name": "string",
      "description": "string",
      "selectedStacks": ["string"],
      "tone": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from analysis");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("URL Analysis Error:", error);
    throw new Error("Failed to analyze URL.");
  }
};