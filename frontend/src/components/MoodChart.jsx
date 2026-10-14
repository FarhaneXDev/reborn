'use client';

import React, { useState } from 'react';

const MOOD_LEVELS = [
  { score: 5, label: 'Très bien', icon: '☀️', color: '#CA8A04', bg: '#FEFCE8' },
  { score: 4, label: 'Bien', icon: '🌤️', color: '#4B7059', bg: '#DEECE2' },
  { score: 3, label: 'Neutre', icon: '⛅', color: '#D97706', bg: '#FEF3C7' },
  { score: 2, label: 'Bas', icon: '☁️', color: '#3B82F6', bg: '#DBEAFE' },
  { score: 1, label: 'Très bas', icon: '🌧️', color: '#64748B', bg: '#F1F5F9' },
];

function formatDate(dateStr) {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
  } catch {
    return dateStr.slice(5);
  }
}

function formatDateLong(dateStr) {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }).format(date);
  } catch {
    return dateStr;
  }
}

export default function MoodChart({ trend = [] }) {
  const [activePoint, setActivePoint] = useState(null);
  const [chartView, setChartView] = useState('curve'); // 'curve' | 'bars'

  if (!trend || trend.length === 0) {
    return (
      <div className="py-12 px-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE9DE] text-center space-y-2">
        <span className="text-3xl block">🌤️</span>
        <h4 className="text-sm font-semibold text-[#272522]">Aucune humeur enregistrée</h4>
        <p className="text-xs text-[#6E685F] max-w-md mx-auto leading-relaxed">
          Rendez-vous sur votre tableau de bord pour enregistrer votre premier ressenti du jour. Vos données s'afficheront ici automatiquement.
        </p>
      </div>
    );
  }

  // Dimensions SVG
  const width = 720;
  const height = 240;
  const padLeft = 85;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 35;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const getY = (score) => padTop + (5 - score) * (chartHeight / 4);

  const getX = (index) => {
    if (trend.length === 1) return padLeft + chartWidth / 2;
    return padLeft + (index / (trend.length - 1)) * chartWidth;
  };

  const points = trend.map((entry, idx) => ({
    x: getX(idx),
    y: getY(entry.score),
    ...entry,
    meta: MOOD_LEVELS.find((m) => m.score === entry.score) || MOOD_LEVELS[2],
  }));

  // Calcul du tracé Bézier fluide pour 2+ points
  let curvePath = '';
  let areaPath = '';

  if (points.length === 2) {
    curvePath = `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    areaPath = `${curvePath} L ${points[1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`;
  } else if (points.length > 2) {
    curvePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      curvePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    areaPath = `${curvePath} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`;
  }

  const isSingle = trend.length === 1;
  const singlePoint = points[0];

  return (
    <div className="space-y-4">
      {/* Contrôles d'affichage */}
      <div className="flex items-center justify-between text-xs pb-1">
        <span className="text-[#6E685F] font-medium">
          {trend.length} enregistrement{trend.length > 1 ? 's' : ''} sur la période
        </span>
        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE9DE]">
          <button
            onClick={() => setChartView('curve')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              chartView === 'curve' ? 'bg-white text-[#272522] shadow-2xs font-semibold' : 'text-[#6E685F] hover:text-[#272522]'
            }`}
          >
            📈 Courbe
          </button>
          <button
            onClick={() => setChartView('bars')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              chartView === 'bars' ? 'bg-white text-[#272522] shadow-2xs font-semibold' : 'text-[#6E685F] hover:text-[#272522]'
            }`}
          >
            📊 Piliers
          </button>
        </div>
      </div>

      {chartView === 'curve' ? (
        /* Vue Graphique SVG fluide */
        <div className="relative bg-[#FAF7F2]/40 rounded-2xl p-2 sm:p-4 border border-[#EFE9DE]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-64 overflow-visible select-none"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4B7059" stopOpacity="0.28" />
                <stop offset="85%" stopColor="#4B7059" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#4B7059" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Lignes repères horizontales Y */}
            {MOOD_LEVELS.map((lvl) => {
              const y = getY(lvl.score);
              return (
                <g key={lvl.score}>
                  {/* Ligne pointillée */}
                  <line
                    x1={padLeft - 5}
                    y1={y}
                    x2={width - padRight + 10}
                    y2={y}
                    stroke="#E8E2D5"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  {/* Label Y */}
                  <text
                    x={padLeft - 12}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#6E685F"
                    fontSize="10"
                    fontWeight="500"
                    className="font-sans"
                  >
                    {lvl.icon} {lvl.label}
                  </text>
                </g>
              );
            })}

            {/* Tracé de zone sous la courbe (si 2+ points) */}
            {!isSingle && areaPath && (
              <path d={areaPath} fill="url(#curveGradient)" />
            )}

            {/* Tracé de la ligne principale (si 2+ points) */}
            {!isSingle && curvePath && (
              <path
                d={curvePath}
                fill="none"
                stroke="#4B7059"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Cas spécial : 1 seul point enregistré */}
            {isSingle && (
              <g>
                {/* Ligne verticale de repère du point jusqu'en bas */}
                <line
                  x1={singlePoint.x}
                  y1={padTop + chartHeight}
                  x2={singlePoint.x}
                  y2={singlePoint.y}
                  stroke="#4B7059"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                {/* Halo d'accentuation animé */}
                <circle
                  cx={singlePoint.x}
                  cy={singlePoint.y}
                  r="20"
                  fill="#DEECE2"
                  opacity="0.7"
                />
                <circle
                  cx={singlePoint.x}
                  cy={singlePoint.y}
                  r="12"
                  fill="#4B7059"
                  opacity="0.2"
                />
                {/* Badge au-dessus du point */}
                <rect
                  x={singlePoint.x - 65}
                  y={singlePoint.y - 36}
                  width="130"
                  height="26"
                  rx="8"
                  fill="#272522"
                />
                <text
                  x={singlePoint.x}
                  y={singlePoint.y - 19}
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {singlePoint.meta.icon} {singlePoint.meta.label} ({singlePoint.score}/5)
                </text>
              </g>
            )}

            {/* Points de données interactifs */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                className="cursor-pointer transition-transform duration-150"
                onMouseEnter={() => setActivePoint(pt)}
                onMouseLeave={() => setActivePoint(null)}
                onClick={() => setActivePoint(activePoint?.date === pt.date ? null : pt)}
              >
                {/* Zone de clic invisible élargie */}
                <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                {/* Point extérieur */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSingle ? 8 : (activePoint?.date === pt.date ? 8 : 6)}
                  fill="white"
                  stroke="#4B7059"
                  strokeWidth={isSingle ? 3 : 2.5}
                />
                {/* Point intérieur */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSingle ? 4 : (activePoint?.date === pt.date ? 4.5 : 3)}
                  fill="#4B7059"
                />

                {/* Date en bas de l'axe X */}
                <text
                  x={pt.x}
                  y={padTop + chartHeight + 20}
                  textAnchor="middle"
                  fill={activePoint?.date === pt.date ? '#272522' : '#8E877E'}
                  fontSize="10"
                  fontWeight={activePoint?.date === pt.date ? '700' : '500'}
                >
                  {formatDate(pt.date)}
                </text>
              </g>
            ))}

            {/* Infobulle flottante au survol (quand 2+ points) */}
            {!isSingle && activePoint && (
              <g pointerEvents="none">
                <rect
                  x={Math.max(padLeft, Math.min(width - padRight - 130, activePoint.x - 65))}
                  y={Math.max(10, activePoint.y - 42)}
                  width="130"
                  height="32"
                  rx="8"
                  fill="#272522"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                />
                <text
                  x={Math.max(padLeft, Math.min(width - padRight - 130, activePoint.x - 65)) + 65}
                  y={Math.max(10, activePoint.y - 42) + 16}
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {activePoint.meta.icon} {activePoint.meta.label} ({activePoint.score}/5)
                </text>
                <text
                  x={Math.max(padLeft, Math.min(width - padRight - 130, activePoint.x - 65)) + 65}
                  y={Math.max(10, activePoint.y - 42) + 27}
                  fill="#CFC9BE"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {formatDateLong(activePoint.date)}
                </text>
              </g>
            )}
          </svg>

          {/* Message bienveillant lorsque 1 seul point est présent */}
          {isSingle && (
            <div className="mt-3 p-3.5 rounded-xl bg-white border border-[#EFE9DE] flex items-center gap-3">
              <span className="text-xl shrink-0">🌱</span>
              <p className="text-xs text-[#6E685F] leading-relaxed">
                <strong className="text-[#272522]">Première note bien enregistrée :</strong> Votre point apparaît au niveau{' '}
                <strong className="text-[#3E5E4A]">{singlePoint.meta.icon} {singlePoint.meta.label}</strong>. Dès que vous noterez une 2ème journée, une courbe continue se dessinera pour relier vos journées.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Vue Piliers journaliers détaillés */
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {points.map((pt, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 border border-[#EFE9DE] flex flex-col justify-between items-center text-center space-y-2.5 shadow-2xs hover:border-[#4B7059] transition-colors"
              >
                <span className="text-[11px] font-semibold text-[#8E877E] uppercase tracking-wider">
                  {formatDate(pt.date)}
                </span>

                {/* Jauge verticale */}
                <div className="w-8 h-24 bg-[#FAF7F2] rounded-full p-1 flex flex-col justify-end items-center border border-[#EFE9DE]">
                  <div
                    className="w-full rounded-full transition-all duration-300 flex items-center justify-center text-xs"
                    style={{
                      height: `${(pt.score / 5) * 100}%`,
                      backgroundColor: pt.meta.bg === '#FEFCE8' ? '#FEF08A' : pt.meta.bg,
                      border: `1.5px solid ${pt.meta.color}`,
                    }}
                  />
                </div>

                <div className="space-y-0.5">
                  <span className="text-lg block leading-none">{pt.meta.icon}</span>
                  <span className="text-xs font-semibold text-[#272522] block">{pt.meta.label}</span>
                  <span className="text-[10px] text-[#8E877E] block">{pt.score} / 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Légende horizontale */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F4EFE6] text-xs text-[#8E877E]">
        <div className="flex flex-wrap items-center gap-3">
          {MOOD_LEVELS.map((lvl) => (
            <span key={lvl.score} className="flex items-center gap-1 text-[11px]">
              <span>{lvl.icon}</span>
              <span>{lvl.label}</span>
            </span>
          ))}
        </div>
        <span className="text-[11px] text-[#6E685F] italic">Échelle de 1 (très bas) à 5 (très bien)</span>
      </div>
    </div>
  );
}
