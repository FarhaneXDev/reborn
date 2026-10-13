'use client';

import React, { useState, useEffect } from 'react';
import { journeysApi } from '../lib/api';

const THEME_NAMES = {
  reperes: 'Accueillir et repères',
  estime: 'Estime personnelle',
  souvenirs: 'Vivre avec les souvenirs',
  avenir: 'Réinvestir l\'avenir',
};

export default function TodayMissionCard({ mission, progress, dayNumber, onStatusChange }) {
  const [showGentle, setShowGentle] = useState(false);
  const [status, setStatus] = useState(progress?.mission_status || 'not_started');
  const [updating, setUpdating] = useState(false);

  // Synchronisation dynamique du statut dès que la mission sélectionnée ou son progrès change
  useEffect(() => {
    setStatus(progress?.mission_status || 'not_started');
    setShowGentle(false);
  }, [mission?.id, progress?.mission_status]);

  if (!mission) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#EFE9DE] text-center">
        <p className="text-sm text-[#6E685F]">Chargement de la mission...</p>
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await journeysApi.saveProgress({
        local_date: todayStr,
        mission_id: mission.id,
        mission_status: newStatus,
      });
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus, mission.id);
    } catch (err) {
      alert(err.message || "Erreur de mise à jour du statut");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EFE9DE] shadow-xs relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#DEECE2]/30 rounded-bl-full pointer-events-none -mr-8 -mt-8" />

      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#DEECE2] text-[#3E5E4A] text-xs font-semibold">
            Jour {mission.day_number || dayNumber || 1}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#6E685F] text-xs font-medium border border-[#EFE9DE]">
            {THEME_NAMES[mission.theme] || mission.theme}
          </span>
        </div>

        {/* Status Badge */}
        {status === 'completed' && (
          <span className="px-3 py-1 rounded-full bg-[#DEECE2] text-[#3E5E4A] text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <span>✓</span>
            <span>Mission terminée</span>
          </span>
        )}
        {status === 'in_progress' && (
          <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#4B7059] text-xs font-medium border border-[#DEECE2] animate-in fade-in">
            En cours
          </span>
        )}
        {status === 'skipped' && (
          <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8E877E] text-xs font-medium animate-in fade-in">
            Reportée sans pression
          </span>
        )}
      </div>

      {/* Mission Title & Intro */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#272522] mb-3 leading-snug">
        {mission.title}
      </h3>
      <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed mb-6">
        {mission.introduction}
      </p>

      {/* Gentle Variant Toggle */}
      {mission.gentle_version && (
        <div className="mb-6">
          <button
            onClick={() => setShowGentle(!showGentle)}
            className="text-xs font-medium text-[#7A638C] bg-[#F6F3F9] hover:bg-[#ECE6F2] border border-[#E3DAEC] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>🍃</span>
            <span>{showGentle ? 'Voir la mission principale' : 'Journée difficile ? Découvrir la variante douce'}</span>
          </button>
        </div>
      )}

      {/* Content Card (Standard or Gentle) */}
      <div className="space-y-4">
        {showGentle ? (
          <div className="p-5 rounded-2xl bg-[#F6F3F9] border border-[#ECE6F2] space-y-2 animate-in fade-in">
            <span className="text-xs font-semibold text-[#7A638C] uppercase tracking-wider">Variante douce</span>
            <p className="text-xs sm:text-sm text-[#4E3F59] leading-relaxed">{mission.gentle_version}</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {mission.reflection_prompt && (
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE9DE]">
                <span className="text-xs font-semibold text-[#4B7059] uppercase tracking-wider block mb-1">
                  Question de réflexion
                </span>
                <p className="text-xs sm:text-sm text-[#272522] italic">« {mission.reflection_prompt} »</p>
              </div>
            )}

            {mission.exercise && (
              <div className="p-4 rounded-2xl bg-[#F1F6F3]/50 border border-[#DEECE2]">
                <span className="text-xs font-semibold text-[#3E5E4A] uppercase tracking-wider block mb-1">
                  Exercice suggéré
                </span>
                <p className="text-xs sm:text-sm text-[#272522] leading-relaxed">{mission.exercise}</p>
              </div>
            )}

            {mission.main_action && (
              <div className="p-4 rounded-2xl bg-white border border-[#EFE9DE] shadow-2xs">
                <span className="text-xs font-semibold text-[#6E685F] uppercase tracking-wider block mb-1">
                  Petite action du jour
                </span>
                <p className="text-xs sm:text-sm text-[#272522] font-medium">{mission.main_action}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-5 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {status !== 'completed' ? (
            <button
              onClick={() => handleUpdateStatus('completed')}
              disabled={updating}
              className="px-5 py-2.5 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {updating ? 'Validation...' : '✓ Marquer comme terminée'}
            </button>
          ) : (
            <button
              onClick={() => handleUpdateStatus('in_progress')}
              disabled={updating}
              title="Cliquez pour remettre cette mission en cours si vous souhaitez la retravailler"
              className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DE] text-[#6E685F] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>↺</span>
              <span>Remettre en cours</span>
            </button>
          )}

          {status !== 'completed' && status !== 'in_progress' && (
            <button
              onClick={() => handleUpdateStatus('in_progress')}
              disabled={updating}
              className="px-4 py-2.5 rounded-xl bg-[#F1F6F3] hover:bg-[#DEECE2] text-[#3E5E4A] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Commencer
            </button>
          )}
        </div>

        {status !== 'completed' && (
          <button
            onClick={() => handleUpdateStatus('skipped')}
            disabled={updating}
            className="text-xs text-[#8E877E] hover:text-[#272522] transition-colors cursor-pointer"
          >
            Reporter pour aujourd'hui
          </button>
        )}
      </div>
    </div>
  );
}
