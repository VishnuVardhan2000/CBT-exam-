'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, MinusCircle, Clock, BookOpen, ChevronLeft, ArrowRight, Lock } from 'lucide-react';
import { getAttemptById, getQuestions } from '@/lib/repository';
import { AttemptResult, Question, SubjectName } from '@/types';

export default function CandidateResultsPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<AttemptResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  useEffect(() => {
    if (attemptId) {
      const res = getAttemptById(attemptId);
      if (res) {
        setAttempt(res);
        setQuestions(getQuestions());
      }
    }
  }, [attemptId]);

  if (!attempt) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 max-w-md">
          <h2 className="text-base font-bold">Scorecard Loading...</h2>
          <p className="text-xs text-slate-400">Fetching attempt data from repository.</p>
          <Link href="/candidate/dashboard" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredQuestions = selectedSubjectFilter === 'All'
    ? questions
    : questions.filter(q => q.subject === selectedSubjectFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link href="/candidate/dashboard" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">{attempt.testTitle} Scorecard</h1>
          <p className="text-xs text-slate-400 mt-1">Submitted on {new Date(attempt.startedAt).toLocaleString()}</p>
        </div>

        <Link
          href="/candidate/progress"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg shadow-blue-600/20"
        >
          <span>View Overall Growth</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* OVERALL PERFORMANCE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Score</span>
          <div className="text-3xl font-extrabold text-blue-400">{attempt.totalScore}</div>
          <span className="text-[11px] text-slate-400">Out of 100 Marks</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Accuracy Rate</span>
          <div className="text-3xl font-extrabold text-emerald-400">{attempt.accuracyRate}%</div>
          <span className="text-[11px] text-emerald-400">Correct / Attempted</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Est. Percentile</span>
          <div className="text-3xl font-extrabold text-purple-400">{attempt.estimatedPercentile} %ile</div>
          <span className="text-[11px] text-purple-400">SBI PO Prelims Standard</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Correct / Wrong</span>
          <div className="text-2xl font-extrabold text-white">
            <span className="text-emerald-400">{attempt.totalCorrect}</span> / <span className="text-red-400">{attempt.totalWrong}</span>
          </div>
          <span className="text-[11px] text-red-400">Negative: -{(attempt.totalWrong * 0.25).toFixed(2)}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-slate-400">Skipped Qs</span>
          <div className="text-3xl font-extrabold text-amber-400">{attempt.totalSkipped}</div>
          <span className="text-[11px] text-amber-400">No penalty</span>
        </div>

      </div>

      {/* SUBJECT-WISE BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(attempt.sectionScores) as SubjectName[]).map(subj => {
          const sec = attempt.sectionScores[subj];
          return (
            <div key={subj} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">{subj}</h3>
                <span className="text-xs font-extrabold text-blue-400">{sec.score} / {sec.maxMarks}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">Correct</span>
                  <div className="font-extrabold text-white">{sec.correct}</div>
                </div>
                <div>
                  <span className="text-[10px] text-red-400 font-semibold uppercase">Wrong</span>
                  <div className="font-extrabold text-white">{sec.wrong}</div>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-semibold uppercase">Accuracy</span>
                  <div className="font-extrabold text-emerald-400">{sec.accuracy}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED QUESTION-BY-QUESTION SOLUTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Detailed Question Solutions & Explanations</span>
            </h2>
            <p className="text-xs text-slate-400">Review your confirmed choice vs correct answer for all 100 questions</p>
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={e => setSelectedSubjectFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3.5 py-2"
          >
            <option value="All">All 100 Questions</option>
            <option value="English Language">English Language (30 Qs)</option>
            <option value="Quantitative Aptitude">Quantitative Aptitude (35 Qs)</option>
            <option value="Reasoning Ability">Reasoning Ability (35 Qs)</option>
          </select>
        </div>

        <div className="space-y-6">
          {filteredQuestions.map(q => {
            const userAns = attempt.answers[q.id];
            const selected = userAns?.selectedOption || null;
            const isCorrect = userAns?.isCorrect || false;
            const isSkipped = !selected;

            return (
              <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-200 font-bold text-xs rounded-lg">
                      Q{q.questionNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{q.subject} • {q.topic}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isSkipped ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-1">
                        <MinusCircle className="w-3.5 h-3.5" />
                        <span>Skipped (0 Marks)</span>
                      </span>
                    ) : isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct (+1.0 Mark)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Wrong (-0.25 Mark)</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-100 text-sm font-medium whitespace-pre-line leading-relaxed">
                  {q.questionText}
                </p>

                {/* Options List with Color Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => {
                    const optionText = q[`option${opt}` as keyof Question];
                    const isUserChoice = selected === opt;
                    const isRightOption = q.correctOption === opt;

                    return (
                      <div
                        key={opt}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isRightOption
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                            : isUserChoice && !isCorrect
                            ? 'bg-red-950/40 border-red-500/60 text-red-200 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <span className="font-bold">{opt}:</span>
                          <span>{optionText}</span>
                        </div>

                        {isRightOption && <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">Correct Answer</span>}
                        {isUserChoice && !isRightOption && <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded">Your Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-blue-400 block">Solution Explanation:</span>
                    <p className="leading-relaxed text-slate-400">{q.explanation}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
