import { GoogleGenAI, Type } from "@google/genai";
import { Question, StudyRecommendation, Topic, Recommendation, Analysis, } from "../types";

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


export const generateQuizQuestionsFromPdf = async (pdfContent: string, numQuestions: number): Promise<Partial<Question>[]> => {
   console.log(pdfContent, 'pdf content in gemini service');
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
Generate ${numQuestions} high-quality, exam-style multiple-choice questions based **solely** on ${pdfContent}.

🧩 QUESTION FORMAT:
Return ONLY valid JSON:
[
  {
    "prompt": "Question text?",
    "choices": ["A", "B", "C", "D"],
    "answer": 0,
    "explanation": "Brief reasoning or working."
  }
]
`

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
//         const prompt = `Provide 3 study recommendations for a student weak in "${topic.name}". Include a mix of YouTube videos and books. and the links must be valid`;

//         const response = await ai.models.generateContent({
//             model: 'gemini-2.5-pro',
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

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    weakTopics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific topics or concepts the student struggled with."
    },
    summary: {
      type: Type.STRING,
      description: "A constructive summary of the student's performance and areas for improvement."
    }
  },
  required: ["weakTopics", "summary"]
};

export const analyzeQuizResults = async (incorrectAnswers: { question: Question; userAnswerIndex: number }[]): Promise<Analysis> => {
   console.log(incorrectAnswers, 'incorrect answers in gemini service');
    if (incorrectAnswers.length === 0) {
        return { weakTopics: [], summary: "Excellent work! You answered all questions correctly. Keep up the great practice." };
    }

    const prompt = `A student took a quiz and answered the following questions incorrectly.
    Analyze their mistakes and identify their weak topics.
    Provide a constructive summary of their performance.
    
    Incorrectly answered questions:
    // ${incorrectAnswers.map(item => `- Question: "${item.question}"\n  - Correct Answer: "${item?.isCorrect}"\n - Student's Answer: "${item?.answer}"\n - Explanation: "${item?.explanation}"`).join('\n')}
    
    Based on this, what are the key weak topics? Provide a summary to help the student improve. Return a JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as Analysis;
    } catch (error) {
        console.error("Error analyzing quiz results:", error);
        throw new Error("Failed to analyze quiz results. The AI might be temporarily unavailable.");
    }
};

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        videos: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING, description: "A valid YouTube search URL." },
                },
                required: ["title", "url"],
            },
            description: "A list of 3-5 recommended YouTube video topics/titles and search URLs."
        },
        books: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    author: { type: Type.STRING },
                },
                required: ["title", "author"],
            },
            description: "A list of 2-3 recommended book titles and authors."
        }
    },
    required: ["videos", "books"]
};

export const getRecommendations = async (weakTopics: string[]): Promise<Recommendation> => {
    if (weakTopics.length === 0) {
        return { videos: [], books: [] };
    }

    const prompt = `Based on a student's weak topics listed below, recommend specific learning resources.
    Weak topics: ${weakTopics.join(', ')}.
    
    Provide:
    1. A list of 3-5 highly relevant YouTube videos. For each, give a clear title and a YouTube search URL (e.g., "https://www.youtube.com/results?search_query=your+search+term").
    2. A list of 2-3 recommended books (textbooks or study guides) with authors.
    
    Return a JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as Recommendation;
    } catch(error) {
        console.error("Error getting recommendations:", error);
        throw new Error("Failed to get learning recommendations. Please try again later.");
    }
};