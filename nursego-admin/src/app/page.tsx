import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">NurseGo Admin</h1>
          <p className="text-slate-500 mt-2">Sign in to manage the platform</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              placeholder="admin@nursego.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              placeholder="••••••••"
            />
          </div>
          
          <Link href="/dashboard" className="block">
            <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700">
              Sign In (Bypass for Testing)
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
