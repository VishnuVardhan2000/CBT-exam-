'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCandidateById, getCandidateAnalytics, getAttempts } from '@/lib/repository';
import { UserProfile, CandidateProgressSnapshot, AttemptResult } from '@/types';
import { User, ChevronLeft, Award, BookOpen, AlertTriangle, TrendingUp, Calendar, Mail } from 'lucide-react';

export default function AdminCandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<CandidateProgressSnapshot | null>(null);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);

  useEffect(() => {
    if (candidateId) {
      const c = getCandidateById(candidateId);
      if (c) {
        setCandidate(c);
        setAnalytics(getCandidateAnalytics(c.id));
        setAttempts(getAttempts().filter(a => a.candidateId === c.id));
      }
    }
  }, [candidateId]);

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Candidate Not Found</h2>
        <Link href="/admin/candidates" className="text-xs text-blue-400 hover:underline">
          Return to Candidate Management
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <Link href="/admin/candidates" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Candidates List</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xl">
            {candidate.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{candidate.fullName}</h1>
            <p className="text-xs text-slate-400 font-mono flex items-center space-x-3 mt-1">
              <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5" /><span>{candidate.email}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5" /><span>Target: SBI PO {candidate.targetYear || 2026}</span></span>
            </p>
          </div>
        </div>
      </div>

      {/* ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Attempts</span>
          <div className="text-3xl font-extrabold text-white">{analytics?.totalTestsAttempted || 0}</div>
          <span className="text-[11px] text-blue-400">SBI PO Prelims</span>
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
          <span className="text-xs font-semibold text-slate-400">Accuracy Rate</span>
          <div className="text-3xl font-extrabold text-amber-400">{analytics?.overallAccuracy || 0}%</div>
          <span className="text-[11px] text-amber-400">Correct Ratio</span>
        </div>

      </div>

      {/* WEAKNESS ANALYSIS */}
      {analytics && analytics.weaknessAreas.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Candidate Weakness Areas & Attention Needed</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {analytics.weaknessAreas.map((w, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">{w.subject}</span>
                <div className="font-bold text-white text-sm">{w.topic}</div>
                <div className="text-slate-400">Wrong Count: <strong className="text-red-400">{w.wrongCount}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEST ATTEMPTS HISTORY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Candidate Attempt Scorecards ({attempts.length})</span>
        </h2>

        {attempts.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
            No test attempts completed by this candidate yet.
          </div>
        ) : (
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
                {attempts.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white">{a.testTitle}</td>
                    <td className="py-3 px-4 font-extrabold text-blue-400">{a.totalScore} / 100</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{a.accuracyRate}%</td>
                    <td className="py-3 px-4 font-bold text-purple-400">{a.estimatedPercentile} %ile</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(a.startedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/candidate/results/${a.id}`}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-600/30"
                      >
                        Inspect Result
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
