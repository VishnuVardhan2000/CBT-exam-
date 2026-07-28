'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('sbi_cbt_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('sbi_cbt_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDeclineOptional = () => {
    localStorage.setItem('sbi_cbt_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl z-50 text-slate-200 text-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Cookie className="w-5 h-5 text-amber-400 shrink-0" />
          <h4 className="font-bold text-white text-sm">Cookie & Privacy Notice</h4>
        </div>
        <button onClick={handleDeclineOptional} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed">
        Mock CBT uses local storage and essential cookies to maintain exam attempt state, timer synchronization, and lock-once answer security during mock tests.
      </p>

      <div className="flex items-center justify-between pt-1">
        <Link href="/cookies" className="text-[11px] text-blue-400 underline font-semibold">
          Read Cookie Policy
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDeclineOptional}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20 flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
