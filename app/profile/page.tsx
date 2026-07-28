'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Mail, Calendar, Target, Award, BookOpen, ChevronLeft } from 'lucide-react';
import { getActiveUser } from '@/lib/auth/store';
import { getCandidateAnalytics } from '@/lib/repository';
import { CandidateProgressSnapshot } from '@/types';

export default function CandidateProfilePage() {
  const currentUser = getActiveUser();
  const [analytics, setAnalytics] = useState<CandidateProgressSnapshot | null>(null);

  useEffect(() => {
    setAnalytics(getCandidateAnalytics(currentUser.id));
  }, [currentUser.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Candidate Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your registration info, exam target, and cumulative score metrics.
        </p>
      </div>

      {/* PROFILE INFO CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500/40 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.fullName}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
              {currentUser.role} Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Examination</span>
            </span>
            <div className="font-bold text-white text-sm">SBI PO Preliminary {currentUser.targetYear || 2026}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Account Created</span>
            </span>
            <div className="font-bold text-white text-sm">{new Date(currentUser.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

      </div>

      {/* CUMULATIVE METRICS */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Tests Attempted</span>
          <div className="text-3xl font-extrabold text-white mt-1">{analytics?.totalTestsAttempted || 0}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Best Score</span>
          <div className="text-3xl font-extrabold text-purple-400 mt-1">{analytics?.highestScore || '0.00'}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Accuracy</span>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{analytics?.overallAccuracy || 0}%</div>
        </div>
      </div>

    </div>
  );
}
