'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

interface Question {
  id: number;
  question: string;
  options: string;
  correct_answer: number;
  category: string;
  difficulty: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions/list');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('この問題を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('問題が削除されました');
        setQuestions(questions.filter(q => q.id !== id));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('問題の削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessage('問題の削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              問題一覧
            </h1>
            <div className="flex gap-2">
              <Link
                href="/create-question"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                問題を作成
              </Link>
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                クイズを開始
              </Link>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('削除されました') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                問題が見つかりません
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => {
                const options = JSON.parse(question.options);
                return (
                  <div
                    key={question.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            問題 {index + 1}
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                            {question.category}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty === 'easy' ? '簡単' :
                             question.difficulty === 'medium' ? '普通' : '難しい'}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {question.question}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors text-sm"
                      >
                        削除
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {options.map((option: string, optionIndex: number) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            optionIndex === question.correct_answer
                              ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          {option}
                          {optionIndex === question.correct_answer && (
                            <span className="ml-2 text-sm text-green-600">
                              ✓ 正解
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
