'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SosModal from './SosModal';

const BOTTOM_NAV = [
  { href: '/', label: 'Accueil', icon: '🏠' },
  { href: '/parcours', label: 'Parcours', icon: '🌱' },
  { href: '/journal', label: 'Journal', icon: '📖' },
  { href: '/statistiques', label: 'Stats', icon: '📊' },
  { href: '/avenir', label: 'Avenir', icon: '🌅' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sosOpen, setSosOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#FAF7F2]">
        {/* Sidebar Desktop (Cachée sur mobile) */}
        <div className="hidden md:flex">
          <Sidebar onOpenSos={() => setSosOpen(true)} />
        </div>

        {/* Mobile Slide-Over Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-2xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 border-r border-[#EFE9DE]">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#F4EFE6]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#DEECE2] flex items-center justify-center text-xl">
                      ✨
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-[#272522]">Reborn</h2>
                      <p className="text-xs text-[#6E685F]">Un jour à la fois</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-2 text-[#8E877E] hover:text-[#272522] rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* SOS Button Mobile */}
                <div className="pt-5 pb-3">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setSosOpen(true);
                    }}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F6F3F9] border border-[#E3DAEC] text-[#7A638C] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>🌿</span>
                    <span>Envie de contacter ?</span>
                  </button>
                </div>

                {/* Links */}
                <nav className="space-y-1 pt-2">
                  {[
                    ...BOTTOM_NAV,
                    { href: '/parametres', label: 'Paramètres', icon: '⚙️' },
                  ].map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#F1F6F3] text-[#3E5E4A] font-semibold'
                            : 'text-[#6E685F] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User Footer Mobile */}
              <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between">
                <div className="truncate pr-2">
                  <p className="text-[11px] text-[#8E877E]">Connecté</p>
                  <p className="text-xs font-semibold text-[#272522] truncate">{user?.username || user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FDF2F2] text-[#C55353] text-xs font-medium"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zone Principale */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onOpenSos={() => setSosOpen(true)}
            userProfile={user?.profile}
            onToggleMobileMenu={() => setMobileDrawerOpen(true)}
          />

          <div className="flex-1 pb-24 md:pb-10 min-w-0">
            {children}
          </div>
        </div>

        {/* Bottom Bar Mobile (Fixée en bas sur téléphone) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFE9DE] px-3 py-2 flex justify-around items-center shadow-lg">
          {BOTTOM_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-transform active:scale-95 ${
                  isActive ? 'text-[#3E5E4A] font-bold' : 'text-[#8E877E] hover:text-[#272522]'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[10px] leading-none">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[#8E877E] active:scale-95 cursor-pointer"
          >
            <span className="text-lg leading-none">⚙️</span>
            <span className="text-[10px] leading-none">Menu</span>
          </button>
        </nav>

        {/* SOS Modal universel */}
        <SosModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
      </div>
    </ProtectedRoute>
  );
}
