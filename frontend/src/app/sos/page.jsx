'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '../../lib/auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import SosModal from '../../components/SosModal';

function SosContent() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <SosModal isOpen={true} onClose={() => router.push('/')} />
      </div>
    </ProtectedRoute>
  );
}

export default function SosPage() {
  return (
    <AuthProvider>
      <SosContent />
    </AuthProvider>
  );
}
