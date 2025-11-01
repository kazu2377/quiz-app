'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateQuestionPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const difficulties = ['easy', 'medium', 'hard'];
  const categories = ['地理', '数学', '科学', '歴史', '技術', '一般'];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(newOptions.length - 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!question.trim() || options.some(opt => !opt.trim()) || !category.trim()) {
      setMessage('すべての項目を入力してください');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/questions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          options: options.map(opt => opt.trim()),
          correctAnswer,
          category: category.trim(),
          difficulty,
        }),
      });

      if (response.ok) {
        setMessage('問題が作成されました！');
        setQuestion('');
        setOptions(['', '']);
        setCorrectAnswer(0);
        setCategory('');
        setDifficulty('easy');
        
        setTimeout(() => {
          router.push('/questions');
        }, 1500);
      } else {
        const data = await response.json();
        setMessage(data.error || '問題の作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating question:', error);
      setMessage('問題の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              問題作成
            </h1>
            <Link
              href="/questions"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              問題一覧に戻る
            </Link>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('作成されました') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                問題文 *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="問題文を入力してください"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選択肢 * (最低2個)
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`選択肢 ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                >
                  選択肢を追加
                </button>
              )}
              <p className="text-sm text-gray-600 mt-2">
                正解の選択肢を選択してください
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-4 h-4 text-blue-600 mr-1"
                    />
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="または新しいカテゴリーを入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                難易度 *
              </label>
              <div className="flex gap-2">
                {difficulties.map((diff) => (
                  <label key={diff} className="flex-1">
                    <input
                      type="radio"
                      name="difficulty"
                      value={diff}
                      checked={difficulty === diff}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    <span className={`px-4 py-2 rounded-lg text-center block cursor-pointer ${
                      diff === 'easy' ? 'bg-green-100 text-green-800' :
                      diff === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {diff === 'easy' ? '簡単' : diff === 'medium' ? '普通' : '難しい'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? '作成中...' : '問題を作成'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
