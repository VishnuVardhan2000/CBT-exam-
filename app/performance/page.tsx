'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Award, Target, AlertTriangle, BookOpen, ChevronLeft } from 'lucide-react';
import { getCandidateAnalytics } from '@/lib/repository';
import { getActiveUser } from '@/lib/auth/store';
import { CandidateProgressSnapshot, SubjectName } from '@/types';

export default function CandidatePerformancePage() {
  const [analytics, setAnalytics] = useState<CandidateProgressSnapshot | null>(null);

  useEffect(() => {
    const user = getActiveUser();
    if (user) {
      setAnalytics(getCandidateAnalytics(user.id));
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Candidate Dashboard</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Performance & Growth Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your score progression, overall accuracy trends, and subject-wise accuracy across SBI PO Preliminary mock tests.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Mock Tests</span>
          <div className="text-3xl font-extrabold text-white">{analytics?.totalTestsAttempted || 0}</div>
          <span className="text-[11px] text-blue-400">Prelims Stage</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Score</span>
          <div className="text-3xl font-extrabold text-emerald-400">{analytics?.averageScore || '0.00'}</div>
          <span className="text-[11px] text-slate-400">Out of 100 Marks</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Highest Score</span>
          <div className="text-3xl font-extrabold text-purple-400">{analytics?.highestScore || '0.00'}</div>
          <span className="text-[11px] text-purple-400">Personal Best</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Overall Accuracy</span>
          <div className="text-3xl font-extrabold text-amber-400">{analytics?.overallAccuracy || 0}%</div>
          <span className="text-[11px] text-amber-400">Correct Ratio</span>
        </div>

      </div>

      {/* SUBJECT PERFORMANCE BREAKDOWN */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Subject-Wise Accuracy & Attempt Breakdown</span>
        </h2>

        {analytics?.subjectPerformance ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(analytics.subjectPerformance) as SubjectName[]).map(subj => {
              const data = analytics.subjectPerformance[subj];
              return (
                <div key={subj} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-xs">{subj}</h3>
                    <span className="text-xs font-extrabold text-emerald-400">{data.accuracy}% Acc</span>
                  </div>

                  {/* Accuracy Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                      <span>Accuracy Rate</span>
                      <span>{data.accuracy}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(5, data.accuracy))}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Correct Qs</span>
                      <div className="font-extrabold text-emerald-400">{data.totalCorrect}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Avg Score</span>
                      <div className="font-extrabold text-blue-400">{data.avgScore}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
            No attempt data logged yet. Complete your first mock test to view detailed growth analytics.
          </div>
        )}
      </div>

      {/* WEAK TOPIC FOCUS AREAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Priority Weakness Areas</span>
        </h2>

        {analytics?.weaknessAreas && analytics.weaknessAreas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {analytics.weaknessAreas.map((w, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">{w.subject}</span>
                <div className="font-bold text-white text-sm">{w.topic}</div>
                <div className="text-slate-400">Total Wrong Logged: <strong className="text-red-400">{w.wrongCount}</strong></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
            No weakness insights logged yet. Complete more mock tests to trigger deep weakness tracking.
          </div>
        )}
      </div>

    </div>
  );
}
