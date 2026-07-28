'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Test, Question, SubjectName, AttemptResult } from '@/types';
import { getActiveUser } from '@/lib/auth/store';
import { calculateAttemptScore } from '@/lib/scoring/engine';
import { saveAttemptResult } from '@/lib/repository';
import {
  Clock, Lock, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft,
  Grid, Send, HelpCircle, ShieldAlert, Award
} from 'lucide-react';

interface CbtExamEngineProps {
  test: Test;
}

export default function CbtExamEngine({ test }: CbtExamEngineProps) {
  const router = useRouter();
  const currentUser = getActiveUser();

  // Active section state (1: English, 2: Quant, 3: Reasoning)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  
  // Active question index within all 100 questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // User selections & locks: { [questionId]: { selectedOption, isLocked, timeSpentSeconds } }
  const [userAnswers, setUserAnswers] = useState<
    Record<string, { selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null; isLocked: boolean; timeSpentSeconds: number }>
  >({});

  // Pending selection before locking
  const [draftSelection, setDraftSelection] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);

  // Timers: Section timer (20 mins = 1200 sec) and Total timer (60 mins = 3600 sec)
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<number>(20 * 60);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState<number>(60 * 60);

  // Confirm Submit Modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  
  // Mobile palette drawer open toggle
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);

  const attemptIdRef = useRef<string>(`attempt_${Date.now()}`);
  const startedAtRef = useRef<string>(new Date().toISOString());

  const questions = test.questions || [];
  const currentSection = test.sections[activeSectionIndex];

  // Filter questions by active section
  const sectionQuestions = questions.filter(q => q.subject === currentSection?.subject);
  const currentQuestion = questions[currentQuestionIndex];

  // Sync draft selection with existing locked or saved state when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existing = userAnswers[currentQuestion.id];
      setDraftSelection(existing?.selectedOption || null);
    }
  }, [currentQuestionIndex, currentQuestion, userAnswers]);

  // Timers countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit('expired');
          return 0;
        }
        return prev - 1;
      });

      setSectionTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto switch section when section timer ends
          if (activeSectionIndex < test.sections.length - 1) {
            handleNextSection();
            return 20 * 60; // Reset for next section
          } else {
            handleFinalSubmit('expired');
            return 0;
          }
        }
        return prev - 1;
      });

      // Track time spent per current question
      if (currentQuestion) {
        setUserAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: {
            selectedOption: prev[currentQuestion.id]?.selectedOption || null,
            isLocked: prev[currentQuestion.id]?.isLocked || false,
            timeSpentSeconds: (prev[currentQuestion.id]?.timeSpentSeconds || 0) + 1
          }
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSectionIndex, currentQuestionIndex]);

  // Lock answer handler (CRITICAL CBT REQUIREMENT: CANNOT BE EDITED ONCE LOCKED)
  const handleLockAnswer = () => {
    if (!currentQuestion || !draftSelection) return;

    const existing = userAnswers[currentQuestion.id];
    if (existing?.isLocked) return; // Prevent unlocking

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOption: draftSelection,
        isLocked: true, // PERMANENTLY LOCKED
        timeSpentSeconds: prev[currentQuestion.id]?.timeSpentSeconds || 1
      }
    }));

    // Auto move to next question in section if available
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < questions.length && questions[nextIdx].subject === currentSection.subject) {
      setCurrentQuestionIndex(nextIdx);
    }
  };

  // Skip / Next Question
  const handleSkipOrNext = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < questions.length && questions[nextIdx].subject === currentSection.subject) {
      setCurrentQuestionIndex(nextIdx);
    }
  };

  // Previous Question
  const handlePrevQuestion = () => {
    const prevIdx = currentQuestionIndex - 1;
    if (prevIdx >= 0 && questions[prevIdx].subject === currentSection.subject) {
      setCurrentQuestionIndex(prevIdx);
    }
  };

  // Next Section handler
  const handleNextSection = () => {
    if (activeSectionIndex < test.sections.length - 1) {
      const nextSecIdx = activeSectionIndex + 1;
      setActiveSectionIndex(nextSecIdx);
      setSectionTimeRemaining(test.sections[nextSecIdx].durationMinutes * 60);

      // Find first question of next section
      const firstQOfNextSec = questions.findIndex(q => q.subject === test.sections[nextSecIdx].subject);
      if (firstQOfNextSec !== -1) {
        setCurrentQuestionIndex(firstQOfNextSec);
      }
    }
  };

  // Submit test handler
  const handleFinalSubmit = (status: 'submitted' | 'expired' = 'submitted') => {
    const result = calculateAttemptScore(
      attemptIdRef.current,
      test.id,
      test.title,
      currentUser.id,
      currentUser.fullName,
      startedAtRef.current,
      new Date().toISOString(),
      questions,
      userAnswers
    );

    saveAttemptResult(result);
    router.push(`/candidate/results/${result.id}`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCurrentQuestionLocked = userAnswers[currentQuestion?.id]?.isLocked || false;

  // Counts for Section Progress
  const sectionAnsweredLockedCount = sectionQuestions.filter(q => userAnswers[q.id]?.isLocked && userAnswers[q.id]?.selectedOption).length;
  const sectionSkippedCount = sectionQuestions.length - sectionAnsweredLockedCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. TOP TIMER & CBT HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">{test.title}</h1>
              <p className="text-[11px] text-slate-400">SBI PO Preliminary Stage | Enforced 60-Min CBT</p>
            </div>
          </div>

          {/* Timers Bar */}
          <div className="flex items-center space-x-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            {/* Section Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Section Time</span>
                <span className={`font-mono text-sm font-bold ${sectionTimeRemaining < 180 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
                  {formatTime(sectionTimeRemaining)}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800"></div>

            {/* Total Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Overall Time</span>
                <span className={`font-mono text-sm font-bold ${totalTimeRemaining < 300 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                  {formatTime(totalTimeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* 2. SECTION SELECTION TABS */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-2">
            {test.sections.map((sec, idx) => {
              const isActive = idx === activeSectionIndex;
              return (
                <button
                  key={sec.id}
                  disabled={!isActive && idx !== activeSectionIndex + 1} // Enforce sequential section flow or active
                  onClick={() => {
                    if (idx === activeSectionIndex) return;
                    setActiveSectionIndex(idx);
                    const firstQ = questions.findIndex(q => q.subject === sec.subject);
                    if (firstQ !== -1) setCurrentQuestionIndex(firstQ);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border ${
                    isActive
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Section {sec.order}: {sec.subject}</span>
                  <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded-full text-slate-300">
                    {sec.questionCount} Qs
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question Palette Toggle (Mobile) */}
          <button
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="md:hidden px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>Palette</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN EXAM PANEL */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* QUESTION DISPLAY CONTAINER (3 Cols) */}
        <div className="md:col-span-3 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          
          {/* Question Header & Lock Status */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 font-extrabold text-sm rounded-lg border border-blue-500/30">
                Question {currentQuestion?.questionNumber || (currentQuestionIndex + 1)} of 100
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Topic: <strong className="text-slate-200">{currentQuestion?.topic}</strong>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {currentQuestion?.difficulty}
              </span>
            </div>

            {/* Lock Status Banner */}
            {isCurrentQuestionLocked ? (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                <Lock className="w-3.5 h-3.5" />
                <span>Answer Confirmed & Locked</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Choice Unlocked</span>
              </div>
            )}
          </div>

          {/* Question Text */}
          <div className="flex-1 mb-6 overflow-y-auto">
            <p className="text-slate-100 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium">
              {currentQuestion?.questionText}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-8">
            {(['A', 'B', 'C', 'D', 'E'] as const).map(optionKey => {
              const optionText = currentQuestion ? currentQuestion[`option${optionKey}` as keyof Question] : '';
              const isSelected = draftSelection === optionKey;
              
              return (
                <button
                  key={optionKey}
                  disabled={isCurrentQuestionLocked} // Lock-once rule: disabled if locked
                  onClick={() => setDraftSelection(optionKey)}
                  className={`w-full text-left p-4 rounded-xl text-sm font-medium transition flex items-center justify-between border ${
                    isSelected
                      ? isCurrentQuestionLocked
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md'
                        : 'bg-blue-900/40 border-blue-500 text-blue-100 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  } ${isCurrentQuestionLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start space-x-3.5">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isSelected
                        ? isCurrentQuestionLocked ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {optionKey}
                    </span>
                    <span className="pt-0.5 leading-snug">{optionText}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${isCurrentQuestionLocked ? 'text-emerald-400' : 'text-blue-400'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Bar (Lock Answer, Skip, Clear, Prev/Next) */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center space-x-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevQuestion}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                disabled={isCurrentQuestionLocked || !draftSelection}
                onClick={() => setDraftSelection(null)}
                className="px-3 py-2 bg-slate-800/60 hover:bg-slate-800 disabled:opacity-30 text-slate-400 text-xs font-medium rounded-xl transition"
              >
                Clear Choice
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkipOrNext}
                className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition"
              >
                Skip / Next Question
              </button>

              <button
                disabled={isCurrentQuestionLocked || !draftSelection}
                onClick={handleLockAnswer}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm & Lock Answer</span>
              </button>
            </div>

          </div>

        </div>

        {/* QUESTION PALETTE SIDEBAR (1 Col) */}
        <div className={`md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col ${paletteOpen ? 'block' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Grid className="w-4 h-4 text-blue-400" />
              <span>Question Palette</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {sectionAnsweredLockedCount} / {sectionQuestions.length} Locked
            </span>
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-semibold text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
              <span>Answered & Locked</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-600"></span>
              <span>Skipped</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-blue-600"></span>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700"></span>
              <span>Unvisited</span>
            </div>
          </div>

          {/* Grid of Question Buttons */}
          <div className="flex-1 overflow-y-auto max-h-[420px] grid grid-cols-5 gap-2 pr-1">
            {sectionQuestions.map((q, idx) => {
              const globalIdx = questions.findIndex(gq => gq.id === q.id);
              const ansState = userAnswers[q.id];
              const isCurrent = globalIdx === currentQuestionIndex;
              const isLocked = ansState?.isLocked && ansState?.selectedOption;
              const isSkipped = !isLocked && ansState?.timeSpentSeconds > 0;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(globalIdx)}
                  className={`w-full aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition border ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/50'
                      : isLocked
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                      : isSkipped
                      ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>

          {/* Next Section Shortcut */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            {activeSectionIndex < test.sections.length - 1 ? (
              <button
                onClick={handleNextSection}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <span>Proceed to Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <span>Submit Final Exam</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 4. CONFIRM SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center space-x-3 text-emerald-400">
              <ShieldAlert className="w-7 h-7" />
              <h2 className="text-lg font-bold text-white">Confirm Test Submission</h2>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Are you sure you want to submit your SBI PO Preliminary Mock Test? Once submitted, your scores will be auto-calculated and answers permanently recorded.
            </p>

            {/* Answer Summary Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span className="font-bold text-white">{questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Answered & Locked:</span>
                <span className="font-bold">{Object.values(userAnswers).filter(a => a.isLocked && a.selectedOption).length}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Skipped / Unanswered:</span>
                <span className="font-bold">{questions.length - Object.values(userAnswers).filter(a => a.isLocked && a.selectedOption).length}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Continue Exam
              </button>
              <button
                onClick={() => handleFinalSubmit('submitted')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
              >
                Submit Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
