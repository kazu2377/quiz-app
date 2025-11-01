import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const questions = await db.getQuestions(undefined, undefined, 500);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
