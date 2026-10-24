import React from 'react';
import { useApp } from '../context/AppContext';

export const ArchitectsPage: React.FC = () => {
  const { setPage } = useApp();

  const awardsMatrix = [
    { category: 'CURATED EXHIBITION', title: '파빌리온 전시 청주시 직지 코리아 @청주예술의 전당' },
    { category: 'CURATED EXHIBITION', title: '서울 건축문화제 한강상상전 전시 참여 @문화역서울 284' },
    { category: 'CURATED EXHIBITION', title: '젊은건축가 프로그램 5팀 전시 참여' },
    { category: 'ARCHITECTURE PRIZE', title: '젊은 건축가 프로그램 파이널리스트 선정' },
    { category: 'EXHIBITION', title: '대한민국 건축문화제 전시참여 문화체육관광부 @광주 국립 아시아문화전당' },
    { category: 'CURATED EXHIBITION', title: '서울 건축문화제 한강상상전 전시참여 @ 동대문 디자인 플라자 (DDP)' },
    { category: 'SELECTION OF ARCHITECTS', title: '서울시 공공건축가 위촉 @서울특별시 주관' },
    { category: 'PRIZE / EXCELLENCE', title: 'TSK(김태수) fellowship 수상 @서울대학교 건축학과 주관' },
    { category: 'EXHIBITION', title: 'Typological Formation 전시참여 @University of Technology, Sydney, Australia' },
    { category: 'PRIZE / EXCELLENCE', title: "국제 공모전 대상 수상 'Public Space' Architectural Forum, BD magazine, KPF(영국) 주관" },
    { category: 'EXHIBITION', title: '2003. Groen hoek 보트하우스 국제현상 입선 전시 및 출판 @AIA centre NYC' }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen pt-14 selection:bg-[#0a0a0a] selection:text-white">
      {/* SECTION: Superheader */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#0a0a0a] pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs uppercase text-[#e63926] font-bold tracking-widest">
              [ CATALOG 03 // PARTNER PROFILES &amp; REGISTRY ]
            </span>
          </div>
          <div className="font-mono text-xs text-neutral-500">
            INDEX REF: <strong className="text-[#0a0a0a]">KR-01 / NL-02 — 2018-2026</strong>
          </div>
        </div>

        <div className="pt-6 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0a0a0a]">
            ARCHITECTS REGISTRY
          </h1>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-2 md:mt-0">
            SEOUL — PARTNERSHIP
          </span>
        </div>
      </section>

      {/* SECTION: Partners Profiles Diptych */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-[#0a0a0a] py-12">
          {/* Partner 1: Kwon Hyuk Jun */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#0a0a0a] border-b border-neutral-200 pb-2 mb-4">
                <span className="font-bold">DIR-</span>
                <span className="text-[#e63926] font-bold">KIRA / LICENSED KR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0a0a0a] mb-1">
                권 혁 준
              </h2>
              <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-6 font-semibold">
                KWON, HYUK JUN — PRINCIPAL ARCHITECT
              </div>

              <ul className="space-y-3 font-mono text-xs text-[#0a0a0a]/85 border-t border-neutral-100 pt-4">
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">01</span>
                  <span>경희 대학교 학사 졸업</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">02</span>
                  <span>OFFICE MOV 건축사 사무소</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">03</span>
                  <span>T.O.D 건축사 사무소</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">04</span>
                  <span>MONOBLOK DESIGN 총괄 디자인</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">05</span>
                  <span className="font-bold text-[#0a0a0a]">대한민국 건축사 정회원 (KIRA)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Partner 2: Kim Min Seok */}
          <div className="flex flex-col justify-between md:border-l md:border-neutral-200 md:pl-12">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#0a0a0a] border-b border-neutral-200 pb-2 mb-4">
                <span className="font-bold">DIR-</span>
                <span className="text-[#e63926] font-bold">KIRA / LICENSED KR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0a0a0a] mb-1">
                김 민 석
              </h2>
              <div className="font-mono text-xs text-neutral-500 tracking-wider uppercase mb-6 font-semibold">
                KIM, MIN SEOK — PARTNER &amp; DESIGN LEAD
              </div>

              <ul className="space-y-3 font-mono text-xs text-[#0a0a0a]/85 border-t border-neutral-100 pt-4">
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">01</span>
                  <span>AA School of Architecture London UK, Diploma (RIBA part 2)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">02</span>
                  <span>Univ. of Westminster London UK, Post Diploma (RIBA part 3)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">03</span>
                  <span>Kohn Pedersen Fox Associates (London, UK)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">04</span>
                  <span>Adjaye Associates (London, UK)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">05</span>
                  <span>영국 건축사 (ARB / RIBA Chartered Architect)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">06</span>
                  <span className="font-bold text-[#0a0a0a]">대한민국 건축사 (KIRA)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e63926] font-bold mr-3 shrink-0">07</span>
                  <span>NOTION ARCHITECTURE</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Awards & Exhibitions Matrix */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pb-20">
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#e63926]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e63926]">
              REGISTRY TABLE // 02
            </span>
          </div>
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            [ JOINT PRAXIS REGISTRATION ]
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0a0a0a] mb-6">
          AWARDS &amp; EXHIBITIONS MATRIX
        </h2>

        {/* Matrix Table */}
        <div className="border-t-2 border-b-2 border-[#0a0a0a] divide-y divide-neutral-200 overflow-x-auto">
          <div className="grid grid-cols-12 py-3 font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase bg-neutral-50 min-w-[640px]">
            <div className="col-span-4 px-3">CATEGORY</div>
            <div className="col-span-8 px-3">TITLE / DESIGNATION</div>
          </div>
          {awardsMatrix.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 py-3.5 text-xs font-mono items-center hover:bg-neutral-50 transition-colors min-w-[640px]"
            >
              <div className="col-span-4 px-3 text-neutral-500 uppercase tracking-wider text-[11px]">
                {item.category}
              </div>
              <div className="col-span-8 px-3 font-medium text-[#0a0a0a]">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 uppercase tracking-widest pt-4">
          <span>REGISTRY VERIFIED // JOINT CURATION MIST ARCHITECTURE</span>
          <span>TOTAL {awardsMatrix.length} ENTRIES</span>
        </div>
      </section>

      {/* SECTION: Architecture Philosophy */}
      <section className="bg-[#f9f9f9] border-t border-b border-[#0a0a0a] py-20">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#e63926]"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e63926]">
                PRAXIS FOUNDATION // 03
              </span>
            </div>
            <span className="font-mono text-xs text-neutral-400">건축 철학 및 공간 정론</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0a0a0a] mb-10">
            ARCHITECTURE PHILOSOPHY
          </h2>

          <div className="bg-white border border-[#0a0a0a] p-8 sm:p-12 mb-12 shadow-sm">
            <span className="font-mono text-[10px] text-[#e63926] font-bold tracking-widest uppercase block mb-4">
              STATEMENT OF INTENT // 선언문
            </span>
            <p className="text-base sm:text-xl font-medium leading-relaxed text-[#0a0a0a] mb-8">
              &ldquo;미스트 건축사사무소는 건축이 단순한 형태의 조형을 넘어, 장소가 지닌 고유한 맥락과 사람들의 일상을 깊이 이해하는 데서 시작한다고 믿습니다. 기능과 구조의 본질을 바탕으로 불필요한 요소를 덜어내고, 재료가 가진 고유한 질감과 빛, 비움의 관계를 세심하게 다룹니다. 우리는 시간이 흘러도 변하지 않는 가치, 공간 본연의 힘이 온전히 머무는 영속적인 장소를 추구합니다.&rdquo;
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-xs text-neutral-500 uppercase tracking-wider pt-6 border-t border-neutral-200">
              <span>MIST ARCHITECTURE MANIFESTO — REVISED SEOUL / ROTTERDAM</span>
              <span className="font-bold text-[#0a0a0a] mt-2 sm:mt-0">
                DISCIPLINED REDUCTION OVER FORMED NOISE
              </span>
            </div>
          </div>

          {/* 3 Foundation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-[#e63926] tracking-widest mb-1">
                  [ 01 DESIGN PHILOSOPHY ] 01/03
                </div>
                <h3 className="text-lg font-black tracking-tight text-[#0a0a0a] uppercase mb-1">
                  CONTEXTUAL SUBTRACTION
                </h3>
                <div className="text-xs text-neutral-500 font-mono mb-4">
                  장소의 맥락과 감산적 설계
                </div>
                <p className="text-xs leading-relaxed text-neutral-700">
                  우리는 대지가 품은 고유한 시간성과 물리적 환경을 정밀하게 읽어냅니다. 시각적 과잉이나 인위적인 과시를 거부하며, 가장 본질적인 질서만을 남길 때까지 불필요한 레이어를 덜어내는 엄격한 감산(Subtraction)의 과정을 거칩니다.
                </p>
              </div>
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest pt-6 border-t border-neutral-100 mt-6">
                PRIMARY RULE: ESSENCE BEFORE FORM
              </div>
            </div>

            <div className="bg-white border border-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-[#e63926] tracking-widest mb-1">
                  [ 02 MATERIALS &amp; DETAIL ] 02/03
                </div>
                <h3 className="text-lg font-black tracking-tight text-[#0a0a0a] uppercase mb-1">
                  TECTONIC HONESTY
                </h3>
                <div className="text-xs text-neutral-500 font-mono mb-4">
                  물성의 진실성과 디테일의 영속
                </div>
                <p className="text-xs leading-relaxed text-neutral-700">
                  콘크리트의 거친 골재감, 차가운 철판의 직결부, 석재의 침묵 등 날것 그대로의 재료가 지닌 물성을 숨김없이 드러냅니다. 시간이 흐르며 자연스러운 풍화(Patina)를 수용하는 구조적 디테일을 통해 세대를 초월하는 내구성을 확보합니다.
                </p>
              </div>
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest pt-6 border-t border-neutral-100 mt-6">
                PRIMARY RULE: HONESTY OF AGGREGATE
              </div>
            </div>

            <div className="bg-white border border-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-[#e63926] tracking-widest mb-1">
                  [ 03 LIGHT &amp; SPACE ] 03/03
                </div>
                <h3 className="text-lg font-black tracking-tight text-[#0a0a0a] uppercase mb-1">
                  VOLUMETRIC EMPTINESS
                </h3>
                <div className="text-xs text-neutral-500 font-mono mb-4">
                  비움의 음영과 자연광의 순환
                </div>
                <p className="text-xs leading-relaxed text-neutral-700">
                  물리적 공간을 채우는 가구보다 공간을 비워낸 &lsquo;여백의 질(Void Quality)&rsquo;을 상위 가치로 삼습니다. 천창과 슬릿을 통해 시시각각 변화하는 자연광의 경로를 설계하여, 머무는 이에게 명징한 사유의 시간을 제공하는 정숙한 공간을 빚어냅니다.
                </p>
              </div>
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest pt-6 border-t border-neutral-100 mt-6">
                PRIMARY RULE: SILENCE IN AMBIENCE
              </div>
            </div>
          </div>

          {/* Action Trigger Banner */}
          <div className="bg-black text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-xs tracking-wider uppercase text-neutral-300 text-center sm:text-left">
              INQUIRIES REGARDING PRAXIS COLLABORATIONS &amp; ARCHITECTURAL JURIES:
            </span>
            <button
              onClick={() => setPage('contact')}
              className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>INITIATE ARCHITECT DIALOGUE</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
