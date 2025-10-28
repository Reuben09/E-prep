
export enum QuizMode {
  PAST_QUESTIONS = 'Past Questions',
  AI_GENERATED = 'AI-Generated',
}

export interface User {
  id: string;
  name: string;
  email: string;
  streak: number;
  badges: string[];
}

export interface Topic {
  id: string;
  name:string;
}

export interface Question {
  id: string;
  prompt: string;
  choices: string[];
  answer: number; // index of the correct choice
  explanation: string;
  topicId: string;
}

export interface QuizSettings {
  mode: QuizMode;
  topic: Topic;
  numQuestions: number;
}

export interface UserAnswer {
  questionId: string;
  answer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  answers: UserAnswer[];
  topicPerformance: { topicName: string; correct: number; total: number }[];
  recommendations?: StudyRecommendation[];
}

export interface Quiz {
  id: string;
  settings: QuizSettings;
  questions: Question[];
}

export interface StudyRecommendation {
  type: 'youtube' | 'book';
  title: string;
  url: string;
  thumbnail?: string;
}
