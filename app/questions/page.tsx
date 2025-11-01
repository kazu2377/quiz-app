import Link from 'next/link';
import QuestionsList from '@/components/QuestionsList';
import type { Question } from '@/lib/database';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000');

async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(`${siteUrl}/api/questions/list`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      console.error('Failed to fetch questions:', response.statusText);
      return [];
    }

    const data = (await response.json()) as Question[];
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

export default async function QuestionsPage(): Promise<JSX.Element> {
  const questions = await fetchQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">問題一覧</h1>
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
          <QuestionsList initialQuestions={questions} />
        </div>
      </div>
    </div>
  );
}
