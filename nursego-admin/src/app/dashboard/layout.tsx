import React from 'react';
import Link from 'next/link';
import { Settings, Activity } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-blue-600">NurseGo Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <Activity className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link href="/dashboard/nurses" className="flex items-center px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <Activity className="w-5 h-5 mr-3" /> Approvals
          </Link>
          <Link href="/dashboard/services" className="flex items-center px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <Settings className="w-5 h-5 mr-3" /> Services
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
