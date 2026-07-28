'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getQuestionById, saveQuestion } from '@/lib/repository';
import { Question, SubjectName, QuestionVerificationStatus } from '@/types';
import { BookOpen, ChevronLeft, Save, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export default function AdminQuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({});
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (questionId) {
      const q = getQuestionById(questionId);
      if (q) {
        setQuestion(q);
        setFormData(q);
      }
    }
  }, [questionId]);

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Question Not Found</h2>
        <Link href="/admin/questions" className="text-xs text-blue-400 hover:underline">
          Return to Question Bank
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveQuestion(formData as any);
    setQuestion(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <Link href="/admin/questions" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Central Question Bank</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Question #{question.questionNumber} ({question.subject})
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">ID: {question.id} | Source: {question.sourceId || 'Manual'}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
              {formData.verificationStatus || 'published'}
            </span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Question updated successfully in central bank!</span>
        </div>
      )}

      {/* QUESTION EDITOR FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value as SubjectName })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="English Language">English Language</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="Reasoning Ability">Reasoning Ability</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Topic</label>
            <input
              type="text"
              value={formData.topic || ''}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Verification Status</label>
            <select
              value={formData.verificationStatus || 'published'}
              onChange={e => setFormData({ ...formData, verificationStatus: e.target.value as QuestionVerificationStatus })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold"
            >
              <option value="draft">Draft</option>
              <option value="needs review">Needs Review</option>
              <option value="verified">Verified</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Long Format Question Statement */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Question Statement / Passage / Data Context</label>
          <textarea
            rows={8}
            required
            value={formData.questionText || ''}
            onChange={e => setFormData({ ...formData, questionText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 font-medium leading-relaxed"
          />
        </div>

        {/* Options Grid A-E */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">All 5 MCQ Options (A, B, C, D, E)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <span className="w-6 font-bold text-slate-400 text-center">{opt}:</span>
                <input
                  type="text"
                  required
                  value={formData[`option${opt}` as keyof Question] as string || ''}
                  onChange={e => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Correct Option */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Correct Answer</label>
            <select
              value={formData.correctOption || 'A'}
              onChange={e => setFormData({ ...formData, correctOption: e.target.value as any })}
              className="w-full bg-slate-950 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl px-3 py-2.5"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
              <option value="E">Option E</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Active Status</label>
            <select
              value={formData.isActive ? 'true' : 'false'}
              onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="true">Active in Question Bank</option>
              <option value="false">Inactive / Hidden</option>
            </select>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Solution & Explanation</label>
          <textarea
            rows={4}
            value={formData.explanation || ''}
            onChange={e => setFormData({ ...formData, explanation: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
            placeholder="Step-by-step solution..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Link
            href="/admin/questions"
            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Question Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
}
