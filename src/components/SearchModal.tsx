import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, projects, openProjectModal, setPage } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProjects = query.trim()
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.typology.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.number.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white border border-[#0a0a0a] shadow-2xl z-10 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200">
          <span className="material-symbols-outlined text-neutral-400 mr-3 text-xl">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search monographs, projects, typologies (e.g. RP BIO, Commercial, Jeju, Monc)..."
            className="w-full bg-transparent text-sm md:text-base outline-none font-sans placeholder:text-neutral-400 text-neutral-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-neutral-400 hover:text-black mr-2 uppercase"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-mono border border-neutral-300 px-2 py-1 rounded text-neutral-600 hover:bg-neutral-100"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-neutral-100">
          {query.trim() === '' ? (
            <div className="py-8 text-center">
              <span className="font-mono text-xs text-[#e63926] uppercase tracking-widest block mb-1">
                INDEX PRAXIS SEARCH
              </span>
              <p className="text-xs text-neutral-500">
                Type project title, typology, location, or scale to filter corpus monographs.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-500">
              No architectural monographs found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  openProjectModal(p, 0);
                }}
                className="py-3 px-2 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-9 bg-neutral-200 overflow-hidden shrink-0 border border-neutral-200">
                    {p.plates[0] && (
                      <img
                        src={p.plates[0].src}
                        alt={p.title}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#e63926] font-bold tracking-widest uppercase block">
                      {p.number} / {p.typology}
                    </span>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 group-hover:text-[#e63926] transition-colors">
                      {p.title}
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {p.location} • {p.year}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono text-neutral-400 group-hover:text-black">
                  VIEW ARCHIVE [{p.plates.length}] →
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Nav Footer */}
        <div className="bg-neutral-50 px-4 py-2 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>{projects.length} MONOGRAPHS INDEXED</span>
          <div className="space-x-3">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setPage('works');
              }}
              className="hover:underline text-black"
            >
              Go to Works →
            </button>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setPage('contact');
              }}
              className="hover:underline text-black"
            >
              Contact Consultation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
