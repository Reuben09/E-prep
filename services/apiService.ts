
import { User, Topic, Question, QuizMode } from '../types';
import { v4 as uuidv4 } from 'uuid';

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

export const fetchTopics = async (): Promise<Topic[]> => {
    await simulateNetworkDelay(300);
    return MOCK_TOPICS;
}

export const fetchPastQuestions = async (topicId: string, limit: number): Promise<Question[]> => {
    await simulateNetworkDelay();
    const filtered = MOCK_PAST_QUESTIONS.filter(q => q.topicId === topicId);
    return filtered.slice(0, limit);
}

export const submitQuizResult = async (result: any): Promise<{ success: boolean }> => {
    await simulateNetworkDelay();
    console.log("Submitted Quiz Result:", result);
    return { success: true };
}
