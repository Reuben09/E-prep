import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizPlayer from '../components/quiz/QuizPlayer';
import QuizResults from '../components/quiz/QuizResults';
import { Quiz, QuizSettings, UserAnswer, QuizResult, QuizMode, Question } from '../types';
// Removed fetchPastQuestions as it's replaced by fetchAlocQuestions
import { transformQuestions } from '@/helper/transformQuestions';
// Updated to import both AI generation functions
import { generateQuizQuestionsFromPdf, generateQuizQuestionsFromTopic } from '../services/geminiService'; // Assuming you put both functions here
// Removed static JSON imports as we're dynamically fetching
// import aiQuestions from '../questions-ai.json';
// import pstQuestions from '../questions.json';
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

      } else if (settings.mode === QuizMode.AI_GENERATED) {
        if (!settings.topic) {
          throw new Error("Topic not provided for AI generated quiz.");
        }
        const generatedQuestions = await generateQuizQuestionsFromTopic(settings.topic, settings.numQuestions);
        console.log(generatedQuestions, 'generatedQuestions from gemini (topic)');
        questions = generatedQuestions?.map(q => ({
          ...q,
          id: uuidv4(),
          topicId: settings.topic!.id // Use non-null assertion as we checked for !settings.topic
        } as Question));

      } else if (settings.mode === QuizMode.PDF_UPLOAD) {
        if (!settings.pdfContentId) {
          throw new Error("PDF content ID not provided for PDF upload quiz.");
        }
        // Here, generateQuizQuestionsFromPdf should internally fetch the PDF content
        // based on the pdfContentId from your backend, or the backend might
        // have already returned the full text in the initial upload response
        // which could then be passed here. For simplicity, assume generateQuizQuestionsFromPdf
        // takes the ID and handles fetching.
        console.log(settings, 'pdfContentId in quiz flow');
        const generatedQuestions = await generateQuizQuestionsFromPdf(settings.pdfExtractedText, settings.numQuestions);
        console.log(generatedQuestions, 'generatedQuestions from gemini (pdf)');
        questions = generatedQuestions?.map(q => ({
          ...q,
          id: uuidv4(),
          topicId: settings.pdfContentId // Using PDF content ID as topicId for consistency
        } as Question));
      }

      if (questions.length === 0) {
        throw new Error(`No questions could be generated for the selected criteria.`);
      }

      if (questions.length < settings.numQuestions) {
        console.warn(`Requested ${settings.numQuestions} questions but only found/generated ${questions.length}.`);
      }

      const newQuiz: Quiz = {
        id: uuidv4(),
        settings,
        questions,
      };
      setCurrentQuiz(newQuiz);
      setFlowState('playing');
    } catch (err: any) {
      console.error("Error starting quiz:", err);
      setError(err.message || 'An unexpected error occurred while starting the quiz.');
      setFlowState('setup');
    }
  }, []);

  const handleSubmitQuiz = useCallback(async (answers: UserAnswer[]) => {
    if (!currentQuiz) return;
    console.log(currentQuiz, 'currentQuiz on submit');
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

    const result: QuizResult = {
      score,
      answers,
      topicPerformance: [{
        // Adjust topicName based on quiz mode for better reporting
        topicName: currentQuiz.settings.mode === QuizMode.PAST_QUESTIONS
          ? currentQuiz.settings.selectedSubject!
          : currentQuiz.settings.mode === QuizMode.AI_GENERATED
            ? currentQuiz.settings.topic!.name
            : 'PDF Uploaded Content', // Default for PDF_UPLOAD
        correct: correctAnswers,
        total: currentQuiz.questions.length
      }]
    };

    setQuizResult(result);
    let subjectNameForDB: string;
    let examTypeForDB: string = "ai"; // Default for AI/PDF generated
    let modeForDB: string = 'ai_generated'; // Default for AI/PDF generated

    if (currentQuiz.settings.mode === QuizMode.PAST_QUESTIONS) {
      subjectNameForDB = currentQuiz.settings.selectedSubject!;
      examTypeForDB = currentQuiz.settings.selectedExamType!.toLowerCase();
      modeForDB = 'past';
    } else if (currentQuiz.settings.mode === QuizMode.AI_GENERATED) {
      subjectNameForDB = currentQuiz.settings.topic!.name;
      examTypeForDB = 'ai';
    } else { // QuizMode.PDF_UPLOAD
      subjectNameForDB = `PDF-${currentQuiz.settings.pdfContentId?.substring(0, 8)}`; // Use a truncated ID
      modeForDB = 'pdf_upload';
    }

    try {
      const user = (await supabase.auth.getUser()).data.user;

      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          user_id: user?.id,
          mode: modeForDB,
          subject: subjectNameForDB,
          exam: examTypeForDB, // Storing exam type for past questions
          score: score,
          question_ids: [], // You might want to store actual question IDs here if available
          total_questions: currentQuiz.questions.length,
          completed: true,
          time_limit_seconds: currentQuiz.settings.numQuestions * 60, // Assuming 1 minute per question as a rough estimate for time limit
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      console.log('✅ Quiz inserted:', data);
      setFlowState('results');
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to save quiz results. Please try again.');
      setFlowState('results'); // Still show results, but indicate save failure
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

  const handleBackToDashboard = () => {
    navigate('/');
  }

  const renderContent = () => {
    switch (flowState) {
      case 'setup':
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-96">
            <LoaderIcon className="w-16 h-16 animate-spin text-[#0099FF]" />
            <p className="mt-4 text-xl text-gray-700">Generating your quiz...</p>
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
    <div className=" ">
      {flowState !== 'setup' && (
        <button onClick={handleBackToDashboard} className="mb-6 text-[#0099FF] hover:text-[#0099FF]/60 transition-colors">
          &larr; Back to Dashboard
        </button>
      )}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default QuizFlowPage;