import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const results = await db.getQuizResultsTest();

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error fetching quiz results test:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
