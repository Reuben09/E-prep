
import React, { useEffect, useState, useMemo } from 'react';
import { Quiz, QuizResult, StudyRecommendation, Question, Topic } from '../../types';
import { getStudyRecommendations } from '../../services/geminiService';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface QuizResultsProps {
  quiz: Quiz;
  result: QuizResult;
  onRestart: () => void;
  onNewQuiz: () => void;
}

const RecommendationCard: React.FC<{ rec: StudyRecommendation }> = ({ rec }) => (
    <a href={rec.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-brand-surface hover:bg-white/5 border border-brand-border rounded-lg transition-all">
        <div className="flex items-center gap-4">
            <div className="text-2xl">
                {rec.type === 'youtube' ? '📺' : '📚'}
            </div>
            <div>
                <p className="font-semibold">{rec.title}</p>
                <p className="text-sm text-brand-secondary">{rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}</p>
            </div>
        </div>
    </a>
)

const QuizResults: React.FC<QuizResultsProps> = ({ quiz, result, onRestart, onNewQuiz }) => {
    const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(false);

    const weakestTopic = useMemo(() => {
        if (!result.topicPerformance || result.topicPerformance.length === 0) return null;
        
        return result.topicPerformance.reduce((weakest, current) => {
            const weakestAccuracy = weakest.correct / weakest.total;
            const currentAccuracy = current.correct / current.total;
            return currentAccuracy < weakestAccuracy ? current : weakest;
        });
    }, [result.topicPerformance]);


    useEffect(() => {
        if (weakestTopic) {
            const fetchRecs = async () => {
                setIsLoadingRecs(true);
                try {
                    const recs = await getStudyRecommendations({ id: weakestTopic.topicName, name: weakestTopic.topicName });
                    setRecommendations(recs);
                } catch (error) {
                    console.error("Failed to fetch recommendations", error);
                }
                setIsLoadingRecs(false);
            };
            fetchRecs();
        }
    }, [weakestTopic]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card className="p-8 text-center">
                <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-gray-400 mb-6">Here's how you did on {quiz.settings.topic.name}.</p>
                <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary mb-4">
                    {result.score}%
                </div>
                 <div className="flex justify-center gap-4 mt-8">
                    <Button onClick={onRestart} variant="secondary">Try Again</Button>
                    <Button onClick={onNewQuiz}>Start New Quiz</Button>
                </div>
            </Card>

            {recommendations.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-2xl font-bold mb-4">Study Recommendations for <span className="text-brand-primary">{weakestTopic?.topicName}</span></h3>
                    {isLoadingRecs ? (
                        <div className="space-y-3">
                            <div className="w-full h-16 bg-brand-surface rounded-lg animate-pulse"></div>
                            <div className="w-full h-16 bg-brand-surface rounded-lg animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recommendations.map((rec, index) => <RecommendationCard key={index} rec={rec} />)}
                        </div>
                    )}
                </Card>
            )}

            <Card className="p-6">
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
