
// /// <reference types="vite/client" />

// import { GoogleGenAI, Type } from "@google/genai";
// import { Question, StudyRecommendation, Topic } from "../types";

// // Remove custom ImportMetaEnv and ImportMeta interfaces; use Vite's type augmentation instead.

// const API_KEY = import.meta.env.VITE_MY_API_KEY;

// if (!API_KEY) {
//   console.warn("Gemini API key not found. Using mock data. Please set the API_KEY environment variable.");
// }

// const ai = new GoogleGenAI({ apiKey: API_KEY! });

// const questionSchema = {
//     type: Type.ARRAY,
//     items: {
//         type: Type.OBJECT,
//         properties: {
//             prompt: { type: Type.STRING, description: "The question text." },
//             choices: {
//                 type: Type.ARRAY,
//                 items: { type: Type.STRING },
//                 description: "An array of 4 possible answers."
//             },
//             answer: { type: Type.INTEGER, description: "The 0-based index of the correct choice." },
//             explanation: { type: Type.STRING, description: "A brief explanation for the correct answer." },
//         },
//         required: ["prompt", "choices", "answer", "explanation"],
//     },
// };

// const recommendationSchema = {
//     type: Type.ARRAY,
//     items: {
//         type: Type.OBJECT,
//         properties: {
//             type: { type: Type.STRING, enum: ["youtube", "book"], description: "The type of recommendation." },
//             title: { type: Type.STRING, description: "The title of the video or book." },
//             url: { type: Type.STRING, description: "The URL to the resource." },
//         },
//         required: ["type", "title", "url"],
//     },
// };


// export const getStudyRecommendations = async (topic: Topic): Promise<StudyRecommendation[]> => {
//     if (!API_KEY) {
//         console.log("Using mock recommendations for topic:", topic.name);
//         return [
//             { type: 'youtube', title: `Introduction to ${topic.name}`, url: '#' },
//             { type: 'book', title: `The Principles of ${topic.name}`, url: '#' },
//             { type: 'youtube', title: `Advanced ${topic.name} Concepts`, url: '#' },
//         ];
//     }

//     try {
//         const prompt = `Provide 3 study recommendations for a student weak in "${topic.name}". Include a mix of YouTube videos and books.`;

//         const response = await ai.models.generateContent({
//             model: 'gemini-2.5-flash',
//             contents: prompt,
//             config: {
//                 responseMimeType: "application/json",
//                 responseSchema: recommendationSchema,
//             },
//         });
        
//         const jsonText = response.text.trim();
//         const recommendations = JSON.parse(jsonText);
        
//         if (!Array.isArray(recommendations)) {
//             throw new Error("Invalid recommendations format from Gemini API");
//         }

//         return recommendations;

//     } catch (error) {
//         console.error("Error getting recommendations from Gemini:", error);
//         throw new Error("Failed to get study recommendations.");
//     }
// };

import { GoogleGenAI, Type } from "@google/genai";
import { Question, StudyRecommendation, Topic } from "../types";

// const API_KEY = import.meta.env.VITE_MY_API_KEY;
const API_KEY = import.meta.env.VITE_MY_API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using mock data. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const questionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            prompt: { type: Type.STRING, description: "The question text." },
            choices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 possible answers."
            },
            answer: { type: Type.INTEGER, description: "The 0-based index of the correct choice." },
            explanation: { type: Type.STRING, description: "A brief explanation for the correct answer." },
        },
        required: ["prompt", "choices", "answer", "explanation"],
    },
};

const recommendationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, enum: ["youtube", "book"], description: "The type of recommendation." },
            title: { type: Type.STRING, description: "The title of the video or book." },
            url: { type: Type.STRING, description: "The URL to the resource." },
        },
        required: ["type", "title", "url"],
    },
};


export const generateQuizQuestionsFromPdf = async (pdfContent: string, numQuestions: number): Promise<Partial<Question>[]> => {
    if (!API_KEY) {
        // Mock response if API key is not available
        console.log("Using mock questions from PDF content.");
        return Array.from({ length: numQuestions }, (_, i) => ({
            prompt: `Mock Question ${i + 1} from PDF?`,
            choices: ['Mock A', 'Mock B', 'Mock C', 'Mock D'],
            answer: i % 4,
            explanation: `This is a mock explanation for question ${i + 1}. The correct answer is option ${String.fromCharCode(65 + (i % 4))}.`
        }));
    }

    try {
const prompt = `
You are an expert **mathematics exam question generator**.

You will be given noisy OCR text extracted from a PDF math note or textbook. The text may contain line breaks, unusual spacing, or misread symbols — ignore those and focus on the educational meaning.

--- START OF TEXT ---
${pdfContent}
--- END OF TEXT ---

🎯 TASK:
Generate ${numQuestions} high-quality, exam-style multiple-choice questions **based only on the real mathematical content** in the text.

🧮 CONTEXT:
The text discusses fractions — including **addition, subtraction, multiplication, and division** of fractions, both with same and different denominators.

🧭 RULES:
- Focus on **concepts, examples, and formulas**.
- Ignore:
  - Random characters or letters (like “tudent C earning”).
  - Formatting, headers, or contact info.
  - Broken equations or non-math fragments.
- If symbols like 𝐴𝐴/𝐵𝐵 appear, interpret them as generic fractions (A/B).
- Never generate irrelevant or random questions (like counting characters or unrelated text).

🧩 QUESTION FORMAT:
Each question must:
- Test **understanding or application** of a concept from the text.
- Have **4 options (A–D)**.
- Contain **1 correct answer** and **3 plausible distractors**.
- Include a brief **explanation** showing the reasoning or method.

📘 OUTPUT:
Return strictly a valid JSON array like this:
[
  {
    "subject": "Mathematics",
    "topic": "Fractions",
    "prompt": "Question text?",
    "choices": ["A", "B", "C", "D"],
    "answer": 0,
    "explanation": "Brief explanation or working."
  }
]

⚠️ IMPORTANT:
- Output **JSON only** — no markdown, no extra text.
- If the text is incomplete or unclear, infer the most logical math meaning.
- If examples are shown, base questions on those examples.
- Never return an empty array — create the best possible questions based on visible math content.
`;


// const prompt = `
// You are an expert exam question generator.

// Given the following academic text extracted from a PDF document:
// """
// ${pdfContent}
// """

// Generate ${numQuestions} *high-quality, exam-style multiple-choice questions* based **solely** on the information in the text.
// Your task is to create exam-style multiple-choice questions **only** from the educational content provided below.
// Ignore any random characters, page numbers, slide headers, IDs, email addresses, or unrelated text.

// Guidelines:
// - Target difficulty: **High school to pre-university (WAEC/NECO/JAMB-level)**.
// - Focus on **core ideas, definitions, cause–effect relationships, reasoning, and factual understanding** found in the text.
// - Avoid trivial details, general knowledge, or guesses not supported by the text.
// - Do NOT make questions about
// - Random strings, characters, numbers, or formatting.
// - General knowledge or assumptions outside the text.
// - Metadata or file information.
// - Each question must:
//   - Be **clear, academically relevant**, and test **understanding**, not recall.
//   - Have **4 options (A–D)**.
//   - Have **one correct answer** and **3 plausible distractors**.
//   - Include a **short explanation** justifying the correct answer.
// - Vary question structure (conceptual, analytical, application-based).
// - Output strictly as a **JSON array** in the format below:

// [
//   {
//     "prompt": "Question text?",
//     "choices": ["A", "B", "C", "D"],
//     "answer": 0, // index of correct choice
//     "explanation": "Brief reasoning or reference to the text"
//   }
// ]
// `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Consider 'gemini-1.5-flash' or 'gemini-1.5-pro' for larger text inputs
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const questions = JSON.parse(jsonText);

        if (!Array.isArray(questions)) {
            throw new Error("Invalid response format from Gemini API");
        }
        
        return questions;

    } catch (error) {
        console.error("Error generating quiz from Gemini:", error);
        throw new Error("Failed to generate AI quiz from PDF. Please try again later.");
    }
};


export const generateQuizQuestionsFromTopic = async (topic: Topic, numQuestions: number): Promise<Partial<Question>[]> => {
    console.log(topic, 'topic');
    if (!API_KEY) {
        // Mock response if API key is not available
        console.log("Using mock questions for topic:", topic.name);
        return Array.from({ length: numQuestions }, (_, i) => ({
            prompt: `Mock Question ${i + 1} for ${topic.name}?`,
            choices: ['Mock A', 'Mock B', 'Mock C', 'Mock D'],
            answer: i % 4,
            explanation: `This is a mock explanation for question ${i + 1}. The correct answer is option ${String.fromCharCode(65 + (i % 4))}.`
        }));
    }

    try {
        const prompt = `Generate ${numQuestions} multiple-choice questions for an exam on the topic "${topic.name}". The questions should be high-school level difficulty. Ensure there are 4 choices for each question.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const questions = JSON.parse(jsonText);

        if (!Array.isArray(questions)) {
            throw new Error("Invalid response format from Gemini API");
        }
        
        return questions;

    } catch (error) {
        console.error("Error generating quiz from Gemini:", error);
        throw new Error("Failed to generate AI quiz. Please try again later.");
    }
};

export const getStudyRecommendations = async (topic: Topic): Promise<StudyRecommendation[]> => {
    if (!API_KEY) {
        console.log("Using mock recommendations for topic:", topic.name);
        return [
            { type: 'youtube', title: `Introduction to ${topic.name}`, url: '#' },
            { type: 'book', title: `The Principles of ${topic.name}`, url: '#' },
            { type: 'youtube', title: `Advanced ${topic.name} Concepts`, url: '#' },
        ];
    }

    try {
        const prompt = `Provide 3 study recommendations for a student weak in "${topic.name}". Include a mix of YouTube videos and books.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const recommendations = JSON.parse(jsonText);
        
        if (!Array.isArray(recommendations)) {
            throw new Error("Invalid recommendations format from Gemini API");
        }

        return recommendations;

    } catch (error) {
        console.error("Error getting recommendations from Gemini:", error);
        throw new Error("Failed to get study recommendations.");
    }
};