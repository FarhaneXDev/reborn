'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#DEECE2] flex items-center justify-center text-2xl shadow-xs animate-pulse">
          ✨
        </div>
        <h2 className="text-lg font-bold text-[#272522] mt-4 tracking-tight">Reborn</h2>
        <p className="text-xs text-[#6E685F] mt-1">Préparation de votre espace intime...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
