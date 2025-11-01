'use client';

import { useState } from 'react';
import type React from 'react';
import type { Question } from '@/lib/database';

interface QuestionsListProps {
  initialQuestions: Question[];
}

export default function QuestionsList({
  initialQuestions,
}: QuestionsListProps): React.ReactElement {
  const [questions, setQuestions] = useState(initialQuestions);
  const [message, setMessage] = useState('');

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
        setQuestions((prev) => prev.filter((question) => question.id !== id));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('問題の削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessage('問題の削除に失敗しました');
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">問題が見つかりません</p>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.includes('削除されました')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const options = JSON.parse(question.options) as string[];
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
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        question.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : question.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {question.difficulty === 'easy'
                        ? '簡単'
                        : question.difficulty === 'medium'
                        ? '普通'
                        : '難しい'}
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
                {options.map((option, optionIndex) => (
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
                      <span className="ml-2 text-sm text-green-600">✓ 正解</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
