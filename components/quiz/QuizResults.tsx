
import React, { useEffect, useState, useMemo } from 'react';
import { Quiz, QuizResult, StudyRecommendation, Question, Topic } from '../../types';
import { getRecommendations, analyzeQuizResults } from '../../services/geminiService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { BookOpenIcon, VideoCameraIcon, ChartBarIcon, SparklesIcon } from './../icons/icons';
import analysisResult from '../../analysis.json'
import Spinner from './Spinner';
import recommendationResult from '../../recommendation.json'

interface QuizResultsProps {
  quiz: Quiz;
  result: QuizResult;
  onRestart: () => void;
  onNewQuiz: () => void;
}

  const ResultCard = ({ title, icon, children }: React.PropsWithChildren<{ title: string; icon: React.ReactNode; }>) => (
    <div className="bg-white rounded-xl p-6 animate-slide-in-up shadow-lg">
      <div className="flex items-center mb-4">
        {/* {icon} */}
        <h3 className="text-xl font-bold text-black ml-3">{title}</h3>
      </div>
      {children}
    </div>
  );


const QuizResults: React.FC<QuizResultsProps> = ({ quiz, result, onRestart, onNewQuiz }) => {
    const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
    const [resultAnalysis, setResultAnalysis] = useState<[]>([]);
     const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
      const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchAnalysisAndRecs = async () => {
        const incorrectAnswers = result.answers.filter(a => !a.isCorrect);
        setIsLoadingAnalysis(true);

        const MAX_RETRIES = 10; // Or however many retries you want
        let retries = 0;

        const attemptFetch = async () => {
            try {
                const analysis = await analyzeQuizResults(incorrectAnswers);
                const recs = await getRecommendations(analysis.weakTopics);
                setRecommendations(recs);
                setResultAnalysis(analysis);
                console.log("Fetched analysis:", analysis);
                console.log("Fetched recommendations:", recs);
                return true; // Success
            } catch (e: any) {
                console.log(e, 'Error fetching analysis or recommendations');
                return false; // Failure
            }
        };

        while (retries < MAX_RETRIES) {
            const success = await attemptFetch();
            console.log(success, `Attempt ${retries + 1} of ${MAX_RETRIES}`);
            if (success) {
                console.log("exiting loop");
                break; // Exit loop on success
            }
            retries++;
            if (retries < MAX_RETRIES) {
                console.log(`Retrying in 10 seconds... (Attempt ${retries + 1} of ${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
            }
        }

        setIsLoadingAnalysis(false);
        console.log("Incorrect Answers:", incorrectAnswers);
    };

    fetchAnalysisAndRecs();
}, [result]);


    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card className="p-8 text-center bg-white">
                <h2 className="text-4xl font-bold mb-2 text-[#0099FF]">Quiz Complete!</h2>
                <p className="text-gray-400 mb-6">Here's how you did 
                {/* on {quiz.settings.selectedSubject}. */}
                </p>
                <div className="text-7xl font-bold bg-clip-text text-[#0099FF] bg-gradient-to-r from-brand-primary to-brand-secondary mb-4">
                    {result.score}%
                </div>
                 <div className="flex justify-center gap-4 mt-8">
                    <Button onClick={onRestart} variant="tertiary">Try Again</Button>
                    <Button onClick={onNewQuiz}>Start New Quiz</Button>
                </div>
            </Card>
                 <div className="grid md:grid-cols-2 gap-6">
        {/* Analysis Card */}
        <ResultCard title="Performance Analysis" icon={<ChartBarIcon className="w-7 h-7 text-brand-secondary"/>}>
          {isLoadingAnalysis && <div className="flex justify-center items-center h-40"><Spinner /></div>}
          {error && <p className="text-red-400">{error}</p>}
          {resultAnalysis && (
            <div className="text-[#666666] space-y-4">
              <p>{resultAnalysis.summary}</p>
              {resultAnalysis.weakTopics?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Areas to Focus On:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {resultAnalysis.weakTopics.map(topic => <li key={topic}>{topic}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </ResultCard>

        {/* Recommendations Card */}
        <ResultCard title="Study Recommendations" icon={<SparklesIcon className="w-7 h-7 text-brand-accent"/>}>
          {isLoadingAnalysis && <div className="flex justify-center items-center h-40"><Spinner /></div>}
          {error && <p className="text-red-400">Could not load recommendations.</p>}
          {recommendations && (
             <div className="space-y-6">
               {recommendations?.videos?.length > 0 && (
                 <div>
                   <h4 className="font-semibold text-white mb-3 flex items-center"><VideoCameraIcon className="w-5 h-5 mr-2" />Recommended Videos</h4>
                   <ul className="space-y-2">
                     {recommendations?.videos?.map((video, i) => (
                       <li key={i}><a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">{video.title}</a></li>
                     ))}
                   </ul>
                 </div>
               )}
               {recommendations?.books?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#666666] mb-3 flex items-center"><BookOpenIcon className="w-5 h-5 mr-2" />Recommended Books</h4>
                  <ul className="space-y-2 text-[#666666]">
                    {recommendations?.books?.map((book, i) => (
                      <li key={i}><strong>{book.title}</strong> by {book.author}</li>
                    ))}
                  </ul>
                </div>
               )}
             </div>
          )}
        </ResultCard>
      </div>

            <Card className="p-6 bg-white text-black">
                <h3 className="text-2xl font-bold mb-4">Review Your Answers</h3>
                 <div className="space-y-6">
                    {quiz.questions.map((question, index) => {
                        const userAnswer = result.answers.find(a => a.questionId === question.id);
                        if (!userAnswer) return null;

                        const isCorrect = userAnswer.isCorrect;
                        const selectedChoice = question.choices[userAnswer.answer];
                        const correctChoice = question.choices[question.answer];

                        return (
                            <div key={question.id} className="p-4 border border-brand-border rounded-lg">
                                <p className="font-semibold mb-2">{index + 1}. {question.prompt}</p>
                                <div className="space-y-2 text-sm">
                                    <p className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                        Your answer: <span className="font-bold">{selectedChoice || 'Not answered'}</span> {isCorrect ? '✅' : '❌'}
                                    </p>
                                    {!isCorrect && <p className="text-green-400">Correct answer: <span className="font-bold">{correctChoice}</span></p>}
                                    <p className="text-gray-400 pt-2 border-t border-brand-border mt-2">{question.explanation}</p>
                                </div>
                            </div>
                        )
                    })}
                 </div>
            </Card>
        </div>
    );
};

export default QuizResults;
