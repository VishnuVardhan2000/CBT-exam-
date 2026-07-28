'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Clock, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { getAttempts } from '@/lib/repository';
import { getActiveUser } from '@/lib/auth/store';
import { AttemptResult } from '@/types';

export default function ResultsHistoryPage() {
  const currentUser = getActiveUser();
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);

  useEffect(() => {
    const userAttempts = getAttempts().filter(a => a.candidateId === currentUser.id);
    setAttempts(userAttempts);
  }, [currentUser.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Exam Results & Scorecard History</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all your completed SBI PO Preliminary mock test attempts, total scores, percentile estimates, and question-by-question solution explanations.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Completed Test Scorecards ({attempts.length})</span>
        </h2>

        {attempts.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <p>You have not completed any mock test attempts yet.</p>
            <Link href="/tests" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl inline-block">
              Start Your First Mock Test
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4">Total Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Percentile</th>
                  <th className="py-3 px-4">Correct / Wrong</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attempts.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white max-w-xs truncate">{a.testTitle}</td>
                    <td className="py-3 px-4 font-extrabold text-blue-400 text-sm">{a.totalScore} / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{a.accuracyRate}%</td>
                    <td className="py-3 px-4 font-bold text-purple-400">{a.estimatedPercentile} %ile</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <span className="text-emerald-400">{a.totalCorrect}</span> / <span className="text-red-400">{a.totalWrong}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(a.startedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/results/${a.id}`}
                        className="px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                      >
                        <span>Detailed Scorecard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
