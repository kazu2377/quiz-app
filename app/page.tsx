'use client';

import { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import QuizSetup, { QuizConfig } from '@/components/QuizSetup';
import QuizQuestion from '@/components/QuizQuestion';
import QuizResult from '@/components/QuizResult';

interface Question {
  id: number;
  question: string;
  options: string;
  correct_answer: number;
  category: string;
  difficulty: string;
}

type GameState = 'setup' | 'quiz' | 'result';

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = async (config: QuizConfig) => {
    setLoading(true);
    setQuizConfig(config);
    
    try {
      const params = new URLSearchParams({
        limit: config.questionCount.toString(),
      });
      
      if (config.category) {
        params.append('category', config.category);
      }
      
      if (config.difficulty) {
        params.append('difficulty', config.difficulty);
      }

      const response = await fetch(`/api/questions?${params}`);
      const data = await response.json();
      
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameState('quiz');
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('問題の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      saveResult();
      setGameState('result');
    }
  };

  const saveResult = async () => {
    if (!quizConfig || !user) return;
    
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          score: score,
          totalQuestions: questions.length,
        }),
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const restartQuiz = () => {
    setGameState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizConfig(null);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">クイズアプリ</h1>
          <p className="text-xl text-gray-700 mb-8">クイズをプレイするにはログインが必要です</p>
          <RedirectToSignIn />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">問題を読み込み中...</div>
      </div>
    );
  }

  if (gameState === 'setup') {
    return <QuizSetup onStartQuiz={startQuiz} />;
  }

  if (gameState === 'quiz' && questions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          isLast={currentQuestionIndex === questions.length - 1}
        />
      </div>
    );
  }

  if (gameState === 'result' && quizConfig) {
    return (
      <QuizResult
        userName={user.firstName || user.username || 'ユーザー'}
        score={score}
        totalQuestions={questions.length}
        onRestart={restartQuiz}
      />
    );
  }

  return null;
}
