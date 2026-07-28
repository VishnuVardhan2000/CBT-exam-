'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Edit2, Trash2, BookOpen, Layers, CheckCircle2, X, Eye } from 'lucide-react';
import { getQuestions, saveQuestion, deleteQuestion, bulkUpdateQuestionsVerification } from '@/lib/repository';
import { Question, SubjectName, QuestionVerificationStatus } from '@/types';

export default function QuestionBankTable() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Add Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [subjectFilter, verificationFilter, difficultyFilter, searchTerm]);

  const loadQuestions = () => {
    const list = getQuestions({
      subject: subjectFilter,
      verificationStatus: verificationFilter,
      difficulty: difficultyFilter,
      search: searchTerm
    });
    setQuestions(list);
  };

  const handleOpenAdd = () => {
    setEditingQuestion({
      subject: 'English Language',
      topic: 'General',
      difficulty: 'Medium',
      questionNumber: questions.length + 1,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionE: 'None of these',
      correctOption: 'A',
      explanation: '',
      isActive: true,
      verificationStatus: 'published'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question from the Question Bank?')) {
      deleteQuestion(id);
      loadQuestions();
    }
  };

  const handleBulkVerify = (status: QuestionVerificationStatus) => {
    if (selectedQuestionIds.length === 0) return;
    bulkUpdateQuestionsVerification(selectedQuestionIds, status);
    setSelectedQuestionIds([]);
    loadQuestions();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.questionText) return;

    saveQuestion(editingQuestion as any);
    setIsModalOpen(false);
    loadQuestions();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Central Question Bank ({questions.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Search, filter, inspect, and edit SBI PO Preliminary questions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search question text, topic..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Subjects</option>
            <option value="English Language">English Language</option>
            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
            <option value="Reasoning Ability">Reasoning Ability</option>
          </select>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={e => setVerificationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Verification States</option>
            <option value="published">Published</option>
            <option value="verified">Verified</option>
            <option value="needs review">Needs Review</option>
            <option value="draft">Draft</option>
          </select>

          {/* Add Question Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedQuestionIds.length > 0 && (
        <div className="bg-blue-950/60 border border-blue-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-blue-200">
          <span className="font-semibold">{selectedQuestionIds.length} Questions Selected for Bulk Action</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkVerify('verified')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
            >
              Mark Verified
            </button>
            <button
              onClick={() => handleBulkVerify('published')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
            >
              Mark Published
            </button>
          </div>
        </div>
      )}

      {/* Questions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">
                <input
                  type="checkbox"
                  onChange={e => {
                    if (e.target.checked) setSelectedQuestionIds(questions.map(q => q.id));
                    else setSelectedQuestionIds([]);
                  }}
                  checked={selectedQuestionIds.length > 0 && selectedQuestionIds.length === questions.length}
                />
              </th>
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Topic</th>
              <th className="py-3 px-4">Question Preview</th>
              <th className="py-3 px-3">Ans</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {questions.slice(0, 50).map((q, idx) => (
              <tr key={q.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.includes(q.id)}
                    onChange={e => {
                      if (e.target.checked) setSelectedQuestionIds([...selectedQuestionIds, q.id]);
                      else setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== q.id));
                    }}
                  />
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-400">
                  {q.questionNumber || idx + 1}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    q.subject === 'English Language' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    q.subject === 'Quantitative Aptitude' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {q.subject}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-slate-200">
                  {q.topic}
                </td>
                <td className="py-3 px-4 max-w-md truncate text-slate-300">
                  {q.questionText}
                </td>
                <td className="py-3 px-3">
                  <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    {q.correctOption}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                    (q.verificationStatus || 'published') === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    q.verificationStatus === 'verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {q.verificationStatus || 'published'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Link
                    href={`/admin/questions/${q.id}`}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg inline-block transition"
                    title="Inspect & Edit Full Question"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Question Quick Modal */}
      {isModalOpen && editingQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveModal} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Question to Bank</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                <select
                  value={editingQuestion.subject}
                  onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value as SubjectName })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="English Language">English Language</option>
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Reasoning Ability">Reasoning Ability</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Topic</label>
                <input
                  type="text"
                  value={editingQuestion.topic || ''}
                  onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Question Statement</label>
              <textarea
                rows={3}
                required
                value={editingQuestion.questionText || ''}
                onChange={e => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => (
                <div key={opt}>
                  <label className="block font-semibold text-slate-400 mb-1">Option {opt}</label>
                  <input
                    type="text"
                    required
                    value={editingQuestion[`option${opt}` as keyof Question] as string || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, [`option${opt}`]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              ))}

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Correct Answer</label>
                <select
                  value={editingQuestion.correctOption || 'A'}
                  onChange={e => setEditingQuestion({ ...editingQuestion, correctOption: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-bold rounded-xl px-3 py-2"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                  <option value="E">Option E</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl">
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
