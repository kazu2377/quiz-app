'use client';

import Link from 'next/link';

interface QuizResultProps {
  userName: string;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function QuizResult({ userName, score, totalQuestions, onRestart }: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = '';
  let messageColor = '';
  
  if (percentage >= 80) {
    message = '素晴らしい！';
    messageColor = 'text-green-600';
  } else if (percentage >= 60) {
    message = 'よくできました！';
    messageColor = 'text-blue-600';
  } else if (percentage >= 40) {
    message = 'がんばりました！';
    messageColor = 'text-yellow-600';
  } else {
    message = '練習あるのみ！';
    messageColor = 'text-red-600';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            クイズ完了！
          </h1>
          
          <p className={`text-xl font-semibold ${messageColor}`}>
            {message}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-medium">{userName}さん</span>の結果
          </p>
          
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {score} / {totalQuestions}
          </div>
          
          <div className="text-xl text-gray-600">
            正答率: {percentage}%
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                percentage >= 80 ? 'bg-green-500' :
                percentage >= 60 ? 'bg-blue-500' :
                percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            新しいクイズを開始
          </button>
          
          <Link
            href="/history"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition duration-200 text-center"
          >
            成績履歴を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
