'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTestById } from '@/lib/repository';
import { Test } from '@/types';
import { Clock, ShieldAlert, CheckSquare, Play, ChevronLeft, AlertTriangle, Lock } from 'lucide-react';

export default function TestInstructionPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [test, setTest] = useState<Test | null>(null);
  const [agreed, setAgreed] = useState<boolean>(false);

  useEffect(() => {
    if (testId) {
      const found = getTestById(testId);
      if (found) setTest(found);
    }
  }, [testId]);

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Test Not Found</h2>
        <Link href="/tests" className="text-xs text-blue-400 hover:underline">
          Return to Mock Tests Catalog
        </Link>
      </div>
    );
  }

  const handleStartExam = () => {
    if (!agreed) return;
    router.push(`/attempts/${test.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <div>
        <Link href="/tests" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Test Catalog</span>
        </Link>
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
            {test.stage} Exam
          </span>
          <span className="text-xs text-slate-400">Official CBT Test Instructions</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">{test.title}</h1>
      </div>

      {/* EXAM OVERVIEW SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Questions</span>
          <div className="text-2xl font-extrabold text-white mt-1">100 MCQs</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Duration</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">60 Minutes</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Marks</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">100 Marks</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Negative Marking</span>
          <div className="text-2xl font-extrabold text-red-400 mt-1">-0.25 Marks</div>
        </div>
      </div>

      {/* DETAILED INSTRUCTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl text-slate-300 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-blue-400" />
          <span>SBI PO Preliminary Examination Rules</span>
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm mb-1">1. Enforced Sectional Timing</h3>
            <p>
              The exam is divided into 3 mandatory sections. Each section has a strict **20-minute timer**. When the section timer expires, the test automatically transitions to the next section. You cannot return to previous sections once expired.
            </p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-semibold text-slate-200">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">1. English Language: 30 Qs (20 Mins)</div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">2. Quantitative Aptitude: 35 Qs (20 Mins)</div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">3. Reasoning Ability: 35 Qs (20 Mins)</div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-emerald-400 text-sm mb-1 flex items-center space-x-1.5">
              <Lock className="w-4 h-4" />
              <span>2. Lock-Once Answer Rule (Crucial)</span>
            </h3>
            <p className="text-slate-300">
              Once you select an option and click <strong className="text-white">"Confirm & Lock Answer"</strong>, your selection is permanently saved and locked. **Locked answers cannot be edited or changed later**. Unanswered questions can be skipped.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm mb-1">3. Marking Scheme</h3>
            <p>
              Each correct answer awards <strong className="text-emerald-400">+1.0 mark</strong>. Each incorrect answer incurs a penalty of <strong className="text-red-400">-0.25 marks</strong>. Skipped questions incur zero penalty.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm mb-1">4. Submission & Auto-Submit</h3>
            <p>
              When the total 60-minute duration expires, the exam will auto-submit automatically. You can also manually submit at the end of the 3rd section.
            </p>
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="pt-4 border-t border-slate-800">
          <label className="flex items-start space-x-3 cursor-pointer bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-200 font-medium">
              I have read and understood all the instructions above regarding sectional 20-minute timers, single-confirmation answer locks, and negative marking rules for the SBI PO Preliminary exam.
            </span>
          </label>
        </div>

        {/* Start Button */}
        <div className="pt-2 flex justify-end">
          <button
            disabled={!agreed}
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl transition shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>I am Ready to Begin CBT Exam</span>
          </button>
        </div>

      </div>

    </div>
  );
}
