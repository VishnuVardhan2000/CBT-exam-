'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, Cookie } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.includes('/candidate/test/')) {
    return null; // Hide in CBT exam mode
  }

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left branding */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            CBT
          </div>
          <span className="text-sm font-semibold text-slate-300">
            Mock CBT Platform <span className="text-slate-500 font-normal">| SBI PO Preliminary</span>
          </span>
        </div>

        {/* Legal & Compliance Navigation */}
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-slate-200 transition flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </Link>
          <Link href="/terms" className="hover:text-slate-200 transition flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </Link>
          <Link href="/cookies" className="hover:text-slate-200 transition flex items-center space-x-1">
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie Notice</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} Mock CBT Platform. Secure & Lock-Enforced Exam Engine.
        </div>

      </div>
    </footer>
  );
}
