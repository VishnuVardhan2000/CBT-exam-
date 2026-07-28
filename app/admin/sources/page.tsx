'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PdfUploader from '@/components/admin/PdfUploader';
import { getQuestionSources, getQuestions } from '@/lib/repository';
import { QuestionSource, SourceStatus } from '@/types';
import { FileUp, FileText, Search, Filter, CheckCircle2, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<QuestionSource[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadSources();
  }, [statusFilter, searchTerm]);

  const loadSources = () => {
    let list = getQuestionSources();
    if (statusFilter !== 'All') {
      list = list.filter(s => s.status === statusFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(term) || s.fileName.toLowerCase().includes(term));
    }
    setSources(list);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">PDF Question Source Ingestion & Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Ingest question paper PDFs from workspace directory <code className="text-blue-400">/source-files/pdfs</code> or browser upload, track review status, and inspect parsed questions.
        </p>
      </div>

      {/* DUAL MODE PDF UPLOADER */}
      <PdfUploader />

      {/* INGESTED SOURCES MANAGEMENT LOG */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Ingested Question Sources Directory ({sources.length})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search source title or filename..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="parsed">Parsed</option>
              <option value="under review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="published">Published</option>
              <option value="failed">Failed / Warning</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Title / File</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Parsed Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map(src => (
                <tr key={src.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <Link href={`/admin/sources/${src.id}`} className="font-bold text-white hover:text-blue-400 transition">
                      {src.title}
                    </Link>
                    <div className="text-[11px] text-slate-500 font-mono">{src.fileName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/30 text-[10px]">
                      {src.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {src.localFilePath ? 'Workspace Folder' : 'Browser Upload'}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    {src.parsedCount || 100} Qs
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      src.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      src.status === 'verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      src.status === 'under review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {src.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/sources/${src.id}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review & Inspect</span>
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
