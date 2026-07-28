'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Award, Clock, CheckCircle2, TrendingUp, ArrowRight, User, AlertTriangle, Target, BookOpen } from 'lucide-react';
import { getTests, getAttempts, getCandidateAnalytics } from '@/lib/repository';
import { getActiveUser } from '@/lib/auth/store';
import { Test, AttemptResult, CandidateProgressSnapshot } from '@/types';

export default function CandidateDashboardPage() {
  const currentUser = getActiveUser();
  const [tests, setTests] = useState<Test[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<AttemptResult[]>([]);
  const [analytics, setAnalytics] = useState<CandidateProgressSnapshot | null>(null);

  useEffect(() => {
    const allTests = getTests().filter(t => t.isPublished);
    const userAttempts = getAttempts().filter(a => a.candidateId === currentUser.id);
    const progress = getCandidateAnalytics(currentUser.id);

    setTests(allTests);
    setRecentAttempts(userAttempts);
    setAnalytics(progress);
  }, [currentUser.id]);

  const latestAttempt = recentAttempts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>Target: SBI PO Preliminary {currentUser.targetYear || 2026}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, {currentUser.fullName}!</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Practice 100-question Preliminary mock tests under strict 20-minute sectional timing and single-confirmation answer locks.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/tests"
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Explore Mock Tests</span>
          </Link>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Attempts</span>
          <div className="text-3xl font-extrabold text-white">{analytics?.totalTestsAttempted || 0}</div>
          <span className="text-[11px] text-blue-400">SBI PO Prelims Standard</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Latest Score</span>
          <div className="text-3xl font-extrabold text-blue-400">
            {latestAttempt ? `${latestAttempt.totalScore}` : '0.00'}
          </div>
          <span className="text-[11px] text-slate-400">Out of 100 Marks</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Best Score</span>
          <div className="text-3xl font-extrabold text-purple-400">{analytics?.highestScore || '0.00'}</div>
          <span className="text-[11px] text-purple-400">Personal Best</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Accuracy</span>
          <div className="text-3xl font-extrabold text-amber-400">{analytics?.overallAccuracy || 0}%</div>
          <span className="text-[11px] text-amber-400">Correct vs Attempted</span>
        </div>

      </div>

      {/* AVAILABLE TESTS & WEAK SUBJECT SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Available Tests */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Play className="w-4 h-4 text-blue-400 fill-current" />
              <span>Available Mock Tests</span>
            </h2>
            <Link href="/tests" className="text-xs text-blue-400 hover:underline">View Catalog</Link>
          </div>

          <div className="space-y-4">
            {tests.map(test => (
              <div key={test.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                      {test.stage} Test
                    </span>
                    <span className="text-[11px] text-slate-400">100 Qs | 60 Mins | -0.25</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{test.title}</h3>
                </div>

                <Link
                  href={`/tests/${test.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <span>Start CBT Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Subject Indicator Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Weakness & Attention Areas</span>
          </h2>

          {analytics?.weaknessAreas && analytics.weaknessAreas.length > 0 ? (
            <div className="space-y-3">
              {analytics.weaknessAreas.map((w, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>{w.subject}</span>
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold">Needs Focus</span>
                  </div>
                  <div className="font-bold text-white">{w.topic}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
              No weakness indicators logged yet. Complete more mock tests to trigger deep weakness tracking.
            </div>
          )}
        </div>

      </div>

      {/* RECENT RESULTS TABLE */}
      {recentAttempts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Recent Exam Scorecards</span>
            </h2>
            <Link href="/results" className="text-xs text-blue-400 hover:underline">View History</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Percentile</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentAttempts.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white">{a.testTitle}</td>
                    <td className="py-3 px-4 font-extrabold text-blue-400">{a.totalScore} / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{a.accuracyRate}%</td>
                    <td className="py-3 px-4 font-bold text-purple-400">{a.estimatedPercentile} %ile</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(a.startedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/results/${a.id}`}
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                      >
                        <span>Scorecard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
