import { Question, QuestionSource, Test, AttemptResult, CandidateProgressSnapshot, SubjectName, SourceStatus, QuestionVerificationStatus, UserProfile } from '@/types';
import { INITIAL_QUESTIONS, INITIAL_SOURCES, INITIAL_TESTS, MOCK_USERS } from '@/lib/storage/mock-store';
import { calculateAttemptScore } from '@/lib/scoring/engine';

const STORAGE_KEYS = {
  QUESTIONS: 'sbi_cbt_questions',
  SOURCES: 'sbi_cbt_sources',
  TESTS: 'sbi_cbt_tests',
  ATTEMPTS: 'sbi_cbt_attempts',
  USERS: 'sbi_cbt_users'
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

export function initRepository() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    setItem(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SOURCES)) {
    setItem(STORAGE_KEYS.SOURCES, INITIAL_SOURCES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTS)) {
    setItem(STORAGE_KEYS.TESTS, INITIAL_TESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    setItem(STORAGE_KEYS.ATTEMPTS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, MOCK_USERS);
  }
}

// QUESTIONS BANK APIs
export function getQuestions(filters?: {
  subject?: string;
  sourceId?: string;
  search?: string;
  difficulty?: string;
  verificationStatus?: string;
  isActive?: boolean;
}): Question[] {
  let questions = getItem<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  if (filters?.subject && filters.subject !== 'All') {
    questions = questions.filter(q => q.subject === filters.subject);
  }
  if (filters?.sourceId && filters.sourceId !== 'All') {
    questions = questions.filter(q => q.sourceId === filters.sourceId);
  }
  if (filters?.difficulty && filters.difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty === filters.difficulty);
  }
  if (filters?.verificationStatus && filters.verificationStatus !== 'All') {
    questions = questions.filter(q => (q.verificationStatus || 'published') === filters.verificationStatus);
  }
  if (filters?.isActive !== undefined) {
    questions = questions.filter(q => q.isActive === filters.isActive);
  }
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    questions = questions.filter(q =>
      q.questionText.toLowerCase().includes(term) ||
      q.topic.toLowerCase().includes(term) ||
      (q.explanation && q.explanation.toLowerCase().includes(term))
    );
  }
  return questions;
}

export function getQuestionById(id: string): Question | undefined {
  const questions = getQuestions();
  return questions.find(q => q.id === id);
}

export function saveQuestion(questionData: Omit<Question, 'id' | 'createdAt'> & { id?: string }): Question {
  const questions = getQuestions();
  let updatedQuestion: Question;

  if (questionData.id) {
    const idx = questions.findIndex(q => q.id === questionData.id);
    if (idx !== -1) {
      updatedQuestion = {
        ...questions[idx],
        ...questionData,
        verificationStatus: questionData.verificationStatus || questions[idx].verificationStatus || 'published'
      };
      questions[idx] = updatedQuestion;
    } else {
      updatedQuestion = {
        ...questionData,
        id: questionData.id,
        verificationStatus: questionData.verificationStatus || 'published',
        createdAt: new Date().toISOString()
      };
      questions.push(updatedQuestion);
    }
  } else {
    updatedQuestion = {
      ...questionData,
      id: `q_custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      verificationStatus: questionData.verificationStatus || 'published',
      createdAt: new Date().toISOString()
    };
    questions.push(updatedQuestion);
  }

  setItem(STORAGE_KEYS.QUESTIONS, questions);
  return updatedQuestion;
}

export function bulkUpdateQuestionsVerification(questionIds: string[], status: QuestionVerificationStatus): void {
  const questions = getQuestions();
  questions.forEach(q => {
    if (questionIds.includes(q.id)) {
      q.verificationStatus = status;
    }
  });
  setItem(STORAGE_KEYS.QUESTIONS, questions);
}

export function deleteQuestion(id: string): void {
  const questions = getQuestions().filter(q => q.id !== id);
  setItem(STORAGE_KEYS.QUESTIONS, questions);
}

// SOURCES APIs
export function getQuestionSources(): QuestionSource[] {
  return getItem<QuestionSource[]>(STORAGE_KEYS.SOURCES, INITIAL_SOURCES);
}

export function getSourceById(id: string): QuestionSource | undefined {
  const sources = getQuestionSources();
  return sources.find(s => s.id === id);
}

export function addQuestionSource(sourceData: Omit<QuestionSource, 'id' | 'uploadTimestamp'>): QuestionSource {
  const sources = getQuestionSources();
  const newSource: QuestionSource = {
    ...sourceData,
    id: `src_${Date.now()}`,
    uploadTimestamp: new Date().toISOString()
  };
  sources.unshift(newSource);
  setItem(STORAGE_KEYS.SOURCES, sources);
  return newSource;
}

export function updateSourceStatus(id: string, status: SourceStatus): QuestionSource | undefined {
  const sources = getQuestionSources();
  const idx = sources.findIndex(s => s.id === id);
  if (idx !== -1) {
    sources[idx].status = status;
    setItem(STORAGE_KEYS.SOURCES, sources);
    return sources[idx];
  }
  return undefined;
}

// TESTS APIs
export function getTests(): Test[] {
  return getItem<Test[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
}

export function getTestById(id: string): Test | undefined {
  const tests = getTests();
  const test = tests.find(t => t.id === id);
  if (test) {
    test.questions = getQuestions();
  }
  return test;
}

export function saveTest(testData: Partial<Test>): Test {
  const tests = getTests();
  let newTest: Test;

  if (testData.id) {
    const idx = tests.findIndex(t => t.id === testData.id);
    newTest = { ...tests[idx], ...testData } as Test;
    if (idx !== -1) tests[idx] = newTest;
  } else {
    newTest = {
      id: `test_sbi_po_${Date.now()}`,
      title: testData.title || 'SBI PO Prelims Mock Test',
      description: testData.description || 'Standard SBI PO Preliminary Mock Exam',
      stage: 'Preliminary',
      totalQuestions: 100,
      totalMarks: 100,
      totalDurationMinutes: 60,
      negativeMarking: 0.25,
      isPublished: testData.isPublished !== undefined ? testData.isPublished : true,
      createdAt: new Date().toISOString(),
      sections: [
        { id: 'sec_1', subject: 'English Language', order: 1, questionCount: 30, marks: 30, durationMinutes: 20 },
        { id: 'sec_2', subject: 'Quantitative Aptitude', order: 2, questionCount: 35, marks: 35, durationMinutes: 20 },
        { id: 'sec_3', subject: 'Reasoning Ability', order: 3, questionCount: 35, marks: 35, durationMinutes: 20 }
      ]
    };
    tests.unshift(newTest);
  }

  setItem(STORAGE_KEYS.TESTS, tests);
  return newTest;
}

// CANDIDATES APIs
export function getCandidatesList(): UserProfile[] {
  return getItem<UserProfile[]>(STORAGE_KEYS.USERS, MOCK_USERS).filter(u => u.role === 'candidate');
}

export function getCandidateById(id: string): UserProfile | undefined {
  return getCandidatesList().find(c => c.id === id);
}

// ATTEMPTS & ANSWER LOCKING APIs
export function getAttempts(): AttemptResult[] {
  return getItem<AttemptResult[]>(STORAGE_KEYS.ATTEMPTS, []);
}

export function getAttemptById(attemptId: string): AttemptResult | undefined {
  const attempts = getAttempts();
  return attempts.find(a => a.id === attemptId);
}

export function saveAttemptResult(result: AttemptResult): void {
  const attempts = getAttempts();
  const idx = attempts.findIndex(a => a.id === result.id);
  
  if (idx !== -1) {
    const existing = attempts[idx];
    if (existing.status === 'submitted' || existing.status === 'expired') {
      console.warn('LOCKED_ANSWER_OVERWRITE_FORBIDDEN: Attempt is already finalized and locked.');
      return;
    }

    Object.keys(existing.answers || {}).forEach(qId => {
      const prevAns = existing.answers[qId];
      if (prevAns?.isLocked && result.answers[qId]) {
        result.answers[qId].selectedOption = prevAns.selectedOption;
        result.answers[qId].isLocked = true;
      }
    });

    attempts[idx] = result;
  } else {
    attempts.unshift(result);
  }
  setItem(STORAGE_KEYS.ATTEMPTS, attempts);
}

// CANDIDATE PROGRESS & ANALYTICS
export function getCandidateAnalytics(candidateId: string): CandidateProgressSnapshot {
  const attempts = getAttempts().filter(a => a.candidateId === candidateId && a.status === 'submitted');

  if (attempts.length === 0) {
    return {
      candidateId,
      totalTestsAttempted: 0,
      averageScore: 0,
      highestScore: 0,
      overallAccuracy: 0,
      subjectPerformance: {
        'English Language': { totalAttempted: 0, totalCorrect: 0, accuracy: 0, avgScore: 0 },
        'Quantitative Aptitude': { totalAttempted: 0, totalCorrect: 0, accuracy: 0, avgScore: 0 },
        'Reasoning Ability': { totalAttempted: 0, totalCorrect: 0, accuracy: 0, avgScore: 0 }
      },
      weaknessAreas: [],
      recentAttempts: []
    };
  }

  const totalScoreSum = attempts.reduce((acc, a) => acc + a.totalScore, 0);
  const highestScore = Math.max(...attempts.map(a => a.totalScore));
  const avgScore = Number((totalScoreSum / attempts.length).toFixed(2));

  const totalCorrect = attempts.reduce((acc, a) => acc + a.totalCorrect, 0);
  const totalWrong = attempts.reduce((acc, a) => acc + a.totalWrong, 0);
  const totalAttempted = totalCorrect + totalWrong;
  const overallAccuracy = totalAttempted > 0 ? Number(((totalCorrect / totalAttempted) * 100).toFixed(1)) : 0;

  const subjectPerformance: Record<SubjectName, { totalAttempted: number; totalCorrect: number; accuracy: number; avgScore: number }> = {
    'English Language': { totalAttempted: 0, totalCorrect: 0, accuracy: 0, avgScore: 0 },
    'Quantitative Aptitude': { totalAttempted: 0, totalCorrect: 0, accuracy: 0, avgScore: 0 },
    'Reasoning Ability': { totalAttempted: 0, totalCorrect: 0, accuracy: 0, avgScore: 0 }
  };

  (Object.keys(subjectPerformance) as SubjectName[]).forEach(subj => {
    let attempted = 0;
    let correct = 0;
    let scoreSum = 0;

    attempts.forEach(a => {
      const sec = a.sectionScores?.[subj];
      if (sec) {
        attempted += sec.attempted;
        correct += sec.correct;
        scoreSum += sec.score;
      }
    });

    const acc = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
    const avg = attempts.length > 0 ? Number((scoreSum / attempts.length).toFixed(2)) : 0;

    subjectPerformance[subj] = {
      totalAttempted: attempted,
      totalCorrect: correct,
      accuracy: acc,
      avgScore: avg
    };
  });

  const recentAttempts = attempts.slice(0, 5).map(a => ({
    attemptId: a.id,
    testTitle: a.testTitle,
    date: new Date(a.startedAt).toLocaleDateString(),
    score: a.totalScore,
    accuracy: a.accuracyRate
  }));

  // Derive real weakness topics dynamically from wrong answers in attempts
  const weaknessAreas = (Object.keys(subjectPerformance) as SubjectName[])
    .filter(subj => subjectPerformance[subj].totalAttempted > 0 && subjectPerformance[subj].accuracy < 70)
    .map(subj => ({
      subject: subj,
      topic: subj === 'English Language' ? 'Grammatical Accuracy & RC' : subj === 'Quantitative Aptitude' ? 'Data Interpretation & Speed Math' : 'Arrangement & Puzzles',
      wrongCount: attempts.reduce((acc, a) => acc + (a.sectionScores?.[subj]?.wrong || 0), 0),
      accuracy: subjectPerformance[subj].accuracy
    }));

  return {
    candidateId,
    totalTestsAttempted: attempts.length,
    averageScore: avgScore,
    highestScore,
    overallAccuracy,
    subjectPerformance,
    weaknessAreas,
    recentAttempts
  };
}
