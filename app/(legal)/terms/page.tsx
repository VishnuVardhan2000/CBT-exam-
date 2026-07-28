'use client';

import React from 'react';
import { FileText, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-slate-300 text-sm">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <FileText className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-extrabold text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">SBI PO Preliminary Online Mock Exam Rules</p>
        </div>
      </div>

      <h2 className="text-base font-bold text-white">1. Lock-Once Examination Rules</h2>
      <p>
        The CBT Engine enforces strict single-confirmation answer locking. Once a candidate confirms an answer choice, it is locked permanently and cannot be modified or reattempted during that exam session.
      </p>

      <h2 className="text-base font-bold text-white">2. Sectional Timing Compliance</h2>
      <p>
        Preliminary tests enforce 20 minutes for English Language, 20 minutes for Quantitative Aptitude, and 20 minutes for Reasoning Ability. Automatic section transition occurs upon timer expiration.
      </p>

      <h2 className="text-base font-bold text-white">3. Scoring Rules</h2>
      <p>
        Each correct response earns +1.0 mark, incorrect responses incur a deduction of -0.25 marks, and skipped questions receive 0 marks.
      </p>
    </div>
  );
}
