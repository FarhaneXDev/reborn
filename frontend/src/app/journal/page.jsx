'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../../lib/auth';
import AppLayout from '../../components/AppLayout';
import { journalApi } from '../../lib/api';

const DEFAULT_TAGS = ['souvenirs', 'estime', 'avenir', 'solitude', 'gratitude', 'émotions'];

function JournalContent() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [mood, setMood] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await journalApi.getAll(activeTag, search);
      const list = Array.isArray(data) ? data : data.results || [];
      setEntries(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [activeTag, search]);

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await journalApi.create({
        title,
        content,
        tags: selectedTags,
        mood,
      });
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setMood('');
      setIsCreating(false);
      fetchEntries();
    } catch (err) {
      alert(err.message || "Erreur lors de l'enregistrement de l'écrit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Êtes-vous certain de vouloir supprimer cette page ? Cette action est irréversible.")) {
      return;
    }
    try {
      await journalApi.delete(id);
      fetchEntries();
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <AppLayout>
      <main className="p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4B7059] uppercase tracking-wider">
              Espace d'écriture intime
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#272522] mt-1">
              Mon journal personnel
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
              Écrivez sans filtre ni obligation de cohérence. Vos écrits vous appartiennent exclusivement.
            </p>
          </div>

          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-5 py-2.5 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
            >
              + Nouvelle page
            </button>
          )}
        </div>

        {/* New Entry Form */}
        {isCreating && (
          <form onSubmit={handleCreateEntry} className="bg-white rounded-3xl p-5 sm:p-8 border border-[#EFE9DE] shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base text-[#272522]">Nouvel écrit</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-[#8E877E] hover:text-[#272522]"
              >
                Annuler
              </button>
            </div>

            <input
              type="text"
              placeholder="Titre de la réflexion (facultatif)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE9DE] bg-[#FAF7F2]/40 focus:bg-white focus:outline-hidden focus:border-[#4B7059] text-xs sm:text-sm text-[#272522]"
            />

            <textarea
              placeholder="Déposez ici vos pensées, doutes, souvenirs ou espoirs..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              required
              className="w-full p-4 rounded-2xl border border-[#EFE9DE] bg-[#FAF7F2]/40 focus:bg-white focus:outline-hidden focus:border-[#4B7059] text-xs sm:text-sm text-[#272522] resize-y"
            />

            {/* Tags Selector */}
            <div>
              <span className="text-xs text-[#6E685F] block mb-2">Thèmes associés (facultatif) :</span>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_TAGS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selectedTags.includes(t)
                        ? 'bg-[#DEECE2] text-[#3E5E4A] border border-[#4B7059]'
                        : 'bg-[#FAF7F2] text-[#6E685F] border border-[#EFE9DE] hover:bg-[#F1F6F3]'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#F4EFE6]">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs sm:text-sm text-[#6E685F] hover:text-[#272522]"
              >
                Abandonner
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#4B7059] hover:bg-[#3E5E4A] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Enregistrement...' : 'Enregistrer dans mon journal'}
              </button>
            </div>
          </form>
        )}

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Rechercher dans mes écrits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-[#EFE9DE] bg-white text-xs sm:text-sm text-[#272522] focus:outline-hidden focus:border-[#4B7059]"
          />
          <div className="flex flex-wrap gap-1.5 items-center">
            {activeTag && (
              <button
                onClick={() => setActiveTag('')}
                className="px-3 py-1.5 rounded-xl text-xs bg-[#FDF2F2] text-[#C55353] border border-[#FADBD8]"
              >
                Filtre #{activeTag} ✕
              </button>
            )}
          </div>
        </div>

        {/* Entries Timeline */}
        {loading ? (
          <div className="bg-white rounded-3xl p-10 border border-[#EFE9DE] text-center">
            <p className="text-xs sm:text-sm text-[#6E685F]">Chargement des écrits...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 border border-[#EFE9DE] text-center space-y-3">
            <span className="text-3xl">🪶</span>
            <h4 className="font-semibold text-sm sm:text-base text-[#272522]">Votre journal est encore vierge</h4>
            <p className="text-xs sm:text-sm text-[#6E685F] max-w-sm mx-auto">
              Il n'y a aucune attente de style ou de longueur. Même trois lignes peuvent soulager votre esprit aujourd'hui.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#DEECE2] text-[#3E5E4A] text-xs sm:text-sm font-medium hover:bg-[#d0e3d5] transition-colors cursor-pointer"
            >
              Écrire mes premiers mots
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EFE9DE] shadow-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4B7059]">
                    {entry.entry_date || entry.created_at?.slice(0, 10)}
                  </span>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-xs text-[#8E877E] hover:text-[#C55353] p-1 rounded transition-all cursor-pointer"
                    title="Supprimer cette entrée"
                  >
                    🗑️
                  </button>
                </div>

                {entry.title && (
                  <h4 className="text-base sm:text-lg font-bold text-[#272522]">
                    {entry.title}
                  </h4>
                )}

                <p className="text-xs sm:text-sm text-[#272522] whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </p>

                {Array.isArray(entry.tags) && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {entry.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#FAF7F2] text-[#6E685F] border border-[#EFE9DE] hover:bg-[#F1F6F3]"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}

export default function JournalPage() {
  return (
    <AuthProvider>
      <JournalContent />
    </AuthProvider>
  );
}
