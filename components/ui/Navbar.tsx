'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, User, LogOut, BookOpen, BarChart3, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { getActiveUser, switchRole } from '@/lib/auth/store';
import { UserProfile, UserRole } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(getActiveUser());
  }, [pathname]);

  const handleRoleToggle = (role: UserRole) => {
    const updated = switchRole(role);
    setCurrentUser(updated);
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/candidate/dashboard');
    }
  };

  // Do not show full navbar during candidate active CBT exam to maintain distraction-free interface
  if (pathname.includes('/candidate/test/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-xl">
                CBT
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
                  Mock CBT
                </span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                  SBI PO Preliminary
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links based on Role */}
          {currentUser && (
            <nav className="hidden md:flex items-center space-x-1">
              {currentUser.role === 'admin' ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/admin/dashboard' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/sources"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/admin/sources' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    PDF Ingestion
                  </Link>
                  <Link
                    href="/admin/questions"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/admin/questions' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Question Bank
                  </Link>
                  <Link
                    href="/admin/tests"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/admin/tests' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Manage Tests
                  </Link>
                  <Link
                    href="/admin/candidates"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/admin/candidates' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Candidates
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/candidate/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/candidate/dashboard' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    My Tests
                  </Link>
                  <Link
                    href="/candidate/progress"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === '/candidate/progress' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Growth Analytics
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Quick Role Switcher & User Profile */}
          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="bg-slate-800/80 border border-slate-700 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => handleRoleToggle('candidate')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                    currentUser.role === 'candidate'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Candidate</span>
                </button>

                <button
                  onClick={() => handleRoleToggle('admin')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {!currentUser ? (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{currentUser.fullName}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{currentUser.role} Mode</span>
                </div>
                <button
                  onClick={() => {
                    router.push('/login');
                  }}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
