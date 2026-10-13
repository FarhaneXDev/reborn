'use client';

import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenSos, userProfile, onToggleMobileMenu }) {
  const [todayFormatted, setTodayFormatted] = useState('');
  const [noContactDays, setNoContactDays] = useState(null);

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(now);
    setTodayFormatted(formatted);

    if (userProfile?.no_contact_start_date) {
      // Découper la date sans passer par le parseur UTC de Date(string)
      // pour éviter les décalages de fuseau horaire entre navigateurs/appareils
      const [sYear, sMonth, sDay] = userProfile.no_contact_start_date.split('-').map(Number);
      const tYear = now.getFullYear();
      const tMonth = now.getMonth();
      const tDay = now.getDate();

      // Comparaison en jours calendaires inclusifs :
      // Le 10 octobre est le Jour 1, le 11 est le Jour 2, le 12 est le Jour 3
      const startUtc = Date.UTC(sYear, sMonth - 1, sDay);
      const todayUtc = Date.UTC(tYear, tMonth, tDay);

      const diffDays = Math.round((todayUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 1) {
        setNoContactDays(diffDays);
      } else {
        setNoContactDays(null);
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
