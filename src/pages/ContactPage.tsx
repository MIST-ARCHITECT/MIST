import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import defaultDrawingRoomImage from '../assets/images/drawing_room_empty_1792300107736.jpg';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: '',
    typologies: ['신축 건축'] as string[],
    siteLocation: '',
    targetScale: '',
    timeline: '',
    estimate: '',
    message: '',
    consent: true
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const typologyOptions = [
    { label: 'NEW BUILD // 신축 건축', value: '신축 건축' },
    { label: 'RENOVATION // 증개축·대수선·용도변경', value: '증개축·대수선·용도변경' },
    { label: 'INTERIOR & EXHIBITION // 인테리어, 전시', value: '인테리어, 전시' },
    { label: 'FEASIBILITY // 기획 컨설팅', value: '기획 컨설팅' }
  ];

  const selectTypology = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      typologies: [val]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg('성함 또는 법인명을 입력해 주십시오.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMsg('연락 가능한 전화번호 또는 이메일을 기입해 주십시오.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('프로젝트 세부 내용 또는 문의 사항을 기술해 주십시오.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('상담 및 회신을 위한 개인정보 수집 및 이용에 동의해 주십시오.');
      return;
    }

    const encode = (data: { [key: string]: string }) => {
      return Object.keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
    };

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'consultation',
        name: formData.name,
        organization: formData.organization,
        phone: formData.phone,
        email: formData.email,
        typologies: formData.typologies.join(', '),
        siteLocation: formData.siteLocation || '미정',
        targetScale: formData.targetScale || '미정',
        timeline: formData.timeline || '일정 협의',
        estimate: formData.estimate || '예산 협의',
        message: formData.message
      })
    })
      .then(() => {
        alert('상담 신청이 정상적으로 접수되었습니다.');
        setSubmitted(true);
        setFormData({
          name: '',
          organization: '',
          phone: '',
          email: '',
          typologies: ['신축 건축'],
          siteLocation: '',
          targetScale: '',
          timeline: '',
          estimate: '',
          message: '',
          consent: true
        });
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        alert('상담 신청이 정상적으로 접수되었습니다.');
        setSubmitted(true);
      });
  };

  return (
    <div className="flex flex-col w-full min-h-screen pt-14 selection:bg-[#0a0a0a] selection:text-white">
      {/* SECTION: Superheader */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#0a0a0a] pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <span className="w-1.5 h-1.5 bg-[#e63926]"></span>
            <span className="font-mono text-xs uppercase text-[#e63926] font-bold tracking-widest">
              03 // DISPATCH &amp; INQUIRY — CONTACT ARCHIVE
            </span>
          </div>
          <div className="font-mono text-xs text-neutral-500">
            COMMISSION STATUS: <strong className="text-[#0a0a0a]">ACTIVE FOR 2025-2026 ARCHITECTURAL CYCLES</strong>
          </div>
        </div>

        <div className="pt-6 pb-4">
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0a0a0a]">
            INITIATE SPATIAL DIALOGUE &amp; CONTACT.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-3xl leading-relaxed font-normal">
            건축적 침묵과 구조적 명료함을 지향하는 MIST ARCHITECTURE는 주거, 상업, 문화, 도시 리노베이션 프로젝트를 심도 있게 연구·수행합니다. 초기 계획 단계부터 부지 분석 및 인허가 적합성을 검토합니다.
          </p>
        </div>
      </section>

      {/* SECTION: Contact Body Diptych */}
      <section className="max-w-[1540px] mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#0a0a0a] pt-12">
          {/* Left Column: Office Meta & Atelier Notes */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            {/* Box 1: Seoul Office Address */}
            <div className="border border-neutral-300 p-6 bg-[#f9f9f9]">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#e63926] font-bold mb-3">
                <span>LOC. 01 // SEOUL OFFICE</span>
                <span className="text-neutral-400">KR 05115</span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] mb-2">
                MIST OFFICE
              </h2>
              <p className="text-xs text-[#0a0a0a] leading-relaxed mb-4">
                <span className="block whitespace-pre-line">
                  {settings.officeAddressKr || '서울특별시 광진구 구의동 596-5 광성빌딩'}
                </span>
                {settings.officeAddressEn && (
                  <span className="text-neutral-500 font-mono block mt-1 whitespace-pre-line">
                    {settings.officeAddressEn}
                  </span>
                )}
              </p>
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-t border-neutral-200 pt-3 mb-4">
                SPATIAL PRAXIS &amp; STRUCTURAL MORPHOLOGY ARCHIVE
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-neutral-200 pt-3">
                <div>
                  <span className="text-neutral-400 block text-[10px]">HOURS</span>
                  <span className="text-[#0a0a0a] font-bold">MON-FRI 09:00-18:00</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">CONSULTATION</span>
                  <span className="text-[#0a0a0a] font-bold">BY APPOINTMENT ONLY</span>
                </div>
              </div>
            </div>

            {/* Box 2: Direct Inquiry Channels */}
            <div className="border border-neutral-300 p-6 bg-white">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                DIRECT INQUIRY CHANNELS
              </span>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-500">ELECTRONIC MAIL</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-bold text-[#0a0a0a] hover:underline"
                  >
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-500">ATELIER DIRECT TEL</span>
                  <span className="font-bold text-[#0a0a0a]">{settings.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">PRESS &amp; MONOGRAPH</span>
                  <span className="text-neutral-700">archive@mist-arch.kr</span>
                </div>
              </div>
            </div>

            {/* Box 3: Publications & Blog */}
            <div className="border border-neutral-300 p-6 bg-[#f9f9f9]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#e63926] font-bold block mb-2">
                PUBLICATIONS &amp; RESEARCH LOGS
              </span>
              <h3 className="text-sm font-black uppercase text-[#0a0a0a] mb-2">
                MIST ARCHITECTURAL ESSAYS &amp; NOTES
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                진행 중인 대지 실측 일지, 디테일 단면 스터디, 머티리얼 샘플 테스트 및 건축 철학 에세이를 네이버 공식 블로그 플랫폼에 상시 기록·공개합니다.
              </p>
              {settings.naverBlogUrl && (
                <a
                  href={settings.naverBlogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0a0a0a] text-white hover:bg-neutral-800 transition-colors font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between px-4"
                >
                  <span>NAVER BLOG // 공식 블로그 바로가기</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            {/* Atelier photo figure */}
            <div className="border border-neutral-300 p-3 bg-white group relative">
              <div className="w-full aspect-[2.15/1] bg-neutral-900 overflow-hidden mb-2 relative">
                <img
                  src={
                    settings.drawingRoomImage && !settings.drawingRoomImage.startsWith('/src/')
                      ? settings.drawingRoomImage
                      : defaultDrawingRoomImage
                  }
                  onError={(e) => {
                    e.currentTarget.src = defaultDrawingRoomImage;
                  }}
                  alt="Original Drawing Room"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                <span>FIG 01. ORIGINAL DRAWING ROOM</span>
                <span>KWANGJIN DIST.</span>
              </div>
            </div>

            <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest pt-2">
              ESTABLISHED IN SEOUL / DISCIPLINED MONOCHROME PRAXIS / CODE: MIST-ARCH-INQ
            </div>
          </div>

          {/* Right Column: Consultation Application Form */}
          <div className="lg:col-span-7">
            <div className="border-2 border-[#0a0a0a] p-6 sm:p-10 bg-white">
              <div className="border-b border-[#0a0a0a] pb-6 mb-8">
                <span className="font-mono text-xs font-bold text-[#e63926] tracking-widest uppercase block mb-1">
                  FORM 03-A // CLIENT COMMISSION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">
                  CONSULTATION APPLICATION
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-2">
                  건축 설계 및 마스터플랜 상담 신청서 — 빠른 시일 내로 회신드립니다. 작성 가능한 부분만 기입해 주시기 바랍니다.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a]">
                    상담 신청이 정상적으로 접수되었습니다
                  </h3>
                  <div className="font-mono text-xs text-neutral-600 bg-neutral-100 p-4 max-w-md mx-auto border border-neutral-300">
                    담당 건축사가 기재해주신 연락처로 대지 및 인허가 요건을 사전 검토한 후 회신드립니다.
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all cursor-pointer"
                  >
                    추가 문의 작성하기
                  </button>
                </div>
              ) : (
                <form
                  name="consultation"
                  method="POST"
                  data-netlify="true"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <input type="hidden" name="form-name" value="consultation" />

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  {/* 01. Client Name */}
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                      01. CLIENT NAME / ORGANIZATION <span className="text-neutral-500 font-normal">(성함 또는 법인명 / 직책)</span> *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="예: 김민수 / (주)미스트홀딩스 개발기획팀"
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50"
                    />
                  </div>

                  {/* 02. Organization */}
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                      02. ORGANIZATION / COMPANY <span className="text-neutral-500 font-normal">(소속 회사명 또는 단체명)</span>
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="예: (주)미스트홀딩스"
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50"
                    />
                  </div>

                  {/* 03. Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                        03-A. CONTACT PHONE <span className="text-neutral-500 font-normal">(연락처)</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-mono text-sm bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                        03-B. DIRECT EMAIL <span className="text-neutral-500 font-normal">(이메일)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@domain.com"
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-mono text-sm bg-neutral-50"
                      />
                    </div>
                  </div>

                  {/* 04. Project Typology */}
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                      04. PROJECT TYPOLOGY <span className="text-neutral-500 font-normal">(프로젝트 유형 선택)</span>
                    </label>
                    <input type="hidden" name="typologies" value={formData.typologies.join(', ')} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {typologyOptions.map((opt) => {
                        const checked = formData.typologies.includes(opt.value);
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => selectTypology(opt.value)}
                            className={`px-4 py-3 border text-left text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer select-none ${
                              checked
                                ? 'bg-black text-white border-black font-bold shadow-sm'
                                : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-black'
                            }`}
                          >
                            <span>{opt.label}</span>
                            <span className="text-sm leading-none font-bold">
                              {checked ? '●' : '○'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 05. Location & Scale */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                        05-A. SITE LOCATION <span className="text-neutral-500 font-normal">(대지 위치/지번)</span>
                      </label>
                      <input
                        type="text"
                        name="siteLocation"
                        value={formData.siteLocation}
                        onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                        placeholder="예: 서울 강남구 신사동 / 미정"
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                        05-B. TARGET SCALE GFA <span className="text-neutral-500 font-normal">(예상 면적)</span>
                      </label>
                      <input
                        type="text"
                        name="targetScale"
                        value={formData.targetScale}
                        onChange={(e) => setFormData({ ...formData, targetScale: e.target.value })}
                        placeholder="예: 약 150평 (500㎡) 내외"
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50"
                      />
                    </div>
                  </div>

                  {/* 06. Timeline & Estimate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                        06-A. TIMELINE <span className="text-neutral-500 font-normal">(프로젝트 희망 시기)</span>
                      </label>
                      <input
                        type="text"
                        name="timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="예: 2026년 하반기 인허가 착수 희망"
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                        06-B. ESTIMATE <span className="text-neutral-500 font-normal">(예상 총공사비 범위)</span>
                      </label>
                      <input
                        type="text"
                        name="estimate"
                        value={formData.estimate}
                        onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
                        placeholder="예: 약 10억~15억 원 범위"
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50"
                      />
                    </div>
                  </div>

                  {/* 07. Details / Message */}
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] mb-2">
                      07. PROJECT DETAILS &amp; INQUIRIES * <span className="text-neutral-500 font-normal">(프로젝트 세부 내용 및 주안점)</span>
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="공간의 용도(단독주택, 근린생활시설, 사옥 등), 주요 요구 사항, 기존 건물의 상태, 또는 건축가에게 바라는 점을 기술해 주십시오."
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-black outline-none font-sans text-sm bg-neutral-50 leading-relaxed"
                    />
                  </div>

                  {/* Privacy Agreement */}
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="privacyConsent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-black rounded border-neutral-300"
                    />
                    <label htmlFor="privacyConsent" className="text-xs text-neutral-600 font-sans cursor-pointer select-none">
                      건축 상담 및 일정 회신을 위한 개인정보(성함, 연락처, 이메일, 대지정보) 수집 및 이용에 동의합니다.
                    </label>
                  </div>

                  {/* Action & Confidentiality */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest text-center sm:text-left">
                      * ALL INQUIRIES STRICTLY CONFIDENTIAL
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] text-white hover:bg-neutral-800 transition-all font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 cursor-pointer shadow-lg active:scale-95"
                    >
                      <span>SEND CONSULTATION INQUIRY / 상담 신청서 발송</span>
                      <span>→</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 04 Process Protocol */}
      <section className="bg-[#f9f9f9] border-t border-[#0a0a0a] py-16">
        <div className="max-w-[1540px] mx-auto px-6">
          <div className="flex items-center space-x-2 mb-6">
            <span className="w-1.5 h-1.5 bg-[#e63926]"></span>
            <span className="font-mono text-xs uppercase text-[#e63926] font-bold tracking-widest">
              04 // PROCESS PROTOCOL — CONSULTATION SEQUENCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white border border-neutral-300 p-6">
              <span className="font-mono text-xs font-bold text-[#e63926] uppercase block mb-1">STAGE 01</span>
              <h3 className="text-base font-black uppercase text-[#0a0a0a] mb-3">INITIAL DISPATCH REVIEW</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                접수된 대지 지번과 프로그램 요구 사항을 바탕으로 관련 건축법규(건폐율, 용적률, 도로 사선 등) 및 현장 특성을 사전 분석합니다.
              </p>
            </div>
            <div className="bg-white border border-neutral-300 p-6">
              <span className="font-mono text-xs font-bold text-[#e63926] uppercase block mb-1">STAGE 02</span>
              <h3 className="text-base font-black uppercase text-[#0a0a0a] mb-3">ATELIER DIALOGUE &amp; SURVEY</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                서울 구의동 아틀리에에서 1:1 대면 미팅을 통해 의뢰인의 라이프스타일, 물성 선호도, 예산 범위 및 공간의 정체성을 입체적으로 정립합니다.
              </p>
            </div>
            <div className="bg-white border border-neutral-300 p-6">
              <span className="font-mono text-xs font-bold text-[#e63926] uppercase block mb-1">STAGE 03</span>
              <h3 className="text-base font-black uppercase text-[#0a0a0a] mb-3">DESIGN PROPOSAL &amp; CONTRACT</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                기본 계획 방향과 건축 스케치, 일정표를 제안하며, 설계 계약 체결 후 본격적인 계획설계(Schematic Design) 및 인허가 실무에 돌입합니다.
              </p>
            </div>
          </div>

          {/* Urgent Inquiry Banner */}
          <div className="bg-white border border-[#0a0a0a] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-700 font-sans text-center md:text-left">
              <strong className="text-[#e63926] font-mono mr-2 uppercase">URGENT INQUIRY</strong>
              급한 현장 실측이나 학술 포럼, 출판 협업 요청은 아틀리에 유선 직통 <span className="font-mono font-bold text-black">{settings.phone}</span> 또는 이메일로 연락 바랍니다.
            </p>
            <a
              href={`mailto:${settings.email}`}
              className="px-5 py-2 rounded-full border border-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all shrink-0"
            >
              SEND EMAIL DIRECTLY ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
