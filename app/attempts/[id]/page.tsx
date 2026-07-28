'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CbtExamEngine from '@/components/test/CbtExamEngine';
import { getTestById } from '@/lib/repository';
import { Test } from '@/types';
import { AlertCircle } from 'lucide-react';

export default function LiveCbtAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (testId) {
      const found = getTestById(testId);
      if (found) {
        setTest(found);
      }
      setLoading(false);
    }
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Initializing SBI PO Preliminary CBT Exam Engine...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h2 className="text-base font-bold">Mock Test Not Found</h2>
          <p className="text-xs text-slate-400">The requested test ID does not exist or is unpublished.</p>
          <button
            onClick={() => router.push('/tests')}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            Return to Test Catalog
          </button>
        </div>
      </div>
    );
  }

  return <CbtExamEngine test={test} />;
}
