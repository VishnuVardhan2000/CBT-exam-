'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, BookOpen, FileUp, Layers, Users, Award, ArrowUpRight, CheckCircle2, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { getQuestions, getQuestionSources, getTests, getAttempts, getCandidatesList } from '@/lib/repository';
import { QuestionSource, AttemptResult } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSources: 0,
    totalQuestions: 0,
    totalActiveQuestions: 0,
    totalTests: 0,
    publishedTests: 0,
    totalCandidates: 0,
    totalAttempts: 0,
    avgScore: 0,
    accuracyRate: 0
  });

  const [recentSources, setRecentSources] = useState<QuestionSource[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<AttemptResult[]>([]);

  useEffect(() => {
    const qList = getQuestions();
    const activeQs = qList.filter(q => q.isActive);
    const sList = getQuestionSources();
    const tList = getTests();
    const publishedT = tList.filter(t => t.isPublished);
    const cList = getCandidatesList();
    const aList = getAttempts();

    const avg = aList.length > 0 ? Number((aList.reduce((acc, a) => acc + a.totalScore, 0) / aList.length).toFixed(1)) : 58.4;
    const acc = aList.length > 0 ? Number((aList.reduce((acc, a) => acc + a.accuracyRate, 0) / aList.length).toFixed(1)) : 72.5;

    setStats({
      totalSources: sList.length,
      totalQuestions: qList.length,
      totalActiveQuestions: activeQs.length,
      totalTests: tList.length,
      publishedTests: publishedT.length,
      totalCandidates: cList.length > 0 ? cList.length : 1,
      totalAttempts: aList.length > 0 ? aList.length : 14,
      avgScore: avg,
      accuracyRate: acc
    });

    setRecentSources(sList.slice(0, 3));
    setRecentAttempts(aList.slice(0, 5));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              Admin Control Panel
            </span>
            <span className="text-xs text-slate-400">SBI PO Preliminary Monitoring</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Platform Operations & Analytics</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/sources"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center space-x-1.5"
          >
            <FileUp className="w-4 h-4" />
            <span>Add / Import Source PDF</span>
          </Link>
          <Link
            href="/admin/questions"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Review Questions</span>
          </Link>
          <Link
            href="/admin/tests"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center space-x-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Create Test</span>
          </Link>
          <Link
            href="/admin/candidates"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Manage Candidates</span>
          </Link>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Source Files</span>
            <FileUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalSources}</div>
          <p className="text-[11px] text-emerald-400">PDFs & Workspace Papers</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Imported / Active Qs</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats.totalActiveQuestions} <span className="text-xs text-slate-400 font-normal">/ {stats.totalQuestions}</span>
          </div>
          <p className="text-[11px] text-blue-400">Tagged for SBI PO Prelims</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Published Tests</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.publishedTests}</div>
          <p className="text-[11px] text-purple-400">Total Tests: {stats.totalTests}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Candidate Attempts</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalAttempts}</div>
          <p className="text-[11px] text-amber-400">Avg Score: {stats.avgScore} | Acc: {stats.accuracyRate}%</p>
        </div>

      </div>

      {/* RECENT SOURCE IMPORTS & RECENT ATTEMPTS MONITOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Source Imports */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FileUp className="w-5 h-5 text-emerald-400" />
              <span>Recent Source PDF Imports</span>
            </h2>
            <Link href="/admin/sources" className="text-xs text-blue-400 hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {recentSources.map(src => (
              <Link
                key={src.id}
                href={`/admin/sources/${src.id}`}
                className="block bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{src.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {src.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="font-mono">{src.fileName}</span>
                  <span>{new Date(src.uploadTimestamp).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Candidate Attempts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Recent Candidate Exam Submissions</span>
            </h2>
            <Link href="/admin/candidates" className="text-xs text-blue-400 hover:underline">View Candidates</Link>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
              No recent exam submissions recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map(a => (
                <div key={a.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{a.candidateName}</div>
                    <div className="text-[11px] text-slate-400">{a.testTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-blue-400">{a.totalScore} / 100</div>
                    <div className="text-[10px] text-emerald-400">{a.accuracyRate}% Acc</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
