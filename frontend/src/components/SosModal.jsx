'use client';

import React, { useState, useEffect } from 'react';

export default function SosModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [breathePhase, setBreathePhase] = useState('Inspirez');
  const [breatheCount, setBreatheCount] = useState(4);
  const [unsentMessage, setUnsentMessage] = useState('');
  const [selectedHope, setSelectedHope] = useState('');

  // Animation et rythme de respiration 4-7-8
  useEffect(() => {
    if (!isOpen || step !== 1) return;

    let timer;
    const runCycle = () => {
      // 1. Inspirer (4s)
      setBreathePhase('Inspirez doucement...');
      setBreatheCount(4);
      let count = 4;
      const countInterval = setInterval(() => {
        count -= 1;
        setBreatheCount(Math.max(1, count));
      }, 1000);

      timer = setTimeout(() => {
        clearInterval(countInterval);
        // 2. Retenir (7s)
        setBreathePhase('Retenez votre souffle...');
        setBreatheCount(7);
        let holdCount = 7;
        const holdInterval = setInterval(() => {
          holdCount -= 1;
          setBreatheCount(Math.max(1, holdCount));
        }, 1000);

        timer = setTimeout(() => {
          clearInterval(holdInterval);
          // 3. Expirer (8s)
          setBreathePhase('Expirez lentement par la bouche...');
          setBreatheCount(8);
          let expCount = 8;
          const expInterval = setInterval(() => {
            expCount -= 1;
            setBreatheCount(Math.max(1, expCount));
          }, 1000);

          timer = setTimeout(() => {
            clearInterval(expInterval);
            runCycle();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setUnsentMessage('');
    setSelectedHope('');
    onClose();
  };

  const hopesList = [
    'Me sentir moins seul(e) ou soulager le vide',
    'Obtenir des explications ou des excuses',
    'Vérifier si je lui manque encore',
    'Exprimer ce que j\'ai sur le cœur',
    'Retrouver une sensation de contrôle',
  ];

  const alternativesList = [
    { title: 'Éloigner le téléphone', desc: 'Posez votre appareil dans une autre pièce pendant 20 minutes.', icon: '📱' },
    { title: 'Sortir marcher', desc: 'Prenez l\'air et observez simplement ce qui vous entoure sans musique.', icon: '🚶' },
    { title: 'Boire un grand verre d\'eau fraîche', desc: 'Le contact physique de l\'eau fraîche aide le système nerveux à s\'apaiser.', icon: '💧' },
    { title: 'Contacter un(e) ami(e) neutre', desc: 'Échangez avec quelqu\'un qui n\'a rien à voir avec cette histoire.', icon: '💬' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-[#EFE9DE] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE6]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌿</span>
            <div>
              <h3 className="font-semibold text-lg text-[#272522]">Espace d'apaisement</h3>
              <p className="text-xs text-[#6E685F]">Étape {step} sur 4 — Une pause entre l'impulsion et l'action</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#8E877E] hover:text-[#272522] text-sm p-1.5 rounded-lg hover:bg-[#FAF7F2] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenu selon l'étape */}
        <div className="py-6">
          {step === 1 && (
            <div className="text-center space-y-6">
              <div>
                <h4 className="text-base font-medium text-[#272522]">Commençons par respirer ensemble</h4>
                <p className="text-xs sm:text-sm text-[#6E685F] mt-1 max-w-md mx-auto">
                  L'envie d'écrire monte souvent comme une vague intense dans le corps. Donnez-vous juste quelques secondes avant de décider quoi que ce soit.
                </p>
              </div>

              {/* Cercle animé de respiration */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-[#DEECE2]/50 border-2 border-[#4B7059]/30 flex flex-col items-center justify-center animate-breathe shadow-inner">
                  <span className="text-2xl font-bold text-[#3E5E4A]">{breatheCount}</span>
                  <span className="text-[11px] font-medium text-[#4B7059] px-2 text-center mt-1">{breathePhase}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#4B7059] text-white font-medium text-sm hover:bg-[#3E5E4A] transition-colors cursor-pointer shadow-xs"
                >
                  Je me sens un peu plus calme →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-medium text-[#272522]">Qu'espérez-vous obtenir par ce message ?</h4>
                <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
                  Identifier le besoin derrière l'envie permet de comprendre ce qui vous manque réellement en ce moment.
                </p>
              </div>

              <div className="space-y-2">
                {hopesList.map((hope) => (
                  <button
                    key={hope}
                    onClick={() => setSelectedHope(hope)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all cursor-pointer ${
                      selectedHope === hope
                        ? 'border-[#4B7059] bg-[#F1F6F3] text-[#3E5E4A] font-medium'
                        : 'border-[#EFE9DE] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] text-[#272522]'
                    }`}
                  >
                    {hope}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#F6F3F9] border border-[#ECE6F2] text-xs sm:text-sm text-[#7A638C]">
                💡 <strong>Rappel bienveillant :</strong> Est-ce que cette personne est réellement capable de vous apporter cela aujourd'hui, sans réveiller davantage de douleur ?
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-[#6E685F] hover:text-[#272522]"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#4B7059] text-white font-medium text-sm hover:bg-[#3E5E4A] transition-colors cursor-pointer"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-medium text-[#272522]">La lettre non envoyée</h4>
                <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
                  Écrivez ici tout ce que vous aviez l'intention d'envoyer. Ce texte reste strictement temporaire sur votre écran et ne sera jamais envoyé.
                </p>
              </div>

              <textarea
                value={unsentMessage}
                onChange={(e) => setUnsentMessage(e.target.value)}
                placeholder="Écrivez librement sans retenue ni peur du jugement..."
                rows={6}
                className="w-full p-4 rounded-2xl border border-[#EFE9DE] bg-[#FAF7F2]/40 focus:bg-white focus:outline-hidden focus:border-[#4B7059] text-sm text-[#272522] resize-none"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-[#6E685F] hover:text-[#272522]"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#4B7059] text-white font-medium text-sm hover:bg-[#3E5E4A] transition-colors cursor-pointer"
                >
                  J'ai vidé mon sac →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-medium text-[#272522]">Une alternative pour les prochaines minutes</h4>
                <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
                  Bravo d'avoir pris ce temps pour vous. Choisissez maintenant une petite action saine pour changer d'ambiance mentale :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternativesList.map((alt) => (
                  <div
                    key={alt.title}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE9DE] flex gap-3 items-start"
                  >
                    <span className="text-xl shrink-0 mt-0.5">{alt.icon}</span>
                    <div>
                      <h5 className="font-medium text-xs sm:text-sm text-[#272522]">{alt.title}</h5>
                      <p className="text-[11px] sm:text-xs text-[#6E685F] mt-0.5">{alt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#4B7059] text-white font-medium text-sm hover:bg-[#3E5E4A] transition-colors cursor-pointer shadow-xs"
                >
                  Terminer et refermer cet espace sereinement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
