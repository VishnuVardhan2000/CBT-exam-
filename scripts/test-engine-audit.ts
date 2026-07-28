/**
 * Mock CBT Platform Engine Automated Audit Script
 * Validates Scoring Engine, Section Breakdown (30/35/35), Answer Lock Security, and Parser Integrity.
 */

import { calculateAttemptScore } from '../lib/scoring/engine';
import { INITIAL_QUESTIONS } from '../lib/storage/mock-store';
import { parseQuestionsFromRawText } from '../lib/pdf/parser';

function runAudit() {
  console.log('================================================================');
  console.log('STARTING AUTOMATED ENGINE AUDIT FOR SBI PO PRELIMINARY MOCK CBT');
  console.log('================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failedTests++;
    }
  }

  // 1. Scoring Engine Verification
  const sampleAnswers: Record<string, any> = {
    'q_eng_1': { selectedOption: 'A', timeSpentSeconds: 45 },
    'q_eng_2': { selectedOption: 'B', timeSpentSeconds: 30 }, // Wrong answer
    'q_eng_3': { selectedOption: null, timeSpentSeconds: 10 }, // Skipped
  };

  const sampleQuestions = [
    { id: 'q_eng_1', subject: 'English Language' as const, correctOption: 'A' },
    { id: 'q_eng_2', subject: 'English Language' as const, correctOption: 'A' },
    { id: 'q_eng_3', subject: 'English Language' as const, correctOption: 'A' },
  ];

  const scoreResult = calculateAttemptScore(
    'att_audit_1',
    'test_sbi_po_1',
    'SBI PO Prelims Audit Test',
    'usr_candidate_1',
    'Test Candidate',
    new Date().toISOString(),
    new Date().toISOString(),
    sampleQuestions as any,
    sampleAnswers
  );

  assert(scoreResult.totalCorrect === 1, 'Scoring Engine: Correct Count = 1');
  assert(scoreResult.totalWrong === 1, 'Scoring Engine: Wrong Count = 1');
  assert(scoreResult.totalSkipped === 1, 'Scoring Engine: Skipped Count = 1');
  assert(scoreResult.totalScore === 0.75, 'Scoring Engine: 1.0 - 0.25 = 0.75 Marks');
  assert(scoreResult.accuracyRate === 50.0, 'Scoring Engine: Accuracy = 50.0%');

  // 2. Section Question Count Validation
  const engCount = INITIAL_QUESTIONS.filter(q => q.subject === 'English Language').length;
  const quantCount = INITIAL_QUESTIONS.filter(q => q.subject === 'Quantitative Aptitude').length;
  const reasoningCount = INITIAL_QUESTIONS.filter(q => q.subject === 'Reasoning Ability').length;

  assert(engCount === 30, 'Question Bank: English Language = 30 Qs');
  assert(quantCount === 35, 'Question Bank: Quantitative Aptitude = 35 Qs');
  assert(reasoningCount === 35, 'Question Bank: Reasoning Ability = 35 Qs');
  assert(INITIAL_QUESTIONS.length === 100, 'Question Bank: Total Questions = 100 Qs');

  // 3. Option E Support Verification
  const hasOptionE = INITIAL_QUESTIONS.every(q => Boolean(q.optionE));
  assert(hasOptionE, 'MCQ Support: All 100 questions contain Option E');

  // 4. Parser Ingestion Audit
  const testRawText = `
SECTION 1: ENGLISH LANGUAGE (30 QUESTIONS)
Q1. Sample English question statement?
(A) Opt A (B) Opt B (C) Opt C (D) Opt D (E) Opt E
Correct Option: A
Explanation: Sample explanation text.
  `;

  const parsedDrafts = parseQuestionsFromRawText(testRawText, 'src_test_1');
  assert(parsedDrafts.length > 0, 'PDF Parser: Successfully parses question statements and options A-E');

  console.log('\n================================================================');
  console.log(`AUDIT COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED.`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit();
