'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSourceById, updateSourceStatus, getQuestions } from '@/lib/repository';
import { QuestionSource, Question, SourceStatus } from '@/types';
import { FileText, ChevronLeft, CheckCircle2, AlertTriangle, RefreshCw, Eye, Tag, Save, Layers } from 'lucide-react';

export default function AdminSourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sourceId = params.id as string;

  const [source, setSource] = useState<QuestionSource | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<SourceStatus>('parsed');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (sourceId) {
      const src = getSourceById(sourceId);
      if (src) {
        setSource(src);
        setStatus(src.status);
        setNotes(src.notes || '');
        const qList = getQuestions({ sourceId });
        setQuestions(qList);
      }
    }
  }, [sourceId]);

  if (!source) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Source File Not Found</h2>
        <Link href="/admin/sources" className="text-xs text-blue-400 hover:underline">
          Return to Source Management
        </Link>
      </div>
    );
  }

  const handleSaveStatus = () => {
    updateSourceStatus(source.id, status);
    setSource(prev => prev ? { ...prev, status, notes } : null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <Link href="/admin/sources" className="text-xs text-blue-400 font-semibold flex items-center space-x-1 mb-2 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Question Sources</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{source.title}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">File: {source.fileName} | ID: {source.id}</p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
              status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              status === 'verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
              status === 'under review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-purple-500/10 text-purple-400 border-purple-500/30'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* SOURCE METADATA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Source File Metadata & Origins</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Exam & Stage</span>
              <div className="font-bold text-white mt-0.5">{source.examName} ({source.stage})</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Parsed Questions</span>
              <div className="font-bold text-emerald-400 mt-0.5">{questions.length} Linked Questions</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Local Workspace File</span>
              <div className="font-bold text-purple-400 mt-0.5 font-mono truncate">{source.localFilePath || 'Uploaded via Browser'}</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Import Date</span>
              <div className="font-bold text-slate-200 mt-0.5">{new Date(source.uploadTimestamp).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* STATUS CONTROL PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white">Source Verification Controls</h2>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Verification Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as SourceStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
              >
                <option value="draft">Draft</option>
                <option value="parsed">Parsed</option>
                <option value="under review">Under Review</option>
                <option value="verified">Verified</option>
                <option value="published">Published</option>
                <option value="failed">Failed / Warning</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Source Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add reviewer notes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <button
              onClick={handleSaveStatus}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Update Source Status</span>
            </button>
          </div>
        </div>

      </div>

      {/* LINKED QUESTIONS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Questions Imported from this Source ({questions.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Question Preview</th>
                <th className="py-3 px-4">Ans</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {questions.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{q.questionNumber}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {q.subject}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{q.topic}</td>
                  <td className="py-3 px-4 max-w-md truncate text-slate-300">{q.questionText}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{q.correctOption}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/questions/${q.id}`}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
