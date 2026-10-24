import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const ProjectModal: React.FC = () => {
  const { activeModalProject, initialPlateIndex, closeProjectModal } = useApp();
  const [currentIdx, setCurrentIdx] = useState<number>(initialPlateIndex || 0);

  useEffect(() => {
    setCurrentIdx(initialPlateIndex || 0);
  }, [initialPlateIndex, activeModalProject]);

  useEffect(() => {
    if (!activeModalProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProjectModal();
      if (e.key === 'ArrowLeft') {
        setCurrentIdx((prev) =>
          prev > 0 ? prev - 1 : activeModalProject.plates.length - 1
        );
      }
      if (e.key === 'ArrowRight') {
        setCurrentIdx((prev) =>
          prev < activeModalProject.plates.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalProject, closeProjectModal]);

  if (!activeModalProject) return null;

  const plates = activeModalProject.plates;
  const currentPlate = plates[currentIdx] || plates[0];
  const total = plates.length;
  const curDisplay = (currentIdx + 1) < 10 ? `0${currentIdx + 1}` : `${currentIdx + 1}`;
  const totalDisplay = total < 10 ? `0${total}` : `${total}`;

  const nextPlate = () => {
    setCurrentIdx((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const prevPlate = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
    >
      {/* Immersive Dark Backdrop */}
      <div
        onClick={closeProjectModal}
        className="absolute inset-0 bg-black/92 backdrop-blur-xl cursor-pointer transition-opacity"
      />

      {/* Fullscreen Immersive Stage */}
      <div className="relative w-full h-full flex flex-col z-10 overflow-hidden pointer-events-none">
        {/* Minimal Floating Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white shadow-lg">
            <span className="font-mono text-xs tracking-widest text-neutral-300">
              {curDisplay} / {totalDisplay}
            </span>
          </div>

          <button
            onClick={closeProjectModal}
            aria-label="Close project showcase modal"
            className="pointer-events-auto px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 border border-white/20 font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-2xl transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <span>CLOSE</span>
            <span className="text-sm leading-none">✕</span>
          </button>
        </div>

        {/* Primary Large Image Canvas */}
        <div className="relative flex-1 w-full flex flex-col items-center justify-center p-2 overflow-hidden pt-16 pb-0 pointer-events-none">
          <div
            className="relative m-auto max-h-[68vh] h-[68vh] w-full max-w-[min(94vw,1200px)] overflow-hidden rounded-sm shadow-2xl bg-neutral-950 flex items-center justify-center pointer-events-auto border border-white/10"
          >
            {currentPlate ? (
              <img
                src={currentPlate.src}
                alt={`${activeModalProject.title} Plate ${currentIdx + 1}`}
                className="h-full w-full object-contain block transition-opacity duration-300"
              />
            ) : (
              <div className="text-neutral-500 font-mono text-xs">NO PLATE DATA</div>
            )}

            {/* Left-Bottom Overlay: red typology tag + bold white project title */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-none flex flex-col justify-end text-left max-w-[85%]">
              <span className="font-mono text-[10px] text-[#e63926] font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                [{activeModalProject.typology} / {activeModalProject.year}]
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-white drop-shadow-md">
                {activeModalProject.title}
              </h2>
              {(() => {
                const rawCaption = currentPlate?.caption;
                if (!rawCaption) return null;
                const isFilename =
                  /\.(jpe?g|png|webp|gif|svg|bmp)$/i.test(rawCaption) ||
                  /^(IMG_|KakaoTalk_|screenshot_|Pasted_|image|file)/i.test(rawCaption);
                const displayCaption = isFilename
                  ? `${curDisplay} — ARCHITECTURAL DETAIL & MONOGRAPH COMPOSITION`
                  : rawCaption;
                return (
                  <p className="text-xs text-neutral-300 font-mono mt-1.5 drop-shadow-sm line-clamp-2">
                    {displayCaption}
                  </p>
                );
              })()}
            </div>

            {/* Gradient shadow for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
          </div>

          {/* Prev / Next Navigation Controls */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPlate();
                }}
                aria-label="Previous plate"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white text-black flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 z-20 cursor-pointer pointer-events-auto border border-black/10"
                type="button"
              >
                <span className="font-bold text-lg">←</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPlate();
                }}
                aria-label="Next plate"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white text-black flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 z-20 cursor-pointer pointer-events-auto border border-black/10"
                type="button"
              >
                <span className="font-bold text-lg">→</span>
              </button>
            </>
          )}
        </div>

        {/* Bottom Mini Thumbnail Strip */}
        <div className="w-full shrink-0 z-20 pt-3 pb-6 flex justify-center items-center pointer-events-auto">
          <div className="bg-neutral-900/85 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 flex items-center gap-2 overflow-x-auto max-w-[90vw]">
            {plates.map((plate, idx) => {
              const isActive = idx === currentIdx;
              return (
                <button
                  key={plate.id || idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  className={`relative w-12 h-9 md:w-16 md:h-11 rounded-sm overflow-hidden bg-neutral-900 border transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'ring-2 ring-[#e63926] border-white opacity-100 scale-105'
                      : 'border-white/20 opacity-40 hover:opacity-90'
                  }`}
                >
                  <img
                    src={plate.src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
