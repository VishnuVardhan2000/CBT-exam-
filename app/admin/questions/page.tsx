'use client';

import React from 'react';
import QuestionBankTable from '@/components/admin/QuestionBankTable';

export default function AdminQuestionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Central Question Bank Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage reusable SBI PO Preliminary questions, edit options, update explanations, and tag by subject and topic.
        </p>
      </div>

      <QuestionBankTable />
    </div>
  );
}
