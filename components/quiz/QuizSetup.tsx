import React, { useState, useEffect } from 'react';
import { QuizMode, Topic, QuizSettings } from '../../types';
import { fetchTopics } from '../../services/apiService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import { v4 as uuidv4 } from 'uuid';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [mode, setMode] = useState<QuizMode>(QuizMode.PAST_QUESTIONS);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const quizId = uuidv4();

  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

   const examTypes = ['WAEC', 'NECO', 'utme'];
  const subjects = ['math', 'Physics', 'Chemistry', 'Biology', 'History'];
  const years = ['2023', '2022', '2021', '2020', '2019'];

  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true);
      const fetchedTopics = await fetchTopics();
      setTopics(fetchedTopics);
      if (fetchedTopics.length > 0) {
        setSelectedTopic(fetchedTopics[0].id);
      }
      setIsLoading(false);
    }
    loadTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(mode === QuizMode.PAST_QUESTIONS){
       onStartQuiz({ id: quizId, selectedExamType, selectedSubject, selectedYear, mode, numQuestions } as any);
      // Additional handling for past questions can be added here
      console.log(`Selected Exam Type: ${selectedExamType}, Subject: ${selectedSubject}, Year: ${selectedYear}`);
    }else{
       const topic = topics.find(t => t.id === selectedTopic);
    if (topic) {
      onStartQuiz({ mode, topic, numQuestions });
    }
    }
  };

  // FIX: Replaced inline prop type with a dedicated interface to resolve a TypeScript error where `children` was not being recognized.
  interface ModeButtonProps {
    value: QuizMode;
    children: React.ReactNode;
  }
  const ModeButton = ({ value, children }: ModeButtonProps) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      className={`flex-1 p-4 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 border-2 ${
        mode === value
          ? 'bg-[#0099FF]/20 border-[#0099FF]'
          : 'bg-white border-[#0099FF] hover:bg-[#0099FF]/20'
      }`}
    >
      {children}
    </button>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white">
      <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-black bg-black">
        Create a New Quiz
      </h2>
      <p className="text-center text-gray-400 mb-8">Choose your challenge and prove your knowledge.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-3 text-black">1. Select Quiz Mode</label>
          <div className="flex gap-4">
            <ModeButton value={QuizMode.PAST_QUESTIONS}>
              <BookOpenIcon className="w-8 h-8 text-[#0099FF]" />
              <span className="font-semibold text-[#0099FF]">{QuizMode.PAST_QUESTIONS}</span>
            </ModeButton>
            <ModeButton value={QuizMode.AI_GENERATED}>
              <BrainCircuitIcon className="w-8 h-8 text-[#0099FF]" />
              <span className="font-semibold text-[#0099FF]">{QuizMode.AI_GENERATED}</span>
            </ModeButton>
          </div>
        </div>
        {
          mode==="Past Questions"?
          (
          <div className="space-y-4"> {/* Added space-y-4 for vertical spacing between selects */}
            <div>
              <label htmlFor="examType" className="block text-lg font-semibold mb-3 text-black">2. Choose an Exam Type</label>
              <select
                id="examType"
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
              >
                <option value="" disabled>Select Exam Type</option> {/* Added a disabled default option */}
                {examTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-lg font-semibold mb-3 text-black">3. Choose a Subject</label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
              >
                <option value="" disabled>Select Subject</option> {/* Added a disabled default option */}
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-lg font-semibold mb-3 text-black">4. Choose a Year</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
              >
                <option value="" disabled>Select Year</option> {/* Added a disabled default option */}
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        ) :

         <div>
          <label htmlFor="topic" className="block text-lg font-semibold mb-3 text-black">2. Choose a Subject</label>
          {isLoading ? (
            <div className="w-full h-12 bg-brand-surface rounded-lg animate-pulse"></div>
          ) : (
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
            >
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
          )}
        </div>
        }

        <div>
          <label htmlFor="numQuestions" className="block text-lg font-semibold mb-3 text-black">Number of Questions: <span className="text-[#0099FF] font-bold">{numQuestions}</span></label>
          <input
            type="range"
            id="numQuestions"
            min="5"
            max="20"
            step="5"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-[#0099FF]"
          />
        </div>

        <Button type="submit" className="w-full !py-4 text-lg" disabled={isLoading}>
          Start Quiz
        </Button>
      </form>
    </Card>
  );
};

export default QuizSetup;