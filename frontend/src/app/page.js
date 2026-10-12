'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '../lib/auth';
import AppLayout from '../components/AppLayout';
import MoodPicker from '../components/MoodPicker';
import TodayMissionCard from '../components/TodayMissionCard';
import { journeysApi } from '../lib/api';

function DashboardContent() {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      const data = await journeysApi.getToday();
      setTodayData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <AppLayout>
      <main className="p-4 sm:p-6 md:p-10 max-w-5xl w-full mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Banner */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#272522]">
            Bonjour{user?.username ? `, ${user.username}` : ''} 🌿
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#6E685F]">
            Bienvenue dans votre havre personnel. Chaque journée est une étape vers vous-même.
          </p>
        </div>

        {/* Grid Layout: Mission du jour & Humeur */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left 2 Cols: Mission du Jour */}
          <div className="lg:col-span-2 space-y-6">
            <TodayMissionCard
              mission={todayData?.mission}
              progress={todayData?.today_progress}
              dayNumber={todayData?.current_day_number}
              onStatusChange={() => fetchToday()}
            />

            {/* Gentle Encouragement Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#F6F3F9] border border-[#ECE6F2] flex items-center gap-4">
              <span className="text-2xl shrink-0">🕊️</span>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#4E3F59]">Rappel bienveillant</h4>
                <p className="text-xs sm:text-sm text-[#7A638C] mt-0.5 leading-relaxed">
                  « La reconstruction n'est pas une ligne droite. Certains jours avancent à grands pas, d'autres demandent simplement de respirer et d'attendre demain. Les deux ont la même valeur. »
                </p>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Suivi Humeur & Accès Rapide */}
          <div className="space-y-6">
            <MoodPicker
              currentMood={todayData?.today_progress?.mood}
              currentIntensity={todayData?.today_progress?.mood_intensity}
              currentReflection={todayData?.today_progress?.reflection}
              onSaved={() => fetchToday()}
            />

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE9DE] shadow-xs space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-[#272522]">Raccourcis utiles</h4>

              <Link
                href="/journal"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F1F6F3] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span>📖</span>
                  <span className="text-xs sm:text-sm font-medium text-[#272522]">Écrire dans mon journal</span>
                </div>
                <span className="text-xs text-[#8E877E] group-hover:text-[#4B7059] transition-colors">→</span>
              </Link>

              <Link
                href="/parcours"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F1F6F3] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span>🌱</span>
                  <span className="text-xs sm:text-sm font-medium text-[#272522]">Voir tout le parcours (30j)</span>
                </div>
                <span className="text-xs text-[#8E877E] group-hover:text-[#4B7059] transition-colors">→</span>
              </Link>

              <Link
                href="/avenir"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F1F6F3] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span>🌅</span>
                  <span className="text-xs sm:text-sm font-medium text-[#272522]">Mes objectifs personnels</span>
                </div>
                <span className="text-xs text-[#8E877E] group-hover:text-[#4B7059] transition-colors">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
