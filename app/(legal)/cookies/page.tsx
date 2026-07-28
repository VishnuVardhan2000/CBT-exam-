'use client';

import React from 'react';
import { Cookie } from 'lucide-react';

export default function CookiePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-slate-300 text-sm">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <Cookie className="w-8 h-8 text-amber-400" />
        <div>
          <h1 className="text-2xl font-extrabold text-white">Cookie & Local Storage Policy</h1>
          <p className="text-xs text-slate-400">Session & Local Data Policy</p>
        </div>
      </div>

      <p>
        Mock CBT utilizes essential browser session storage and local storage to preserve candidate test timers, active exam selections, and user role states across browser refreshes.
      </p>
    </div>
  );
}
