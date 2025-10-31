'use client';

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string;
  correct_answer: number;
  category: string;
  difficulty: string;
}

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function QuizQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  onNext,
  isLast 
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = JSON.parse(question.options);
  const difficultyText = question.difficulty === 'easy' ? '簡単' : 
                        question.difficulty === 'medium' ? '普通' : '難しい';

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return;
    
    setSelectedOption(optionIndex);
    const correct = optionIndex === question.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            問題 {questionNumber} / {totalQuestions}
          </span>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {question.category}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {difficultyText}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {options.map((option: string, index: number) => {
            let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ';
            
            if (showResult) {
              if (index === question.correct_answer) {
                buttonClass += 'bg-green-50 border-green-500 text-green-800';
              } else if (index === selectedOption && !isCorrect) {
                buttonClass += 'bg-red-50 border-red-500 text-red-800';
              } else {
                buttonClass += 'bg-gray-50 border-gray-300 text-gray-500';
              }
            } else {
              buttonClass += 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === question.correct_answer && (
                    <span className="text-green-600 text-xl">✓</span>
                  )}
                  {showResult && index === selectedOption && !isCorrect && (
                    <span className="text-red-600 text-xl">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="text-center">
          <div className={`mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">
              {isCorrect ? '正解！' : '不正解...'}
            </p>
            {!isCorrect && (
              <p className="text-sm mt-1">
                正解は: {options[question.correct_answer]}
              </p>
            )}
          </div>
          
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            {isLast ? '結果を見る' : '次の問題'}
          </button>
        </div>
      )}
    </div>
  );
}
