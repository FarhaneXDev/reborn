'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../lib/auth';

function LoginContent() {
  const router = useRouter();
  const { user, loading: authLoading, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [noContactStartDate, setNoContactStartDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user && !authLoading) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          email,
          username: username || email.split('@')[0],
          password,
          no_contact_start_date: noContactStartDate || null,
        });
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects ou problème de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EFE9DE] shadow-lg max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#DEECE2] flex items-center justify-center text-2xl mx-auto shadow-xs">
            ✨
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#272522]">Reborn</h1>
          <p className="text-xs sm:text-sm text-[#6E685F]">
            {isRegister
              ? 'Créez votre espace intime pour entamer votre renaissance'
              : 'Retrouvez votre espace de bienveillance personnelle'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FADBD8] text-xs text-[#C55353] leading-relaxed animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6E685F] mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre.email@exemple.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE9DE] text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-[#6E685F] mb-1">
                Prénom ou pseudonyme
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Comment souhaitez-vous être appelé(e) ?"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFE9DE] text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#6E685F] mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Au moins 8 caractères"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE9DE] text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-[#6E685F] mb-1">
                Date de début du No-Contact (facultatif)
              </label>
              <input
                type="date"
                value={noContactStartDate}
                onChange={(e) => setNoContactStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFE9DE] text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-sm font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2"
          >
            {loading ? 'Chargement...' : isRegister ? 'Créer mon espace' : 'Me connecter'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-[#F4EFE6]">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-[#4B7059] hover:underline cursor-pointer"
          >
            {isRegister
              ? 'Vous avez déjà un compte ? Vous connecter'
              : 'Nouveau venu ? Créer un compte personnel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
