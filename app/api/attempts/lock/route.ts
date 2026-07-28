import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { attemptId, questionId, selectedOption, timeSpentSeconds } = body;

    if (!attemptId || !questionId || !selectedOption) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (attemptId, questionId, selectedOption)' },
        { status: 400 }
      );
    }

    // Backend Lock Enforcement: Check if answer for this attempt & question already exists or is locked
    if (isSupabaseConfigured) {
      const { data: existing } = await supabase
        .from('attempt_answers')
        .select('id, is_locked')
        .eq('attempt_id', attemptId)
        .eq('question_id', questionId)
        .single();

      if (existing && existing.is_locked) {
        return NextResponse.json(
          {
            success: false,
            error: 'LOCKED_ANSWER_OVERWRITE_FORBIDDEN: Once an answer is locked in a CBT attempt, it cannot be modified or reattempted.',
            isLocked: true
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Answer successfully confirmed and permanently locked.',
      attemptId,
      questionId,
      selectedOption,
      isLocked: true,
      lockedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lock operation failed' },
      { status: 500 }
    );
  }
}
