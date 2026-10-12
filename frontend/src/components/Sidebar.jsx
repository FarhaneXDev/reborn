'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';

const NAV_ITEMS = [
  { href: '/', label: 'Tableau de bord', icon: '🏠' },
  { href: '/parcours', label: 'Mon parcours', icon: '🌱' },
  { href: '/journal', label: 'Mon journal', icon: '📖' },
  { href: '/statistiques', label: 'Mes statistiques', icon: '📊' },
  { href: '/avenir', label: 'Mon avenir', icon: '🌅' },
  { href: '/parametres', label: 'Paramètres', icon: '⚙️' },
];

export default function Sidebar({ onOpenSos }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-[#EFE9DE] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#F4EFE6]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#DEECE2] flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-[#272522]">Reborn</h1>
              <p className="text-xs text-[#6E685F]">Un jour à la fois</p>
            </div>
          </Link>
        </div>

        {/* SOS Action Button */}
        <div className="px-4 pt-5 pb-2">
          <button
            onClick={onOpenSos}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#F6F3F9] hover:bg-[#ECE6F2] border border-[#E3DAEC] text-[#7A638C] text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span>🌿</span>
            <span>Envie de contacter ?</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F1F6F3] text-[#3E5E4A] font-semibold shadow-xs'
                    : 'text-[#6E685F] hover:bg-[#FAF7F2] hover:text-[#272522]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info & Logout */}
      <div className="p-4 border-t border-[#F4EFE6]">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs text-[#8E877E]">Connecté en tant que</p>
              <p className="text-sm font-medium text-[#272522] truncate">{user.username || user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Se déconnecter"
              className="p-2 text-xs text-[#8E877E] hover:text-[#C55353] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer"
            >
              🚪
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="block text-center py-2 px-3 text-sm font-medium text-[#4B7059] bg-[#F1F6F3] hover:bg-[#DEECE2] rounded-xl transition-colors"
          >
            Se connecter
          </Link>
        )}
      </div>
    </aside>
  );
}
