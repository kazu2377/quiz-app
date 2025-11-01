import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { question, options, correctAnswer, category, difficulty } = await request.json();

    if (!question || !options || !Array.isArray(options) || correctAnswer === undefined || !category || !difficulty) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    if (options.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 options are required' },
        { status: 400 }
      );
    }

    if (correctAnswer < 0 || correctAnswer >= options.length) {
      return NextResponse.json(
        { error: 'Correct answer index is out of range' },
        { status: 400 }
      );
    }

    await db.createQuestion(question, JSON.stringify(options), correctAnswer, category, difficulty);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
