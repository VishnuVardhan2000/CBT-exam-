'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { switchRole, setActiveUser } from '@/lib/auth/store';
import { MOCK_USERS } from '@/lib/storage/mock-store';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('candidate');
  const [email, setEmail] = useState<string>('candidate@mockcbt.com');
  const [password, setPassword] = useState<string>('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[1];
    setActiveUser({
      ...user,
      email: email || user.email
    });

    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/candidate/dashboard');
    }
  };

  const handleSelectQuickDemo = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@mockcbt.com');
    } else {
      setEmail('candidate@mockcbt.com');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            CBT
          </div>
          <h1 className="text-xl font-extrabold text-white">Sign In to Mock CBT</h1>
          <p className="text-xs text-slate-400">SBI PO Preliminary Online Mock Testing Platform</p>
        </div>

        {/* Quick Role Switcher */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleSelectQuickDemo('candidate')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              role === 'candidate'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Candidate Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectQuickDemo('admin')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              role === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-bold text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2 ${
              role === 'admin'
                ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            <span>Login as {role === 'admin' ? 'Administrator' : 'Candidate'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-blue-400 font-semibold hover:underline">
            Register Candidate Account
          </Link>
        </div>

      </div>
    </div>
  );
}
