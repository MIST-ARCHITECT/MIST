import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

export const WorksPage: React.FC = () => {
  const { projects, openProjectModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [displayCount, setDisplayCount] = useState<number>(12);

  const categories = [
    'ALL',
    'Residential',
    'Commercial',
    'Workplace',
    'Culture',
    'Public',
    'Renovation'
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    const cat = (p.category || '').toLowerCase();
    const target = selectedCategory.toLowerCase();
    const typo = (p.typology || '').toLowerCase();

    if (target === 'residential') return cat === 'residential' || typo.includes('residential');
    if (target === 'commercial') return cat === 'commercial' || typo.includes('commercial');
    if (target === 'workplace') return cat === 'workplace' || typo.includes('workplace') || typo.includes('headquarters') || typo.includes('office');
    if (target === 'culture') return cat === 'culture' || cat === 'cultural' || typo.includes('culture') || typo.includes('cultural') || typo.includes('museum') || typo.includes('gallery');
    if (target === 'public') return cat === 'public' || cat === 'infrastructure' || cat === 'pavilion' || typo.includes('public') || typo.includes('pavilion') || typo.includes('infrastructure');
    if (target === 'renovation') return cat === 'renovation' || cat === 'adaptive reuse' || typo.includes('renovation') || typo.includes('adaptive');

    return cat === target || typo.includes(target);
  });

  const visibleProjects = filteredProjects.slice(0, displayCount);

  // Helper: Project number starts with smallest numbers from bottom (P_01 at the very bottom)
  const getProjectNumber = (proj: Project): string => {
    const masterIdx = projects.findIndex((p) => p.id === proj.id);
    if (masterIdx >= 0) {
      const bottomUpNum = projects.length - masterIdx;
      return `P_${String(bottomUpNum).padStart(2, '0')}`;
    }
    return proj.number;
  };

  // Split visible projects into two columns (odd / even) for the diptych stream
  const leftColProjects: Project[] = [];
  const rightColProjects: Project[] = [];

  visibleProjects.forEach((proj, idx) => {
    if (idx % 2 === 0) {
      leftColProjects.push(proj);
    } else {
      rightColProjects.push(proj);
    }
  });

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 12, filteredProjects.length));
  };

  const hasMore = displayCount < filteredProjects.length;

  return (
    <div className="flex flex-col w-full min-h-screen pt-14 selection:bg-[#0a0a0a] selection:text-white">
      {/* SECTION: Streamlined Header & Count Indicator */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pt-10 pb-6">
        {/* Superheader Meta Hierarchy */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#0a0a0a] pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs uppercase text-[#e63926] font-bold tracking-widest">
              [CORPUS REF. 01]
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#0a0a0a]">
              ARCHIVE — SELECTED &amp; BUILT WORKS
            </span>
          </div>
          <div className="flex items-center space-x-6 font-mono text-xs text-neutral-500">
            <span>
              CHRONOLOGY: <strong className="text-[#0a0a0a] font-bold">2019 — 2026</strong>
            </span>
            <span>
              STATUS: <strong className="text-[#0a0a0a] font-bold">PRAXIS INDEXED</strong>
            </span>
            <span className="hidden md:inline">
              SYSTEM: <strong className="text-[#0a0a0a] font-bold">MIST-ARC-V3</strong>
            </span>
          </div>
        </div>

        {/* Header Title & Total Count */}
        <div className="pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0a0a0a]">
              WORKS //
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl font-normal">
              A continuous modular survey of autonomous structural interventions and monolithic volumes.
            </p>
          </div>
          <div className="flex items-baseline space-x-2 font-mono text-xs uppercase tracking-widest text-neutral-500 self-start md:self-end">
            <span className="text-[#0a0a0a] font-bold text-xl sm:text-2xl leading-none">
              {visibleProjects.length < 10 ? `0${visibleProjects.length}` : visibleProjects.length}
            </span>
            <span>/ {filteredProjects.length} MONOGRAPHS</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-t border-neutral-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setDisplayCount(12);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0a0a0a] text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION: Gallery Diptych Stream */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col space-y-16">
            {leftColProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                cardNumber={getProjectNumber(project)}
                onOpen={openProjectModal}
              />
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col space-y-16">
            {rightColProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                cardNumber={getProjectNumber(project)}
                onOpen={openProjectModal}
              />
            ))}
          </div>
        </div>

        {/* Load More Action Container */}
        {hasMore ? (
          <div className="mt-20 flex flex-col items-center justify-center">
            <button
              onClick={handleLoadMore}
              type="button"
              className="group px-8 py-3.5 rounded-full bg-[#0a0a0a] text-white hover:bg-neutral-800 transition-all duration-200 flex items-center space-x-3 text-xs font-mono font-bold tracking-widest uppercase cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              <span>VIEW MORE ARCHIVES</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-y-0.5 transition-transform">
                arrow_downward
              </span>
            </button>
            <p className="font-mono text-xs text-neutral-500 mt-3 uppercase tracking-wider">
              SHOWING {visibleProjects.length} OF {filteredProjects.length} CORPUS PLATES
            </p>
          </div>
        ) : (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-neutral-100 font-mono text-xs text-neutral-500 uppercase tracking-widest">
              <span>ALL {filteredProjects.length} MONOGRAPHS INDEXED</span>
              <span>✓</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const ProjectCard: React.FC<{
  project: Project;
  cardNumber: string;
  onOpen: (p: Project, plateIdx: number) => void;
}> = ({ project, cardNumber, onOpen }) => {
  const coverPlate = project.plates[0];
  const [naturalAspect, setNaturalAspect] = useState<string | undefined>(project.aspectRatio);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setNaturalAspect(`${naturalWidth} / ${naturalHeight}`);
    }
  };

  const dynamicAspectStyle = naturalAspect ? { aspectRatio: naturalAspect } : undefined;
  const aspectClass = naturalAspect
    ? ''
    : (project.aspect && project.aspect !== 'aspect-auto' ? project.aspect : 'aspect-[4/3]');

  return (
    <article
      onClick={() => onOpen(project, 0)}
      className="group cursor-pointer select-none"
    >
      <div
        style={dynamicAspectStyle}
        className={`relative w-full ${aspectClass} overflow-hidden bg-neutral-200 border border-neutral-300 transition-all`}
      >
        {coverPlate ? (
          <img
            alt={project.title}
            src={coverPlate.src}
            onLoad={handleImageLoad}
            className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full min-h-[240px] flex items-center justify-center font-mono text-xs text-neutral-400">
            NO IMAGE
          </div>
        )}

        <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/15 transition-colors duration-300 pointer-events-none" />

        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#0a0a0a] font-mono text-xs px-3 py-1 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-[#0a0a0a] flex items-center gap-1.5 pointer-events-none shadow-sm">
          <span>VIEW ARCHIVE [{project.plates.length}]</span>
          <span className="material-symbols-outlined text-[14px]">north_east</span>
        </div>
      </div>

      <div className="pt-4">
        <span className="font-mono text-[10px] text-[#e63926] uppercase font-bold tracking-wider block">
          {cardNumber} / {project.typology}
        </span>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0a0a0a] uppercase mt-1 group-hover:text-[#e63926] transition-colors">
          {project.title}
        </h2>
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 mt-1">
          <span>{project.location}</span>
          <span>•</span>
          <span>{project.scaleGfa}</span>
          <span>•</span>
          <span>{project.year}</span>
        </div>
      </div>
    </article>
  );
};
