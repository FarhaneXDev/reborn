'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../../lib/auth';
import AppLayout from '../../components/AppLayout';
import { analyticsApi } from '../../lib/api';

function ParametresContent() {
  const { user, updateProfile, logout } = useAuth();

  const [journeyStartDate, setJourneyStartDate] = useState('');
  const [noContactStartDate, setNoContactStartDate] = useState('');
  const [timezone, setTimezone] = useState('Africa/Porto-Novo');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setJourneyStartDate(user.profile.journey_start_date || '');
      setNoContactStartDate(user.profile.no_contact_start_date || '');
      setTimezone(user.profile.timezone || 'Africa/Porto-Novo');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        journey_start_date: journeyStartDate || null,
        no_contact_start_date: noContactStartDate || null,
        timezone,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || "Erreur d'enregistrement des paramètres");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await analyticsApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reborn-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Erreur lors de l'exportation des données");
    }
  };

  const handleResetData = async () => {
    const confirmText = prompt(
      "ATTENTION : Cette action supprimera définitivement toutes vos données de journal, de suivi d'humeur et d'objectifs.\n\nPour confirmer, écrivez 'SUPPRIMER' ci-dessous :"
    );
    if (confirmText !== 'SUPPRIMER') return;

    try {
      await analyticsApi.resetData();
      alert("Toutes vos données ont été réinitialisées.");
      window.location.href = '/';
    } catch (err) {
      alert(err.message || 'Erreur lors de la réinitialisation');
    }
  };

  return (
    <AppLayout>
      <main className="p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto space-y-6 sm:space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#4B7059] uppercase tracking-wider">
            Configuration
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#272522] mt-1">
            Paramètres de mon espace
          </h2>
          <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
            Gérez vos dates de repère, exportez vos écrits ou ajustez votre compte.
          </p>
        </div>

        {/* Form Dates & Profil */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EFE9DE] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base text-[#272522]">Repères temporels</h3>
            {saveSuccess && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#DEECE2] text-[#3E5E4A] font-medium">
                ✓ Enregistré
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-medium text-[#6E685F] mb-1.5">
                Date de début du parcours 30 jours
              </label>
              <input
                type="date"
                value={journeyStartDate}
                onChange={(e) => setJourneyStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE9DE] text-xs sm:text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
              />
              <p className="text-[11px] text-[#8E877E] mt-1">
                Détermine le jour affiché sur votre mission du tableau de bord.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6E685F] mb-1.5">
                Date de début du No-Contact (facultatif)
              </label>
              <input
                type="date"
                value={noContactStartDate}
                onChange={(e) => setNoContactStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE9DE] text-xs sm:text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
              />
              <p className="text-[11px] text-[#8E877E] mt-1">
                Affiche discrètement les jours écoulés sans en faire une compétition.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6E685F] mb-1.5">
                Fuseau horaire
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE9DE] text-xs sm:text-sm text-[#272522] bg-white focus:outline-hidden focus:border-[#4B7059]"
              >
                <option value="Africa/Porto-Novo">Africa/Porto-Novo (Bénin / Afrique Ouest - UTC+1)</option>
                <option value="Europe/Paris">Europe/Paris (France - UTC+1 / UTC+2)</option>
                <option value="America/Montreal">America/Montreal (Canada - UTC-5)</option>
                <option value="UTC">UTC standard</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer mes repères'}
            </button>
          </div>
        </form>

        {/* Export & Confidentialité */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EFE9DE] shadow-xs space-y-4">
          <h3 className="font-semibold text-sm sm:text-base text-[#272522]">Confidentialité & Données personnelles</h3>
          <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed">
            Vos pensées intimes ne sont jamais analysées par des tiers ni partagées. Vous pouvez à tout moment exporter l'intégralité de votre historique au format JSON ou réinitialiser votre compte.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F1F6F3] border border-[#EFE9DE] text-[#272522] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              📥 Exporter toutes mes données (JSON)
            </button>
          </div>
        </div>

        {/* Zone de Danger */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#FADBD8] shadow-xs space-y-4">
          <h3 className="font-semibold text-sm sm:text-base text-[#C55353]">Zone sensible</h3>
          <p className="text-xs sm:text-sm text-[#6E685F]">
            La réinitialisation efface toutes vos entrées de journal, vos humeurs et vos objectifs de la base de données.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={handleResetData}
              className="px-5 py-2.5 rounded-xl bg-[#FDF2F2] hover:bg-[#FADBD8] text-[#C55353] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Effacer toutes mes données
            </button>

            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl border border-[#EFE9DE] text-[#6E685F] hover:bg-[#FAF7F2] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default function ParametresPage() {
  return (
    <AuthProvider>
      <ParametresContent />
    </AuthProvider>
  );
}
