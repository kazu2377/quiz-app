'use client';

import { useState, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
}

export interface QuizConfig {
  category: string;
  difficulty: string;
  questionCount: number;
}

export default function QuizSetup({ onStartQuiz }: QuizSetupProps) {
  const { user } = useUser();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const difficulties = ['easy', 'medium', 'hard'];
  const questionCounts = [5, 10, 15, 20];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onStartQuiz({
      category,
      difficulty,
      questionCount
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            クイズアプリ
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {user?.firstName || user?.username || 'ユーザー'}
            </span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {(user?.firstName || user?.username || 'U')[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Link
            href="/history"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center transition duration-200"
          >
            成績履歴
          </Link>
          <SignOutButton>
            <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-lg transition duration-200">
              ログアウト
            </button>
          </SignOutButton>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">すべて</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">すべて</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'easy' ? '簡単' : diff === 'medium' ? '普通' : '難しい'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題数
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {questionCounts.map((count) => (
                <option key={count} value={count}>
                  {count}問
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            クイズ開始
          </button>
        </form>
      </div>
    </div>
  );
}
