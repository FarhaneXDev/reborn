'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../../lib/auth';
import AppLayout from '../../components/AppLayout';
import { goalsApi } from '../../lib/api';

function AvenirContent() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Goal State
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [submittingGoal, setSubmittingGoal] = useState(false);

  // New Action for a Goal
  const [activeGoalForAction, setActiveGoalForAction] = useState(null);
  const [actionDesc, setActionDesc] = useState('');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsApi.getAll();
      const list = Array.isArray(data) ? data : data.results || [];
      setGoals(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    setSubmittingGoal(true);
    try {
      await goalsApi.create({
        title: goalTitle,
        description: goalDesc,
      });
      setGoalTitle('');
      setGoalDesc('');
      setIsCreatingGoal(false);
      fetchGoals();
    } catch (err) {
      alert(err.message || "Erreur de création de l'objectif");
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleAddAction = async (goalId) => {
    if (!actionDesc.trim()) return;
    try {
      await goalsApi.addAction(goalId, { description: actionDesc });
      setActionDesc('');
      setActiveGoalForAction(null);
      fetchGoals();
    } catch (err) {
      alert(err.message || "Erreur d'ajout de l'action");
    }
  };

  const handleToggleAction = async (goalId, actionId, currentStatus) => {
    try {
      await goalsApi.updateAction(goalId, actionId, { is_completed: !currentStatus });
      fetchGoals();
    } catch (err) {
      alert(err.message || 'Erreur');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Supprimer cet objectif et ses actions ?")) return;
    try {
      await goalsApi.delete(goalId);
      fetchGoals();
    } catch (err) {
      alert(err.message || 'Erreur');
    }
  };

  return (
    <AppLayout>
      <main className="p-4 sm:p-6 md:p-10 max-w-5xl w-full mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4B7059] uppercase tracking-wider">
              Reconstruire mes repères
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#272522] mt-1">
              Mon avenir & mes projets
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
              Des objectifs choisis par et pour vous, découpés en petits pas digestes et sans urgence.
            </p>
          </div>

          {!isCreatingGoal && (
            <button
              onClick={() => setIsCreatingGoal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
            >
              + Nouvel objectif
            </button>
          )}
        </div>

        {/* New Goal Form */}
        {isCreatingGoal && (
          <form onSubmit={handleCreateGoal} className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EFE9DE] shadow-xs space-y-4 animate-in fade-in">
            <h3 className="font-semibold text-sm sm:text-base text-[#272522]">Définir un cap personnel</h3>

            <input
              type="text"
              placeholder="Ex : Reprendre une activité sportive douce, Voyager seul un week-end..."
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE9DE] bg-[#FAF7F2]/40 focus:bg-white focus:outline-hidden focus:border-[#4B7059] text-xs sm:text-sm text-[#272522]"
            />

            <textarea
              placeholder="Pourquoi cet objectif me fait du bien (facultatif)..."
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-xl border border-[#EFE9DE] bg-[#FAF7F2]/40 focus:bg-white focus:outline-hidden focus:border-[#4B7059] text-xs sm:text-sm text-[#272522] resize-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingGoal(false)}
                className="px-4 py-2 text-xs sm:text-sm text-[#6E685F]"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submittingGoal}
                className="px-6 py-2.5 rounded-xl bg-[#4B7059] text-white text-xs sm:text-sm font-medium hover:bg-[#3E5E4A] transition-colors cursor-pointer"
              >
                {submittingGoal ? 'Création...' : 'Créer cet objectif'}
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-10 border border-[#EFE9DE] text-center">
            <p className="text-xs sm:text-sm text-[#6E685F]">Chargement des objectifs...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 border border-[#EFE9DE] text-center space-y-3">
            <span className="text-3xl">🌅</span>
            <h4 className="font-semibold text-sm sm:text-base text-[#272522]">Aucun objectif encore défini</h4>
            <p className="text-xs sm:text-sm text-[#6E685F] max-w-sm mx-auto">
              Prenez le temps qu'il vous faut. Quand vous serez prêt, posez une petite envie personnelle pour vous projeter.
            </p>
            <button
              onClick={() => setIsCreatingGoal(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#DEECE2] text-[#3E5E4A] text-xs sm:text-sm font-medium hover:bg-[#d0e3d5] transition-colors cursor-pointer"
            >
              Créer mon premier objectif
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const actions = goal.actions || [];
              const completedCount = actions.filter((a) => a.is_completed).length;

              return (
                <div key={goal.id} className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EFE9DE] shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#272522]">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-xs sm:text-sm text-[#6E685F] mt-1 leading-relaxed">{goal.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-xs text-[#8E877E] hover:text-[#C55353] p-1.5 transition-colors cursor-pointer"
                      title="Supprimer l'objectif"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Actions Checklist */}
                  <div className="space-y-2 pt-2 border-t border-[#F4EFE6]">
                    <div className="flex items-center justify-between text-xs text-[#6E685F] pb-1">
                      <span className="font-semibold">Petites actions ({completedCount}/{actions.length})</span>
                    </div>

                    {actions.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => handleToggleAction(goal.id, act.id, act.is_completed)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          act.is_completed
                            ? 'bg-[#F1F6F3] border-[#DEECE2] text-[#6E685F]'
                            : 'bg-white border-[#EFE9DE] text-[#272522] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                          act.is_completed
                            ? 'bg-[#4B7059] border-[#4B7059] text-white font-bold'
                            : 'border-[#C2BAAC]'
                        }`}>
                          {act.is_completed ? '✓' : ''}
                        </span>
                        <span className={`text-xs sm:text-sm ${act.is_completed ? 'line-through opacity-70' : ''}`}>
                          {act.description}
                        </span>
                      </div>
                    ))}

                    {/* Add Action Input */}
                    {activeGoalForAction === goal.id ? (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Description d'un petit geste..."
                          value={actionDesc}
                          onChange={(e) => setActionDesc(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAction(goal.id);
                            }
                          }}
                          className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#EFE9DE] focus:outline-hidden focus:border-[#4B7059]"
                        />
                        <button
                          onClick={() => handleAddAction(goal.id)}
                          className="px-4 py-2 rounded-xl bg-[#4B7059] text-white text-xs font-medium cursor-pointer"
                        >
                          Ajouter
                        </button>
                        <button
                          onClick={() => setActiveGoalForAction(null)}
                          className="px-3 py-2 text-xs text-[#8E877E] cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveGoalForAction(goal.id)}
                        className="text-xs text-[#4B7059] font-medium hover:underline pt-1 cursor-pointer block"
                      >
                        + Ajouter une petite action
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </AppLayout>
  );
}

export default function AvenirPage() {
  return (
    <AuthProvider>
      <AvenirContent />
    </AuthProvider>
  );
}
