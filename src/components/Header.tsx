import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageType } from '../types';

export const Header: React.FC = () => {
  const { page, setPage, setIsSearchOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; pageKey: PageType }[] = [
    { label: 'WORKS', pageKey: 'works' },
    { label: 'ARCHITECTS', pageKey: 'architects' },
    { label: 'CONTACT', pageKey: 'contact' }
  ];

  const handleNavClick = (targetPage: PageType) => {
    setPage(targetPage);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-sm border-b border-[#1b1b1b]/15 transition-all">
        <div className="max-w-[1540px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="font-extrabold text-[15px] tracking-tight uppercase hover:opacity-75 transition-opacity text-[#0a0a0a] text-left cursor-pointer"
          >
            MIST ARCHITECTURE
          </button>

          {/* Primary Navigation Desktop */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => {
              const isActive = page === item.pageKey;
              return (
                <button
                  key={item.pageKey}
                  onClick={() => handleNavClick(item.pageKey)}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-all cursor-pointer relative py-1.5 ${
                    isActive
                      ? 'text-[#0a0a0a] font-bold border-b-2 border-[#0a0a0a]'
                      : 'text-[#0a0a0a]/60 hover:text-[#0a0a0a] font-semibold border-b-2 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center space-x-3">
            {/* ADMIN pill button (hidden on mobile, visible on desktop md+) */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden md:flex px-3 py-1.5 rounded-full border border-[#0a0a0a] text-[11px] font-semibold tracking-widest uppercase transition-all items-center gap-1.5 cursor-pointer ${
                page === 'admin'
                  ? 'bg-[#0a0a0a] text-white shadow-sm'
                  : 'text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <span>ADMIN</span>
            </button>

            {/* Search Trigger Icon Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search monographs"
              className="w-8 h-8 rounded-full border border-[#0a0a0a] flex items-center justify-center hover:bg-[#0a0a0a] hover:text-white transition-colors cursor-pointer text-[#0a0a0a]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
            </button>

            {/* Outlined Pill Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open drawer menu"
              className="px-3.5 py-1.5 rounded-full border border-[#0a0a0a] text-[11px] font-medium uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#0a0a0a] hover:text-white transition-all cursor-pointer text-[#0a0a0a]"
              type="button"
            >
              <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end pt-14"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-white h-full border-l border-[#0a0a0a] p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6 pt-4">
              <div className="text-[10px] font-mono font-bold text-[#e63926] tracking-widest uppercase pb-2 border-b border-[#0a0a0a]/20">
                NAVIGATION MATRIX
              </div>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left text-lg font-bold uppercase tracking-tight py-1 ${
                    page === 'home' ? 'text-[#e63926]' : 'text-[#0a0a0a]'
                  }`}
                >
                  00 // HOME
                </button>
                {navItems.map((item, idx) => (
                  <button
                    key={item.pageKey}
                    onClick={() => handleNavClick(item.pageKey)}
                    className={`text-left text-lg font-bold uppercase tracking-tight py-1 flex items-center justify-between ${
                      page === item.pageKey ? 'text-[#e63926]' : 'text-[#0a0a0a]'
                    }`}
                  >
                    <span>0{idx + 1} // {item.label}</span>
                    <span className="text-sm font-mono text-neutral-400">→</span>
                  </button>
                ))}
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`text-left text-lg font-bold uppercase tracking-tight py-1 flex items-center justify-between border-t border-neutral-200 pt-3 ${
                    page === 'admin' ? 'text-[#e63926]' : 'text-[#0a0a0a]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    ADMIN DASHBOARD
                  </span>
                  <span className="text-sm font-mono text-neutral-400">⚙</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 space-y-1">
              <div>MIST ARCHITECTURE RESEARCH & PRAXIS</div>
              <div>SEOUL // APPOINTMENT ONLY</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
