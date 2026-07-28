import { Question, SubmittedAnswer, AttemptResult, SectionScore, SubjectName } from '@/types';

export const EXAM_CONFIG = {
  stage: 'Preliminary' as const,
  totalQuestions: 100,
  totalMarks: 100,
  totalDurationMinutes: 60,
  negativeMarking: 0.25,
  sections: [
    { subject: 'English Language' as SubjectName, questionCount: 30, marks: 30, durationMinutes: 20, order: 1 },
    { subject: 'Quantitative Aptitude' as SubjectName, questionCount: 35, marks: 35, durationMinutes: 20, order: 2 },
    { subject: 'Reasoning Ability' as SubjectName, questionCount: 35, marks: 35, durationMinutes: 20, order: 3 },
  ]
};

/**
 * Calculates score for an SBI PO Preliminary test attempt
 */
export function calculateAttemptScore(
  attemptId: string,
  testId: string,
  testTitle: string,
  candidateId: string,
  candidateName: string,
  startedAt: string,
  submittedAt: string,
  questions: Question[],
  userAnswers: Record<string, { selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null; timeSpentSeconds: number }>
): AttemptResult {
  const sectionScores: Record<SubjectName, SectionScore> = {
    'English Language': { subject: 'English Language', totalQuestions: 30, attempted: 0, correct: 0, wrong: 0, skipped: 0, score: 0, maxMarks: 30, accuracy: 0 },
    'Quantitative Aptitude': { subject: 'Quantitative Aptitude', totalQuestions: 35, attempted: 0, correct: 0, wrong: 0, skipped: 0, score: 0, maxMarks: 35, accuracy: 0 },
    'Reasoning Ability': { subject: 'Reasoning Ability', totalQuestions: 35, attempted: 0, correct: 0, wrong: 0, skipped: 0, score: 0, maxMarks: 35, accuracy: 0 }
  };

  const processedAnswers: Record<string, SubmittedAnswer> = {};

  let totalCorrect = 0;
  let totalWrong = 0;
  let totalSkipped = 0;
  let rawScore = 0;

  questions.forEach(q => {
    const userAns = userAnswers[q.id];
    const selected = userAns?.selectedOption || null;
    const timeSpent = userAns?.timeSpentSeconds || 0;
    const secScore = sectionScores[q.subject];

    let isCorrect = false;
    let marksAwarded = 0;

    if (!selected) {
      // Skipped
      totalSkipped += 1;
      if (secScore) secScore.skipped += 1;
    } else {
      if (secScore) secScore.attempted += 1;
      if (selected === q.correctOption) {
        isCorrect = true;
        marksAwarded = 1.0;
        totalCorrect += 1;
        rawScore += 1.0;
        if (secScore) {
          secScore.correct += 1;
          secScore.score += 1.0;
        }
      } else {
        isCorrect = false;
        marksAwarded = -0.25;
        totalWrong += 1;
        rawScore -= 0.25;
        if (secScore) {
          secScore.wrong += 1;
          secScore.score -= 0.25;
        }
      }
    }

    processedAnswers[q.id] = {
      id: `ans_${attemptId}_${q.id}`,
      attemptId,
      questionId: q.id,
      selectedOption: selected,
      isCorrect,
      isLocked: true, // Always locked once submitted
      marksAwarded,
      timeSpentSeconds: timeSpent,
      answeredAt: new Date().toISOString()
    };
  });

  // Calculate subject accuracies
  (Object.keys(sectionScores) as SubjectName[]).forEach(subj => {
    const sec = sectionScores[subj];
    sec.score = Number(Math.max(0, sec.score).toFixed(2));
    sec.accuracy = sec.attempted > 0 ? Number(((sec.correct / sec.attempted) * 100).toFixed(1)) : 0;
  });

  const finalTotalScore = Number(Math.max(0, rawScore).toFixed(2));
  const totalAttempted = totalCorrect + totalWrong;
  const overallAccuracyRate = totalAttempted > 0 ? Number(((totalCorrect / totalAttempted) * 100).toFixed(1)) : 0;

  // Estimated Percentile calculation for SBI PO Prelims
  // Score of ~60+ is usually 90+ percentile, 70+ is 98+ percentile
  let estimatedPercentile = 50;
  if (finalTotalScore >= 75) estimatedPercentile = 99.2;
  else if (finalTotalScore >= 68) estimatedPercentile = 96.5;
  else if (finalTotalScore >= 60) estimatedPercentile = 90.0;
  else if (finalTotalScore >= 50) estimatedPercentile = 78.4;
  else if (finalTotalScore >= 40) estimatedPercentile = 62.0;
  else estimatedPercentile = Number(Math.min(50, Math.max(5, (finalTotalScore / 100) * 100)).toFixed(1));

  return {
    id: attemptId,
    testId,
    testTitle,
    candidateId,
    candidateName,
    startedAt,
    submittedAt,
    status: 'submitted',
    totalScore: finalTotalScore,
    totalMarks: 100,
    totalCorrect,
    totalWrong,
    totalSkipped,
    accuracyRate: overallAccuracyRate,
    estimatedPercentile,
    sectionScores,
    answers: processedAnswers
  };
}
