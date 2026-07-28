'use client';

import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-slate-300 text-sm">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <ShieldCheck className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-2xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: January 2026</p>
        </div>
      </div>

      <p>
        Mock CBT ("we", "our", or "us") is committed to protecting your privacy while taking computer-based mock tests for SBI PO Preliminary exam preparation. This Privacy Policy outlines how your data is collected, stored, and protected.
      </p>

      <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
      <p>
        We collect candidate profile details (full name, email address, target exam year), test attempt telemetry (answers selected, timestamps, time spent per question), and administrative logs for question source ingestion.
      </p>

      <h2 className="text-base font-bold text-white">2. How Information is Used</h2>
      <p>
        Your attempt data is strictly utilized to auto-calculate scores, enforce negative marking rules, provide subject-wise growth analytics, and display candidate performance history.
      </p>

      <h2 className="text-base font-bold text-white">3. Data Protection & Security</h2>
      <p>
        We implement Row-Level Security (RLS) on database tables, session isolation, and strict lock-once answer policies to prevent unauthorized modification of candidate attempt logs.
      </p>
    </div>
  );
}
