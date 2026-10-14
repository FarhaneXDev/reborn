'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthProvider } from '../../lib/auth';
import AppLayout from '../../components/AppLayout';
import MoodChart from '../../components/MoodChart';
import { analyticsApi } from '../../lib/api';

const PERIODS = [
  { id: '7d', label: '7 derniers jours' },
  { id: '30d', label: '30 jours' },
  { id: '90d', label: '90 jours' },
];

const MOOD_LABELS = {
  1: 'Très bas',
  2: 'Bas',
  3: 'Neutre',
  4: 'Bien',
  5: 'Très bien',
};

function StatistiquesContent() {
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getSummary(period);
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const moodTrend = stats?.mood_trend || [];

  return (
    <AppLayout>
      <main className="p-4 sm:p-6 md:p-10 max-w-5xl w-full mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4B7059] uppercase tracking-wider">
              Observation sans jugement
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#272522] mt-1">
              Mes tendances personnelles
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
              Ces repères servent à observer vos rythmes avec bienveillance. Ils ne constituent pas une note de valeur.
            </p>
          </div>

          {/* Period Switcher */}
          <div className="flex gap-1.5 p-1 bg-white border border-[#EFE9DE] rounded-xl self-start sm:self-auto">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  period === p.id
                    ? 'bg-[#4B7059] text-white'
                    : 'text-[#6E685F] hover:text-[#272522]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Factual Weekly Message Box */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#F1F6F3] border border-[#DEECE2] flex items-start gap-4">
          <span className="text-2xl shrink-0 mt-0.5">🌱</span>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-semibold text-[#3E5E4A]">Bilan descriptif</h4>
            <p className="text-xs sm:text-sm text-[#272522] leading-relaxed">
              {stats?.weekly_summary || "Vous commencez votre suivi. Chaque donnée enregistrée aide à mieux comprendre vos cycles."}
            </p>
          </div>
        </div>

        {/* Key Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE9DE] shadow-xs">
            <span className="text-xs text-[#8E877E] uppercase font-semibold tracking-wider">
              Humeur notée
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#272522] mt-2">
              {stats?.mood_entries_count || 0}
            </div>
            <p className="text-xs text-[#6E685F] mt-1">jours renseignés sur la période</p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE9DE] shadow-xs">
            <span className="text-xs text-[#8E877E] uppercase font-semibold tracking-wider">
              Missions accomplies
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#4B7059] mt-2">
              {stats?.completed_missions_count || 0}
            </div>
            <p className="text-xs text-[#6E685F] mt-1">étapes du parcours franchies</p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE9DE] shadow-xs">
            <span className="text-xs text-[#8E877E] uppercase font-semibold tracking-wider">
              Actions pour soi
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#7A638C] mt-2">
              {stats?.completed_actions_count || 0}
            </div>
            <p className="text-xs text-[#6E685F] mt-1">petits gestes concrets réalisés</p>
            <Link
              href="/avenir"
              className="text-[11px] text-[#7A638C] hover:underline font-medium inline-flex items-center gap-1 mt-2.5"
            >
              <span>→ Définir mes actions dans "Mon avenir"</span>
            </Link>
          </div>
        </div>

        {/* Mood Trend Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EFE9DE] shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#272522]">Évolution de l'humeur</h3>
            <p className="text-xs text-[#6E685F] mt-0.5">
              Une humeur plus basse n'est pas un échec, c'est une vague naturelle qui se traverse.
            </p>
          </div>

          <MoodChart trend={moodTrend} />
        </div>
      </main>
    </AppLayout>
  );
}

export default function StatistiquesPage() {
  return (
    <AuthProvider>
      <StatistiquesContent />
    </AuthProvider>
  );
}
