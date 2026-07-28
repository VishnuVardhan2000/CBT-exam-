'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, CheckCircle2, Award, Clock, AlertCircle, Eye } from 'lucide-react';
import { getCandidatesList, getAttempts, getCandidateAnalytics } from '@/lib/repository';
import { UserProfile, AttemptResult } from '@/types';

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);

  useEffect(() => {
    loadCandidates();
    setAttempts(getAttempts());
  }, [searchTerm]);

  const loadCandidates = () => {
    let list = getCandidatesList();
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(c => c.fullName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term));
    }
    setCandidates(list);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Candidate Account & Performance Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search candidates, inspect individual test scorecards, monitor growth trends, and review attempt histories safely.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidate name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64"
          />
        </div>
      </div>

      {/* CANDIDATES DIRECTORY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Registered SBI PO Candidates ({candidates.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Target Year</th>
                <th className="py-3 px-4">Total Attempts</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">Overall Accuracy</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {candidates.map(c => {
                const analytics = getCandidateAnalytics(c.id);
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <Link href={`/admin/candidates/${c.id}`} className="font-bold text-white hover:text-blue-400 transition">
                        {c.fullName}
                      </Link>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {c.id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{c.email}</td>
                    <td className="py-3 px-4 font-bold text-slate-400">SBI PO {c.targetYear || 2026}</td>
                    <td className="py-3 px-4 font-bold text-blue-400">{analytics.totalTestsAttempted}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-400">{analytics.averageScore} / 100</td>
                    <td className="py-3 px-4 font-bold text-purple-400">{analytics.overallAccuracy}%</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/candidates/${c.id}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Profile</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
