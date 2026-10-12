'use client';

import React, { useState } from 'react';
import { journeysApi } from '../lib/api';

const MOODS = [
  { key: 'very_low', label: 'Très bas', icon: '🌧️', color: 'hover:bg-slate-100 border-slate-200' },
  { key: 'low', label: 'Bas', icon: '☁️', color: 'hover:bg-blue-50 border-blue-200' },
  { key: 'neutral', label: 'Neutre', icon: '⛅', color: 'hover:bg-amber-50 border-amber-200' },
  { key: 'good', label: 'Bien', icon: '🌤️', color: 'hover:bg-emerald-50 border-emerald-200' },
  { key: 'very_good', label: 'Très bien', icon: '☀️', color: 'hover:bg-yellow-50 border-yellow-200' },
];

export default function MoodPicker({ currentMood, currentIntensity, currentReflection, onSaved }) {
  const [mood, setMood] = useState(currentMood || '');
  const [intensity, setIntensity] = useState(currentIntensity || 3);
  const [reflection, setReflection] = useState(currentReflection || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    if (!mood) return;
    setSaving(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await journeysApi.saveProgress({
        local_date: todayStr,
        mood,
        mood_intensity: intensity,
        reflection,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      if (onSaved) onSaved({ mood, intensity, reflection });
    } catch (err) {
      alert(err.message || "Erreur lors de l'enregistrement de l'humeur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EFE9DE] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-[#272522]">Comment vous sentez-vous aujourd'hui ?</h3>
          <p className="text-xs text-[#6E685F] mt-0.5">Accueillez votre ressenti sans chercher à le modifier.</p>
        </div>
        {savedSuccess && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#DEECE2] text-[#3E5E4A] font-medium animate-in fade-in">
            ✓ Enregistré
          </span>
        )}
      </div>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 py-2">
        {MOODS.map((m) => {
          const isSelected = mood === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                isSelected
                  ? 'border-[#4B7059] bg-[#F1F6F3] shadow-xs scale-102 font-medium text-[#3E5E4A]'
                  : `border-[#EFE9DE] bg-[#FAF7F2]/50 text-[#6E685F] ${m.color}`
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-xs">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Intensity Selector if mood chosen */}
      {mood && (
        <div className="mt-5 pt-4 border-t border-[#F4EFE6] space-y-4 animate-in fade-in">
          <div>
            <div className="flex justify-between text-xs text-[#6E685F] mb-1.5">
              <span>Intensité du ressenti</span>
              <span className="font-semibold text-[#272522]">{intensity} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#4B7059] cursor-pointer"
            />
          </div>

          <div>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Un mot ou une pensée libre sur ce ressenti (facultatif)..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#EFE9DE] bg-[#FAF7F2]/40 focus:bg-white focus:outline-hidden focus:border-[#4B7059] text-[#272522]"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Valider mon humeur'}
          </button>
        </div>
      )}
    </div>
  );
}
