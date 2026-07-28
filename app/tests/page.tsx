'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Clock, CheckCircle2, Award, ArrowRight, ShieldAlert } from 'lucide-react';
import { getTests, getAttempts } from '@/lib/repository';
import { getActiveUser } from '@/lib/auth/store';
import { Test, AttemptResult } from '@/types';

export default function TestsCatalogPage() {
  const currentUser = getActiveUser();
  const [tests, setTests] = useState<Test[]>([]);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);

  useEffect(() => {
    setTests(getTests().filter(t => t.isPublished));
    setAttempts(getAttempts().filter(a => a.candidateId === currentUser.id));
  }, [currentUser.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">SBI PO Preliminary Published Mock Tests</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select an available mock test to view exam instructions and launch the 100-question CBT engine with 20-min sectional timers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => {
          const attempt = attempts.find(a => a.testId === test.id);

          return (
            <div key={test.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl hover:border-slate-700 transition">
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                  {test.stage} Mock Test
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{test.totalDurationMinutes} Mins Total</span>
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-white">{test.title}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{test.description}</p>
              </div>

              {/* Rules Cards */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Questions</span>
                  <div className="font-extrabold text-white">{test.totalQuestions} Qs</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Total Marks</span>
                  <div className="font-extrabold text-emerald-400">{test.totalMarks} Marks</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Negative Mark</span>
                  <div className="font-extrabold text-red-400">-{test.negativeMarking}</div>
                </div>
              </div>

              {/* Section breakdown */}
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between items-center bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>English Language</span>
                  <span className="font-bold text-blue-400">30 Qs (20 mins)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>Quantitative Aptitude</span>
                  <span className="font-bold text-purple-400">35 Qs (20 mins)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>Reasoning Ability</span>
                  <span className="font-bold text-emerald-400">35 Qs (20 mins)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                {attempt ? (
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Attempted ({attempt.totalScore} Marks)</span>
                    </span>
                    <Link
                      href={`/results/${attempt.id}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center space-x-1 ml-auto"
                    >
                      <span>View Scorecard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/tests/${test.id}`}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>View Instructions & Start Test</span>
                  </Link>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
