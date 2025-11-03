
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizPlayer from '../components/quiz/QuizPlayer';
import QuizResults from '../components/quiz/QuizResults';
import { Quiz, QuizSettings, UserAnswer, QuizResult, QuizMode, Question } from '../types';
import { fetchPastQuestions } from '../services/apiService';
import { transformQuestions } from '@/helper/transformQuestions';
import { generateQuizQuestionsFromTopic } from '../services/geminiService';
import aiQuestions from '../questions-ai.json';
import pstQuestions from '../questions.json';
import LoaderIcon from '../components/icons/LoaderIcon';
import { fetchAlocQuestions } from '../services/alocApiService';
import { supabase } from '../integrations/supabase/client';

type QuizFlowState = 'setup' | 'loading' | 'playing' | 'results';

interface QuizFlowPageProps {
  onBackToDashboard: () => void;
}

const QuizFlowPage: React.FC<QuizFlowPageProps> = ({ onBackToDashboard }) => {
  const [flowState, setFlowState] = useState<QuizFlowState>('setup');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartQuiz = useCallback(async (settings: QuizSettings) => {
    console.log(aiQuestions);;
    setFlowState('loading');
    setError(null);
    try {
      let questions: Question[] = [];
      if (settings.mode === QuizMode.PAST_QUESTIONS) {
        console.log(settings, 'settings in past questions');
        // questions = await fetchPastQuestions(settings.topic.id, settings.numQuestions);
              const fetchedQuestions = await fetchAlocQuestions({
          subject: settings.selectedSubject,
          year: parseInt(settings.selectedYear, 10),
          type: settings.selectedExamType.toLowerCase()
        });
        console.log(fetchedQuestions, 'fetchedQuestions');
  const transformed = transformQuestions(fetchedQuestions);
  console.log(transformed, 'transformed');
  questions = transformed.questions.map(q => ({
    ...q,
    topicId: settings.id
  }));

      } else {
        // const generatedQuestions = await generateQuizQuestionsFromTopic(settings.topic, settings.numQuestions);
        questions = aiQuestions.questions.map(q => ({
            ...q,
            id: uuidv4(),
            topicId: settings.topic.id
        } as Question));
      }

      if(questions.length < settings.numQuestions){
          console.warn(`Requested ${settings.numQuestions} but only found ${questions.length}.`);
          if(questions.length === 0){
             throw new Error(`No questions found for topic: ${settings.topic.name}.`);
          }
      }

      const newQuiz: Quiz = {
        id: uuidv4(),
        settings,
        questions,
      };
      setCurrentQuiz(newQuiz);
      setFlowState('playing');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setFlowState('setup');
    }
  }, []);

 const handleSubmitQuiz = useCallback(async (answers: UserAnswer[]) => {
  if (!currentQuiz) return;

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

  const result: QuizResult = {
    score,
    answers,
    topicPerformance: [{
      topicName: currentQuiz.settings.selectedSubject,
      correct: correctAnswers,
      total: currentQuiz.questions.length
    }]
  };

  setQuizResult(result);

  try {
     const user = (await supabase.auth.getUser()).data.user;

    // 🧩 Create a new quiz record (INSERT instead of UPDATE)
    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: user?.id,
        mode: 'ai_generated',
        subject: currentQuiz.settings.topic.name,
        exam: "neco",
        score: score,
        question_ids:[],
        total_questions: currentQuiz.questions.length,
        completed: true,
        time_limit_seconds: currentQuiz.settings.numQuestions,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    console.log('✅ Quiz inserted:', data);
    // Insert the quiz result

    setFlowState('results');
  } catch (err) {
    console.error('Error submitting quiz:', err);
  }
}, [currentQuiz]);

  const handleRestart = useCallback(() => {
    if (currentQuiz) {
        setFlowState('playing');
    }
  }, [currentQuiz]);

  const handleNewQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setQuizResult(null);
    setFlowState('setup');
  }, []);

  const handleBackToDashboard = ()=>{
    navigate('/');
  }

  const renderContent = () => {
    switch (flowState) {
      case 'setup':
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-96">
            <LoaderIcon className="w-16 h-16 animate-spin text-brand-primary" />
            <p className="mt-4 text-xl">Generating your quiz...</p>
          </div>
        );
      case 'playing':
        return currentQuiz && <QuizPlayer quiz={currentQuiz} onSubmit={handleSubmitQuiz} />;
      case 'results':
        return currentQuiz && quizResult && <QuizResults quiz={currentQuiz} result={quizResult} onRestart={handleRestart} onNewQuiz={handleNewQuiz} />;
      default:
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {flowState !== 'setup' && (
         <button onClick={handleBackToDashboard} className="mb-6 text-[#0099FF] hover:text-[#0099FF]/60 transition-colors">
            &larr; Back to Dashboard
         </button>
      )}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default QuizFlowPage;