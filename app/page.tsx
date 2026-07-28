'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Shield, Clock, Lock, BarChart3, CheckCircle, ArrowRight, Award, FileUp, Sparkles } from 'lucide-react';
import { getActiveUser, switchRole } from '@/lib/auth/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const currentUser = getActiveUser();

  const handleStartAsCandidate = () => {
    switchRole('candidate');
    router.push('/candidate/dashboard');
  };

  const handleStartAsAdmin = () => {
    switchRole('admin');
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-600/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SBI PO Preliminary Computer Based Test (CBT) Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
          Master the SBI PO Preliminary Exam with Real CBT Engine
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Enforce strict 20-minute sectional timing, lock-once answer security, negative marking (-0.25), and detailed subject-wise growth analytics built for serious aspirants.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartAsCandidate}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-2.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Mock CBT Test</span>
          </button>

          <button
            onClick={handleStartAsAdmin}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm rounded-xl transition flex items-center justify-center space-x-2"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Admin Control Panel</span>
          </button>
        </div>

        {/* SBI PO Prelims Exam Rules Highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Questions</span>
            <div className="text-2xl font-extrabold text-white mt-1">100 MCQs</div>
            <span className="text-[11px] text-blue-400">100 Marks</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Duration</span>
            <div className="text-2xl font-extrabold text-white mt-1">60 Mins</div>
            <span className="text-[11px] text-amber-400">20 Mins / Section</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Negative Mark</span>
            <div className="text-2xl font-extrabold text-white mt-1">-0.25</div>
            <span className="text-[11px] text-red-400">For wrong choice</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Answer Lock</span>
            <div className="text-2xl font-extrabold text-white mt-1">Lock Once</div>
            <span className="text-[11px] text-emerald-400">No reattempt abuse</span>
          </div>
        </div>

      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-16 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white">Engineered for SBI PO Examination Standard</h2>
            <p className="text-xs text-slate-400 mt-2">Comprehensive features designed for candidates and exam administrators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Enforced Sectional Timers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                20 minutes strictly enforced for English Language (30 Qs), Quantitative Aptitude (35 Qs), and Reasoning Ability (35 Qs).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Lock-Once Answer Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents candidate answer overwrites once confirmed, maintaining integrity and preventing unfair reattempts.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <FileUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">PDF Ingestion & Human Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Admin can upload question source PDFs, extract questions automatically, review/edit text, and publish to the main question bank.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
