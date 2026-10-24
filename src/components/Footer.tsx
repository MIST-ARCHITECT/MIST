import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-[#e8e8e8] text-[#0a0a0a] py-16 border-t border-[#bfbfbf]" id="colophon">
      <div className="max-w-[1540px] mx-auto px-6">
        {/* Top Editorial Colophon Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#bfbfbf]">
          {/* Atelier Address KR */}
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#e63926] block mb-2 font-bold">
              OFFICE ADDRESS
            </span>
            <p className="text-xs leading-relaxed text-[#0a0a0a] font-normal whitespace-pre-line">
              {settings.officeAddressKr || '서울특별시 광진구 구의동\n554-11번지 성남빌딩\n(우) 05115'}
            </p>
          </div>

          {/* English Notation */}
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-2 font-bold">
              ENGLISH NOTATION
            </span>
            <p className="text-xs leading-relaxed text-[#0a0a0a] font-normal whitespace-pre-line">
              {settings.officeAddressEn ||
                '742, Ttukseom-ro, Gwangjin-gu,\nSeoul, Republic of Korea\nZip: 05115'}
            </p>
          </div>

          {/* Contact Enquiries */}
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#e63926] block mb-2 font-bold">
              CONTACT
            </span>
            <p className="text-xs leading-relaxed font-mono">
              <a
                className="hover:underline block font-semibold text-[#0a0a0a]"
                href={`mailto:${settings.email}`}
              >
                {settings.email || 'mist5298@naver.com'}
              </a>
              <span className="text-neutral-600 font-normal">
                {settings.phone || '+82 (0)2 . 543 . 7380'}
              </span>
            </p>
            {settings.naverBlogUrl && (
              <a
                href={settings.naverBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-600 hover:text-black mt-2 underline"
              >
                <span>NAVER BLOG ARCHIVE</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Monograph Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono tracking-widest uppercase text-neutral-600 gap-4">
          <div>
            © 2025 MIST ARCHITECTURE RESEARCH AND PRAXIS. ALL RIGHTS RESERVED.
          </div>
          <div className="font-bold text-[#0a0a0a]">
            {settings.tagline || 'MINIMAL + STRUCTURE'}
          </div>
        </div>
      </div>
    </footer>
  );
};
