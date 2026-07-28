'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTestById, saveTest, getQuestions } from '@/lib/repository';
import { Test, Question, SubjectName } from '@/types';
import { Layers, ChevronLeft, CheckCircle2, AlertTriangle, Save, Clock, BookOpen } from 'lucide-react';

export default function AdminTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (testId) {
      const t = getTestById(testId);
      if (t) {
        setTest(t);
        setTitle(t.title);
        setDescription(t.description);
        setIsPublished(t.isPublished);
        setQuestions(getQuestions());
      }
    }
  }, [testId]);

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Test Not Found</h2>
        <Link href="/admin/tests" className="text-xs text-blue-400 hover:underline">
          Return to Test Management
        </Link>
      </div>
    );
  }

  const englishCount = questions.filter(q => q.subject === 'English Language').length;
  const quantCount = questions.filter(q => q.subject === 'Quantitative Aptitude').length;
  const reasoningCount = questions.filter(q => q.subject === 'Reasoning Ability').length;
  const totalCount = englishCount + quantCount + reasoningCount;

  const isSectionPatternValid = englishCount === 30 && quantCount === 35 && reasoningCount === 35;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveTest({
      id: test.id,
      title,
      description,
      isPublished
    });
    setTest(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <Link href="/admin/tests" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Test Management</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{test.title}</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">Test ID: {test.id}</p>
          </div>

          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              isPublished
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isPublished ? 'Published' : 'Draft / Unpublished'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Test details updated successfully!</span>
        </div>
      )}

      {/* SECTION DISTRIBUTION VALIDATION CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Sectional Question Pattern Validation</span>
          </h2>
          {isSectionPatternValid ? (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SBI PO Pattern Verified (100 Qs)</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Section Count Mismatch</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className={`p-4 rounded-xl border ${englishCount === 30 ? 'bg-slate-950 border-slate-800' : 'bg-amber-950/20 border-amber-500/40'}`}>
            <span className="text-slate-400 font-semibold">1. English Language</span>
            <div className="text-xl font-extrabold text-blue-400 mt-1">{englishCount} / 30 Qs</div>
            <span className="text-[10px] text-slate-500">20 Minutes Enforced</span>
          </div>

          <div className={`p-4 rounded-xl border ${quantCount === 35 ? 'bg-slate-950 border-slate-800' : 'bg-amber-950/20 border-amber-500/40'}`}>
            <span className="text-slate-400 font-semibold">2. Quantitative Aptitude</span>
            <div className="text-xl font-extrabold text-purple-400 mt-1">{quantCount} / 35 Qs</div>
            <span className="text-[10px] text-slate-500">20 Minutes Enforced</span>
          </div>

          <div className={`p-4 rounded-xl border ${reasoningCount === 35 ? 'bg-slate-950 border-slate-800' : 'bg-amber-950/20 border-amber-500/40'}`}>
            <span className="text-slate-400 font-semibold">3. Reasoning Ability</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{reasoningCount} / 35 Qs</div>
            <span className="text-[10px] text-slate-500">20 Minutes Enforced</span>
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
        <h2 className="text-base font-bold text-white">Test Settings & Information</h2>
        
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Test Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Test Configuration</span>
          </button>
        </div>
      </form>

    </div>
  );
}
