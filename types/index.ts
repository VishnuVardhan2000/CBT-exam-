export type UserRole = 'admin' | 'candidate';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  targetYear?: number;
  createdAt: string;
}

export type SubjectName = 'English Language' | 'Quantitative Aptitude' | 'Reasoning Ability';

export type SourceStatus = 'draft' | 'parsed' | 'under review' | 'reviewed' | 'verified' | 'published' | 'failed';

export interface QuestionSource {
  id: string;
  title: string;
  examName: string;
  stage: 'Preliminary' | 'Mains';
  fileName: string;
  fileUrl?: string;
  localFilePath?: string;
  uploadedBy: string;
  uploadTimestamp: string;
  parsedCount?: number;
  notes?: string;
  rawText?: string;
  status: SourceStatus;
}

export type QuestionVerificationStatus = 'draft' | 'needs review' | 'verified' | 'published';

export interface Question {
  id: string;
  sourceId?: string;
  subject: SubjectName;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctOption: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation?: string;
  isActive: boolean;
  verificationStatus?: QuestionVerificationStatus;
  createdAt: string;
}

export interface TestSectionConfig {
  id: string;
  subject: SubjectName;
  order: number;
  questionCount: number;
  marks: number;
  durationMinutes: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  stage: 'Preliminary';
  totalQuestions: number;
  totalMarks: number;
  totalDurationMinutes: number;
  negativeMarking: number; // 0.25
  isPublished: boolean;
  createdAt: string;
  sections: TestSectionConfig[];
  questions?: Question[];
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'expired';

export interface SubmittedAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  isCorrect?: boolean;
  isLocked: boolean;
  marksAwarded: number;
  timeSpentSeconds: number;
  answeredAt?: string;
}

export interface SectionScore {
  subject: SubjectName;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxMarks: number;
  accuracy: number;
}

export interface AttemptResult {
  id: string;
  testId: string;
  testTitle: string;
  candidateId: string;
  candidateName: string;
  startedAt: string;
  submittedAt?: string;
  status: AttemptStatus;
  totalScore: number;
  totalMarks: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  accuracyRate: number;
  estimatedPercentile: number;
  sectionScores: Record<SubjectName, SectionScore>;
  answers: Record<string, SubmittedAnswer>;
}

export interface CandidateProgressSnapshot {
  candidateId: string;
  totalTestsAttempted: number;
  averageScore: number;
  highestScore: number;
  overallAccuracy: number;
  subjectPerformance: Record<SubjectName, {
    totalAttempted: number;
    totalCorrect: number;
    accuracy: number;
    avgScore: number;
  }>;
  weaknessAreas: Array<{
    subject: SubjectName;
    topic: string;
    wrongCount: number;
    accuracy: number;
  }>;
  recentAttempts: Array<{
    attemptId: string;
    testTitle: string;
    date: string;
    score: number;
    accuracy: number;
  }>;
}
