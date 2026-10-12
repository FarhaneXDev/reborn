'use client';

import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenSos, userProfile, onToggleMobileMenu }) {
  const [todayFormatted, setTodayFormatted] = useState('');
  const [noContactDays, setNoContactDays] = useState(null);

  useEffect(() => {
    const formatted = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
    setTodayFormatted(formatted);

    if (userProfile?.no_contact_start_date) {
      const startDate = new Date(userProfile.no_contact_start_date);
      const today = new Date();
      const diffTime = today - startDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        setNoContactDays(diffDays);
      }
    }
  }, [userProfile]);

  return (
    <header className="h-18 bg-white border-b border-[#EFE9DE] px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#6E685F] hover:bg-[#FAF7F2] transition-colors"
          title="Ouvrir le menu"
        >
          ☰
        </button>

        <div>
          <span className="text-[11px] font-semibold text-[#4B7059] uppercase tracking-wider block">
            Aujourd'hui
          </span>
          <h2 className="text-xs sm:text-sm md:text-base font-medium text-[#272522] capitalize min-h-5 flex items-center">
            {todayFormatted || 'Chargement...'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {noContactDays !== null && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#F1F6F3] border border-[#DEECE2] text-[11px] sm:text-xs font-medium text-[#3E5E4A]">
            <span className="w-2 h-2 rounded-full bg-[#4B7059]"></span>
            <span>
              {noContactDays} jour{noContactDays > 1 ? 's' : ''} <span className="hidden sm:inline">de no-contact</span>
            </span>
          </div>
        )}

        <button
          onClick={onOpenSos}
          className="py-1 sm:py-1.5 px-3 sm:px-3.5 rounded-full bg-[#F6F3F9] hover:bg-[#ECE6F2] border border-[#E3DAEC] text-[#7A638C] text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <span>🌿</span>
          <span className="hidden sm:inline">Pause & Réflexion</span>
          <span className="sm:hidden">Pause</span>
        </button>
      </div>
    </header>
  );
}
