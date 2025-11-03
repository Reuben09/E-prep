
import { User, Topic, QuizMode } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_BASE_URL = 'https://questions.aloc.com.ng/api/v2';
const API_KEY = 'ALOC-673e1644783359556846'; // THIS IS A PUBLIC API KEY, IN A REAL APP, HANDLE SECURELY


// --- MOCK DATABASE ---

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Chinedu',
  email: 'chinedu@eprep.com',
  streak: 5,
  badges: ['Quick Starter', 'Consistent Learner'],
};

const MOCK_TOPICS: Topic[] = [
  { id: 'topic-1', name: 'Algebra' },
  { id: 'topic-2', name: 'Photosynthesis' },
  { id: 'topic-3', name: 'Nigerian Civil War' },
  { id: 'topic-4', name: 'Organic Chemistry' },
];


export interface Question {
  id: string;
  question: string;
  options: { a: string; b: string; c: string; d: string; e?: string };
  answer: string;
  solution: string;
  type: string; // e.g., "utme"
  subject: string; // e.g., "chemistry"
  year: number; // e.g., 2010
  image?: string; // URL to an image
  prompt: string;
  choices: string[];
  explanation: string;
  topicId: string;
}

export interface ApiResponse {
    status: string;
    message: string;
    data: Question[];
}

export interface Topic {
  id: string;
  name: string;
}

const MOCK_PAST_QUESTIONS: Question[] = [
    { id: uuidv4(), prompt: 'What is the powerhouse of the cell?', choices: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 1, explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP).', topicId: 'topic-2' },
    { id: uuidv4(), prompt: 'Solve for x: 2x + 5 = 15', choices: ['3', '4', '5', '6'], answer: 2, explanation: '2x = 15 - 5 => 2x = 10 => x = 5.', topicId: 'topic-1' },
    { id: uuidv4(), prompt: 'When did the Nigerian Civil War end?', choices: ['1967', '1970', '1975', '1980'], answer: 1, explanation: 'The Nigerian Civil War ended on January 15, 1970.', topicId: 'topic-3' },
    { id: uuidv4(), prompt: 'What is the primary reactant in photosynthesis?', choices: ['Oxygen', 'Glucose', 'Carbon Dioxide', 'Water'], answer: 2, explanation: 'Photosynthesis uses sunlight, water, and carbon dioxide to create glucose.', topicId: 'topic-2' },
    { id: uuidv4(), prompt: 'Which of these is an alkane?', choices: ['Ethene', 'Methane', 'Propyne', 'Benzene'], answer: 1, explanation: 'Methane (CH4) is the simplest alkane, a saturated hydrocarbon.', topicId: 'topic-4' },
];


// --- MOCK API FUNCTIONS ---

const simulateNetworkDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

export const login = async (email: string, password: string): Promise<User> => {
  await simulateNetworkDelay();
  if (email && password) {
    return MOCK_USER;
  }
  throw new Error('Invalid credentials');
};

// export const fetchTopics = async (): Promise<Topic[]> => {
//     await simulateNetworkDelay(300);
//     return MOCK_TOPICS;
// }

// export const fetchPastQuestions = async (topicId: string, limit: number): Promise<Question[]> => {
//     await simulateNetworkDelay();
//     const filtered = MOCK_PAST_QUESTIONS.filter(q => q.topicId === topicId);
//     return filtered.slice(0, limit);
// }

export const submitQuizResult = async (result: any): Promise<{ success: boolean }> => {
    await simulateNetworkDelay();
    console.log("Submitted Quiz Result:", result);
    return { success: true };
}


// --- Existing fetchTopics (placeholder if not using an actual API) ---
export const fetchTopics = async (): Promise<Topic[]> => {
  // In a real application, this would fetch from an actual topics API.
  // For this example, we'll return a static list.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'math', name: 'Mathematics' },
        { id: 'eng', name: 'English' },
        { id: 'phy', name: 'Physics' },
        { id: 'chem', name: 'Chemistry' },
        { id: 'bio', name: 'Biology' },
      ]);
    }, 300);
  });
};

// --- New API Calls for Past Questions Metadata (Static for now) ---
export const fetchExamTypes = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['utme', 'waec', 'neco']); // Based on common exam types or what the API might support
    }, 200);
  });
};

export const fetchExamSubjects = async (examType?: string): Promise<string[]> => {
  // This could be dynamic based on examType if a more sophisticated API existed.
  // For Aloc.com.ng, it seems consistent across types, but we'll list common ones.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        'english language', 'mathematics', 'physics', 'chemistry', 'biology',
        'economics', 'government', 'literature-in-english', 'geography',
        'crk', 'irk', 'commerce', 'accounting', 'agricultural science'
      ]);
    }, 200);
  });
};

export const fetchExamYears = async (examType?: string, subject?: string): Promise<string[]> => {
  // Aloc.com.ng supports years from 1983 up to a recent year.
  // We'll generate a range for the dropdown.
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  // Going back 20 years from current, adjust as needed.
  for (let i = 0; i <= (currentYear - 2000); i++) { // From 2000 to current year
    years.push((currentYear - i).toString());
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(years.sort((a,b) => parseInt(b) - parseInt(a))); // Sort descending
    }, 200);
  });
};


// --- New API Call to Fetch Actual Past Questions ---
export const fetchPastQuestions = async (subject: string, year: string, type: string): Promise<Question[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/q`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS might be an issue, needs proper backend handling
        'Token': API_KEY,
      },
      params: {
        subject: subject.toLowerCase(), // API expects lowercase
        year: year,
        type: type.toLowerCase(), // API expects lowercase
        // num_questions: numQuestions // The API doesn't seem to have a direct num_questions param
      },
    });

    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      console.error('API Error:', response.data.message);
      throw new Error(response.data.message || 'Failed to fetch past questions.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Axios error fetching past questions:', error.message);
        if (error.response) {
            console.error('API Response error:', error.response.data);
            if (error.response.status === 404 && error.response.data.message === "No questions found for the specified parameters") {
                throw new Error("No questions found for this selection. Please try different options.");
            }
        }
    } else {
        console.error('Unknown error fetching past questions:', error);
    }
    throw new Error('Could not fetch past questions. Please check your network and try again.');
  }
};