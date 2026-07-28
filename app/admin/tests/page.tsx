'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Plus, CheckCircle2, Clock, BookOpen, AlertTriangle, Eye } from 'lucide-react';
import { getTests, saveTest } from '@/lib/repository';
import { Test } from '@/types';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('SBI PO Preliminary Full Length Mock Test - 02');
  const [description, setDescription] = useState<string>('100-Question Preliminary Exam with 20-min sectional timers for English, Quant, and Reasoning.');

  useEffect(() => {
    setTests(getTests());
  }, []);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest = saveTest({
      title,
      description,
      stage: 'Preliminary',
      isPublished: true
    });
    setTests(getTests());
    setShowCreateModal(false);
  };

  const handleTogglePublish = (test: Test) => {
    saveTest({
      ...test,
      isPublished: !test.isPublished
    });
    setTests(getTests());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Mock Test Builder & Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Assemble 100-question Preliminary mock papers with enforced 20-min sectional timers (English 30Q, Quant 35Q, Reasoning 35Q).
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Assemble New Test</span>
        </button>
      </div>

      {/* TESTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => (
          <div key={test.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
                {test.stage} Exam
              </span>
              <button
                onClick={() => handleTogglePublish(test)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  test.isPublished
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {test.isPublished ? 'Published' : 'Draft / Unpublished'}
              </button>
            </div>

            <div>
              <Link href={`/admin/tests/${test.id}`} className="text-base font-bold text-white hover:text-blue-400 transition">
                {test.title}
              </Link>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{test.description}</p>
            </div>

            {/* Test Configuration Cards */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Questions</span>
                <div className="font-extrabold text-white">{test.totalQuestions} Qs</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                <div className="font-extrabold text-amber-400">{test.totalDurationMinutes} Mins</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Negative Mark</span>
                <div className="font-extrabold text-red-400">-{test.negativeMarking}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">Section Pattern: 30 / 35 / 35</span>
              <Link
                href={`/admin/tests/${test.id}`}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Configure Test</span>
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE TEST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTest} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Assemble SBI PO Prelims Test</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Test Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-emerald-400">Auto Section Configuration:</div>
              <div>• English Language: 30 Qs (20 mins)</div>
              <div>• Quantitative Aptitude: 35 Qs (20 mins)</div>
              <div>• Reasoning Ability: 35 Qs (20 mins)</div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20"
              >
                Publish Test
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
