'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../../lib/auth';
import AppLayout from '../../components/AppLayout';
import TodayMissionCard from '../../components/TodayMissionCard';
import { journeysApi } from '../../lib/api';

const THEMES = [
  { id: 'all', label: 'Tout le parcours' },
  { id: 'reperes', label: 'Semaine 1 : Repères' },
  { id: 'estime', label: 'Semaine 2 : Estime' },
  { id: 'souvenirs', label: 'Semaine 3 : Souvenirs' },
  { id: 'avenir', label: 'Semaine 4 : Avenir' },
];

function ParcoursContent() {
  const [missions, setMissions] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [activeMission, setActiveMission] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    try {
      // Récupérer à la fois toutes les missions et celle du jour
      const [allData, todayData] = await Promise.all([
        journeysApi.getAllMissions(),
        journeysApi.getToday().catch(() => null),
      ]);

      const rawList = Array.isArray(allData) ? allData : allData?.results || [];

      // Fusionner la progression fraîche de la mission du jour
      const list = rawList.map((m) => {
        if (todayData?.mission && m.id === todayData.mission.id && todayData.today_progress) {
          return {
            ...m,
            user_progress: todayData.today_progress,
          };
        }
        return m;
      });

      setMissions(list);

      // Mettre à jour la mission active sélectionnée de manière sûre et synchronisée
      if (list.length > 0) {
        setActiveMission((prevActive) => {
          if (!prevActive) {
            const currentDayNum = todayData?.current_day_number || 1;
            return list.find((m) => m.day_number === currentDayNum) || list[0];
          }
          // Toujours actualiser la mission sélectionnée avec ses données fraîches
          return list.find((m) => m.id === prevActive.id) || prevActive;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();

    // Re-synchronisation globale instantanée lors de la complétion d'une mission ou du retour sur l'onglet
    const handleSync = () => fetchMissions();
    window.addEventListener('reborn:mission-progress-updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('reborn:mission-progress-updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handleMissionStatusChange = (newStatus, missionId) => {
    // Mettre à jour immédiatement dans le state local pour une réactivité instantanée
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const updatedProgress = m.user_progress
            ? { ...m.user_progress, mission_status: newStatus }
            : { mission_status: newStatus };
          return { ...m, user_progress: updatedProgress };
        }
        return m;
      })
    );
    setActiveMission((prev) => {
      if (prev?.id === missionId) {
        return {
          ...prev,
          user_progress: prev.user_progress
            ? { ...prev.user_progress, mission_status: newStatus }
            : { mission_status: newStatus },
        };
      }
      return prev;
    });
    // Re-synchroniser avec l'API en arrière-plan
    fetchMissions();
  };

  const filteredMissions = selectedTheme === 'all'
    ? missions
    : missions.filter((m) => m.theme === selectedTheme);

  return (
    <AppLayout>
      <main className="p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#4B7059] uppercase tracking-wider">
            Programme 30 jours
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#272522] mt-1">
            Mon parcours de reconstruction
          </h2>
          <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
            Avancez à votre rythme. Vous pouvez consulter, accomplir ou reprendre n'importe quelle mission selon vos besoins.
          </p>
        </div>

        {/* Theme Filters */}
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                selectedTheme === theme.id
                  ? 'bg-[#4B7059] text-white shadow-xs'
                  : 'bg-white border border-[#EFE9DE] text-[#6E685F] hover:bg-[#FAF7F2] hover:text-[#272522]'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>

        {/* Active Mission Detail View */}
        {activeMission && (
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-[#272522] px-1">Mission sélectionnée</h4>
            <TodayMissionCard
              key={activeMission.id}
              mission={activeMission}
              progress={activeMission.user_progress}
              dayNumber={activeMission.day_number}
              onStatusChange={handleMissionStatusChange}
            />
          </div>
        )}

        {/* 30-Day Grid */}
        <div className="space-y-4">
          <h4 className="text-xs sm:text-sm font-semibold text-[#272522] px-1">Toutes les journées ({filteredMissions.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissions.map((m) => {
              const isSelected = activeMission?.id === m.id;
              const isCompleted = m.user_progress?.mission_status === 'completed';

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveMission(m);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#4B7059] bg-[#F1F6F3] shadow-xs ring-1 ring-[#4B7059]'
                      : 'border-[#EFE9DE] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#4B7059] border border-[#EFE9DE]">
                        Jour {m.day_number}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-[#3E5E4A] font-semibold flex items-center gap-1">
                          <span>✓</span>
                          <span>Fait</span>
                        </span>
                      )}
                    </div>
                    <h5 className="font-semibold text-sm text-[#272522] line-clamp-1">{m.title}</h5>
                    <p className="text-xs text-[#6E685F] mt-1.5 line-clamp-2 leading-relaxed">
                      {m.introduction}
                    </p>
                  </div>
                  <span className="text-xs text-[#4B7059] font-medium mt-4 block">
                    {isSelected ? 'Affichée ci-dessus ↑' : 'Consulter →'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default function ParcoursPage() {
  return (
    <AuthProvider>
      <ParcoursContent />
    </AuthProvider>
  );
}
