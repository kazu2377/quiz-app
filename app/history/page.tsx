'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuizResult {
  id: number;
  user_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export default function HistoryPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    fetchResults();
  }, [isSignedIn, user, router]);

  const fetchResults = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/results?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">読み込み中...</div>
      </div>
    );
  }

  const averageScore = results.length > 0 
    ? Math.round((results.reduce((sum, result) => sum + result.score, 0) / results.reduce((sum, result) => sum + result.total_questions, 0)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.firstName || user.username || 'ユーザー'}さんの成績履歴
              </h1>
              <p className="text-gray-600 mt-2">
                総プレイ回数: {results.length}回 | 平均正答率: {averageScore}%
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                クイズをプレイ
              </Link>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                まだクイズをプレイしていません
              </p>
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors inline-block"
              >
                最初のクイズを開始
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const percentage = Math.round((result.score / result.total_questions) * 100);
                const date = new Date(result.completed_at).toLocaleDateString('ja-JP');
                const time = new Date(result.completed_at).toLocaleTimeString('ja-JP');
                
                return (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          スコア: {result.score}/{result.total_questions} 問正解
                        </p>
                        <p className="text-sm text-gray-600">
                          {date} {time}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          percentage >= 80 ? 'text-green-600' :
                          percentage >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          正答率
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-600' :
                            percentage >= 60 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
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
