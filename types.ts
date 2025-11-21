
export enum QuizMode {
  PAST_QUESTIONS = 'Past Questions',
  AI_GENERATED = 'AI-Generated',
  PDF_UPLOAD = "Upload"
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
  question: string;
  options: string[];
}

export interface QuizSettings {
  mode: QuizMode;
  numQuestions: number;
  examType?: string;
  examSubject?: string;
  examYear?: string;
  topicId?: string;
  topicName?: string;
  topic?: string;
  selectedExamType?: string;
  selectedSubject?: string;
  selectedYear?: string;
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

export interface Recommendation {
  videos: { title: string; url: string; }[];
  books: { title: string; author: string; }[];
}

export interface Analysis {
  weakTopics: string[];
  summary: string;
}