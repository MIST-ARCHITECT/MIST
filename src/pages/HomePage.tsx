import React from 'react';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { settings, projects, openProjectModal, setPage } = useApp();

  // The top 3 projects from works management are directly reflected in SELECTED WORKS CORPUS
  const primaryProject = projects[0];
  const secondProject = projects[1];
  const thirdProject = projects[2];

  return (
    <div className="flex flex-col w-full min-h-screen pt-14 selection:bg-[#0a0a0a] selection:text-white">
      {/* SECTION: Hero Monograph */}
      <section
        className="relative max-w-[1540px] mx-auto w-full px-6 pt-10 pb-16 border-b border-[#0a0a0a] overflow-hidden"
        data-purpose="hero-monograph"
      >
        {/* Right Spine Graphic Edge Coordinates */}
        <div className="absolute right-6 top-6 flex flex-col items-center select-none text-[10px] font-mono font-semibold tracking-widest hidden sm:flex">
          <span className="text-[#e63926] mb-4">T-01</span>
          <div className="vertical-spine-text tracking-[0.28em] uppercase text-[#0a0a0a]/75 font-mono text-[9px] h-[360px] flex items-center justify-between">
            STRUCTURE • GEOMETRY • MECHANISM
          </div>
        </div>

        {/* Hero Composition Grid */}
        <div className="grid grid-cols-12 gap-8 items-start pr-0 sm:pr-12 lg:pr-16">
          {/* Left Big Display & Abstract Section */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between mt-6 lg:mt-[300px]">
            {/* Monumental Monograph Title */}
            <div className="mb-6 sm:mb-10 mt-0">
              <div className="flex items-baseline space-x-4 mb-[-6px]">
                <h1
                  className="font-black uppercase editorial-headline text-[#0a0a0a] m-0 text-5xl sm:text-7xl lg:text-[76px]"
                  style={{ letterSpacing: '-0.05em' }}
                >
                  MIST
                </h1>
                <span className="text-[10px] font-mono tracking-widest text-[#0a0a0a]/50 uppercase pb-3">
                  EST. {settings.estYear || '2020'}
                </span>
                <div className="h-[1px] bg-[#0a0a0a]/20 flex-grow mb-4 ml-2"></div>
              </div>
              <h2 className="text-[28px] sm:text-[40px] lg:text-[52px] uppercase tracking-[-0.04em] text-[#0a0a0a] font-normal leading-tight">
                ARCHITECTURE
              </h2>
            </div>

            {/* Secondary Hero Manifest Block (Image + Text Pair) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pt-4">
              {/* Void Abstract Photo Crop */}
              <div className="sm:col-span-6 overflow-hidden bg-[#0a0a0a] aspect-[4/3] w-full">
                <img
                  alt="Architectural light refraction within concrete subterranean chamber"
                  className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
                  src={
                    settings.heroImageLeft ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBLGkyrtObexMQA72MVX7p4NffhlWWfU4JwD9sQsK1mhuewQjlQD2uML-ZnuZkoqDQKRDiWndM0OvqVuVixAVMs9eIU2W4RehLAJMmuaLPujWqePDSLGjEhtALiJVsk7bM1QzlL9JEKpUN07iN0DWxxqkoFaUXujC2R77JDqtJz59-RV6paIxsIwRsbeyHMb76GHJd09eXL5IgaaH1Dxj71R8TtwcdvA6QKkk4E8EwcNWsjtaFl8zvXWw'
                  }
                />
              </div>

              {/* Structural Statement */}
              <div className="sm:col-span-6 flex flex-col justify-between h-full pt-2">
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#0a0a0a] mb-3">
                    {settings.tagline || 'MINIMAL + STRUCTURE & SPACE'}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-[#0a0a0a]/80 font-normal">
                    {settings.heroDescription ||
                      'We explore an architectural practice where compressed structures converge with primordial light. Through sculptural interventions shaped by mass and void, we seek to reveal the spatial experience born from weight, absence, and emptiness.'}
                  </p>
                </div>

                {/* CTA Pill Pair */}
                <div className="flex items-center space-x-3 pt-6">
                  <button
                    onClick={() => setPage('works')}
                    className="px-5 py-2 rounded-full border border-[#0a0a0a] text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-[#0a0a0a] hover:text-white transition-all cursor-pointer text-[#0a0a0a]"
                  >
                    EXPLORE WORKS
                  </button>
                  <button
                    onClick={() => setPage('contact')}
                    className="px-5 py-2 rounded-full border border-neutral-300 text-[10px] font-mono font-semibold tracking-widest uppercase hover:border-black transition-all cursor-pointer text-neutral-600 hover:text-black"
                  >
                    CONSULTATION
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Monolithic Architectural Crop Column */}
          <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-[400px] aspect-[4/5] bg-[#0a0a0a] overflow-hidden shadow-lg border border-[#0a0a0a]/10">
              <img
                alt="High contrast brutalist raw concrete massing"
                className="w-full h-full object-cover"
                src={
                  settings.heroImageRight ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuATMT6vJ8AavKi_33plnGxHa9xijJNAo73VvglUtQgzaT0pDAJQ115jGCMHddjI4UUhmVPscCJPKwS2kpHoyfH4oJuGOFMrvxfDRvpdARE8gcTQoz7MCwIi5ILaET62UEESLDpr0xtYMUBfNBEYaLAKGOd-ivKewL8cIHngwflkkRYXbgz7bwZl0UO9VIYq1QO3y6IuPnYys5sdmY7ac38aYKDOHXUIsruKhOrTp-UBqaES88gYk3_jnHDtpHxvz3bMsqc'
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 01 Philosophy */}
      <section className="bg-[#e8e8e8] border-b border-[#0a0a0a] py-16" data-purpose="design-philosophy">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left: Philosophy Manifesto Anchor */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0a0a0a]/20 pb-8 lg:pb-0 lg:pr-8">
              <div>
                <span className="inline-flex items-center text-[11px] font-mono font-bold text-[#e63926] tracking-widest uppercase mb-3">
                  <span className="w-1.5 h-1.5 bg-[#e63926] mr-2 inline-block"></span>
                  MIST ARCHITECTURE OFFICE
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase tracking-tight leading-[1.05] text-[#0a0a0a] whitespace-pre-line">
                  {settings.philosophyTitle ||
                    '01 // PHILOSOPHY —\nTHE FOUNDATION\nOF A BETTER SPACE'}
                </h2>

                <ul className="mt-8 space-y-2.5 text-xs font-mono font-medium text-[#0a0a0a]/85 tracking-wide">
                  <li className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-[#e63926] inline-block shrink-0"></span>
                    <span>Designing spaces that respect the context and nature of the site</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-[#e63926] inline-block shrink-0"></span>
                    <span>Creating spaces that meet the needs of people and users</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-[#e63926] inline-block shrink-0"></span>
                    <span>Planning sustainable architecture for a better future</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Detailed Editorial Text & 3-Column Micro Index */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-between">
              <blockquote className="text-[14px] sm:text-[15px] leading-relaxed text-[#0a0a0a]/90 font-medium mb-10">
                {settings.philosophyQuote}
              </blockquote>

              {/* Micro Framework Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#0a0a0a]/20 mb-8">
                {settings.philosophyPoints.map((point) => (
                  <div key={point.number}>
                    <h4 className="text-[11px] font-mono font-bold text-[#e63926] tracking-widest mb-2">
                      [ {point.number} {point.title} ]
                    </h4>
                    <p className="text-[11px] leading-normal text-[#0a0a0a]/70">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Trigger */}
              <div>
                <button
                  onClick={() => setPage('architects')}
                  className="inline-flex items-center px-6 py-2.5 rounded-full border border-[#0a0a0a] text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-[#0a0a0a] hover:text-white transition-all cursor-pointer text-[#0a0a0a]"
                >
                  VIEW ARCHITECTS REGISTRY →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 02 Selected Works Corpus */}
      <section className="bg-white py-16 border-b border-[#0a0a0a]" data-purpose="selected-works" id="works">
        <div className="max-w-[1540px] mx-auto px-6">
          {/* Corpus Section Headline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#0a0a0a]">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#e63926] tracking-widest uppercase block mb-1">
                02 // 3 FEATURED WORKS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0a0a0a]">
                SELECTED WORKS CORPUS
              </h2>
            </div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#0a0a0a]/60 mt-3 md:mt-0">
              INDEX: 2021 — 2025 / CHRONICLE
            </div>
          </div>

          {/* Project 01: Full-Width Cinematic Monograph */}
          {primaryProject && (
            <article
              onClick={() => openProjectModal(primaryProject, 0)}
              className="group block border border-[#0a0a0a] mb-12 cursor-pointer bg-neutral-50 transition-all hover:border-[#e63926]"
            >
              <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] overflow-hidden bg-black">
                <img
                  alt={primaryProject.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  src={primaryProject.plates[0]?.src || ''}
                />
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity border border-black flex items-center gap-1.5">
                  <span>VIEW ARCHIVE [{primaryProject.plates.length}]</span>
                  <span>↗</span>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between border-t border-[#0a0a0a] bg-white">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#e63926] tracking-widest uppercase block mb-1">
                    {primaryProject.typology}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#0a0a0a] group-hover:text-[#e63926] transition-colors">
                    {primaryProject.title}
                  </h3>
                  <p className="text-xs text-[#0a0a0a]/70 mt-1 max-w-2xl font-normal">
                    {primaryProject.description}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-mono font-bold text-[#0a0a0a] shrink-0">
                  <span className="text-base leading-none">↗</span>
                </div>
              </div>
            </article>
          )}

          {/* Projects 02 & 03: Balanced Two-Column Modular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {secondProject && (
              <article
                onClick={() => openProjectModal(secondProject, 0)}
                className="group border border-[#0a0a0a] flex flex-col justify-between bg-neutral-50 cursor-pointer transition-all hover:border-[#e63926]"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
                  <img
                    alt={secondProject.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    src={secondProject.plates[0]?.src || ''}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity border border-black flex items-center gap-1.5">
                    <span>VIEW ARCHIVE [{secondProject.plates.length}]</span>
                    <span>↗</span>
                  </div>
                </div>
                <div className="p-6 border-t border-[#0a0a0a] bg-white flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#e63926] tracking-widest uppercase block mb-1">
                      {secondProject.typology}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-[#0a0a0a] group-hover:text-[#e63926] transition-colors">
                      {secondProject.title}
                    </h3>
                    <p className="text-xs text-[#0a0a0a]/70 mt-2 font-normal">
                      {secondProject.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#0a0a0a]/10 flex items-center justify-between text-xs font-mono font-bold text-[#0a0a0a]">
                    <span>{secondProject.location}</span>
                    <span className="text-sm">↗</span>
                  </div>
                </div>
              </article>
            )}

            {thirdProject && (
              <article
                onClick={() => openProjectModal(thirdProject, 0)}
                className="group border border-[#0a0a0a] flex flex-col justify-between bg-neutral-50 cursor-pointer transition-all hover:border-[#e63926]"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
                  <img
                    alt={thirdProject.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    src={thirdProject.plates[0]?.src || ''}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity border border-black flex items-center gap-1.5">
                    <span>VIEW ARCHIVE [{thirdProject.plates.length}]</span>
                    <span>↗</span>
                  </div>
                </div>
                <div className="p-6 border-t border-[#0a0a0a] bg-white flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#e63926] tracking-widest uppercase block mb-1">
                      {thirdProject.typology}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-[#0a0a0a] group-hover:text-[#e63926] transition-colors">
                      {thirdProject.title}
                    </h3>
                    <p className="text-xs text-[#0a0a0a]/70 mt-2 font-normal">
                      {thirdProject.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#0a0a0a]/10 flex items-center justify-between text-xs font-mono font-bold text-[#0a0a0a]">
                    <span>{thirdProject.location}</span>
                    <span className="text-sm">↗</span>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Corpus Monograph Index Navigation Footer */}
          <div className="text-center pt-4">
            <button
              onClick={() => setPage('works')}
              className="inline-flex items-center px-8 py-3 rounded-full border border-[#0a0a0a] text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-[#0a0a0a] hover:text-white transition-all cursor-pointer text-[#0a0a0a]"
            >
              VIEW COMPLETE WORKS CORPUS [{projects.length}] →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
