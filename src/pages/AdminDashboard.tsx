import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectCategory, ProjectPlate } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    projects,
    saveAllProjects,
    addProject,
    updateProject,
    updateProjectField,
    onProjectInput,
    deleteProject,
    settings,
    updateSettings,
    changeAdminCredentials,
    analytics,
    resetAnalytics,
    setPage,
    importProjectsJson,
    importSiteDataJson,
    exportProjectsJson,
    exportSiteDataJson,
    projectsJsonRaw,
    siteDataJsonRaw
  } = useApp();

  // File Input Refs for Import
  const projectsFileInputRef = useRef<HTMLInputElement>(null);
  const siteDataFileInputRef = useRef<HTMLInputElement>(null);

  // Auth State
  const [idInput, setIdInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Password Change Form State inside Settings
  const [adminIdSetting, setAdminIdSetting] = useState(settings.adminConfig?.id || 'admin');
  const [currentPassSetting, setCurrentPassSetting] = useState('');
  const [newPassSetting, setNewPassSetting] = useState('');
  const [confirmPassSetting, setConfirmPassSetting] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  useEffect(() => {
    if (settings.adminConfig?.id) {
      setAdminIdSetting(settings.adminConfig.id);
    }
  }, [settings]);

  // Admin View Tabs
  const [activeTab, setActiveTab] = useState<'projects' | 'settings' | 'jsonFiles' | 'analytics'>('projects');

  // Project Editor Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);
  const [projectForm, setProjectForm] = useState({
    number: '',
    title: '',
    typology: 'COMMERCIAL / INTERIOR',
    category: 'Commercial' as ProjectCategory,
    year: '2025',
    location: 'Seoul',
    scaleGfa: '180 m²',
    aspect: 'aspect-auto',
    aspectRatio: '' as string | undefined,
    description: '',
    order: 1,
    plates: [] as ProjectPlate[]
  });

  // Temp plate form state for single image path/URL addition
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempImageCaption, setTempImageCaption] = useState('');

  // Confirmation Modals
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);

  // Toast feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = loginAdmin(idInput, passwordInput);
    if (!success) {
      setAuthError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } else {
      setPasswordInput('');
    }
  };

  // Helper to reassign order and number matching current array sequence
  const formatProjectsWithSequence = (projArray: Project[]): Project[] => {
    return projArray.map((p, idx) => ({
      ...p,
      order: idx + 1,
      number: `P_${String(idx + 1).padStart(2, '0')}`
    }));
  };

  // Import projects.json File via FileReader API
  const handleProjectsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importProjectsJson(content);
      if (res.success) {
        showToast(`📂 ${res.message}`);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Import siteData.json File via FileReader API
  const handleSiteDataFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importSiteDataJson(content);
      if (res.success) {
        showToast(`📂 ${res.message}`);
        try {
          const parsed = JSON.parse(content);
          if (parsed.adminConfig?.id) setAdminIdSetting(parsed.adminConfig.id);
        } catch {}
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Trigger browser download for projects.json
  const downloadProjectsJson = () => {
    try {
      const projectsToExport = formatProjectsWithSequence(projects);
      const jsonStr = JSON.stringify(projectsToExport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'projects.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('📥 최신 projects.json 파일이 성공적으로 다운로드되었습니다.');
    } catch (err) {
      console.error('Download error:', err);
      alert('projects.json 다운로드 중 오류가 발생했습니다.');
    }
  };

  // Trigger browser download for siteData.json
  const downloadSiteDataJson = () => {
    try {
      const jsonStr = exportSiteDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'siteData.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('📥 최신 siteData.json 파일이 성공적으로 다운로드되었습니다.');
    } catch (err) {
      console.error('Download error:', err);
      alert('siteData.json 다운로드 중 오류가 발생했습니다.');
    }
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 '${label}' 코드가 클립보드에 복사되었습니다.`);
    }).catch((err) => {
      console.error('Clipboard copy error:', err);
      alert('클립보드 복사 중 오류가 발생했습니다.');
    });
  };

  // Move project card UP in list
  const moveProjectUp = (index: number) => {
    if (index === 0) return;
    const updated = [...projects];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;

    const renumbered = formatProjectsWithSequence(updated);
    saveAllProjects(renumbered);
    showToast(`'${renumbered[index - 1].title}' 카드가 위로 이동했습니다.`);
  };

  // Move project card DOWN in list
  const moveProjectDown = (index: number) => {
    if (index >= projects.length - 1) return;
    const updated = [...projects];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;

    const renumbered = formatProjectsWithSequence(updated);
    saveAllProjects(renumbered);
    showToast(`'${renumbered[index + 1].title}' 카드가 아래로 이동했습니다.`);
  };

  // Open Create Project Modal
  const openCreateModal = () => {
    const newId = `p_${Date.now()}`;
    const nextNum = `P_${String(projects.length + 1).padStart(2, '0')}`;
    const newProj: Project = {
      id: newId,
      number: nextNum,
      title: '신규 프로젝트',
      typology: 'COMMERCIAL / INTERIOR',
      category: 'Commercial',
      year: new Date().getFullYear().toString(),
      location: 'Seoul',
      scaleGfa: '180 m²',
      aspect: 'aspect-auto',
      description: '',
      order: projects.length + 1,
      plates: []
    };

    setEditingProject(newProj);
    setIsCreatingProject(true);
    setProjectForm({
      number: newProj.number,
      title: newProj.title,
      typology: newProj.typology,
      category: newProj.category,
      year: newProj.year,
      location: newProj.location,
      scaleGfa: newProj.scaleGfa,
      aspect: newProj.aspect,
      aspectRatio: newProj.aspectRatio,
      description: newProj.description,
      order: newProj.order,
      plates: []
    });
    setTempImageUrl('');
    setTempImageCaption('');
  };

  // Open Edit Project Modal
  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setIsCreatingProject(false);
    setProjectForm({
      number: proj.number || `P_${String(proj.order).padStart(2, '0')}`,
      title: proj.title,
      typology: proj.typology,
      category: proj.category,
      year: proj.year,
      location: proj.location,
      scaleGfa: proj.scaleGfa,
      aspect: proj.aspect || 'aspect-auto',
      aspectRatio: proj.aspectRatio,
      description: proj.description,
      order: proj.order || 1,
      plates: proj.plates ? [...proj.plates] : []
    });
    setTempImageUrl('');
    setTempImageCaption('');
  };

  const handleFormFieldChange = (field: keyof Project, value: any) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  // Add single image plate via text URL/path input
  const handleAddSinglePlate = () => {
    if (!tempImageUrl.trim()) {
      alert('이미지 경로(URL)를 입력해 주세요.');
      return;
    }
    const newPlate: ProjectPlate = {
      id: `plate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      src: tempImageUrl.trim(),
      caption: tempImageCaption.trim() || `0${projectForm.plates.length + 1} — Architectural Plate View`
    };
    const updatedPlates = [...projectForm.plates, newPlate];
    setProjectForm((prev) => ({ ...prev, plates: updatedPlates }));
    setTempImageUrl('');
    setTempImageCaption('');
  };

  // Update image path (src) for a specific plate via text input
  const updatePlateSrc = (index: number, newSrc: string) => {
    const updatedPlates = [...projectForm.plates];
    updatedPlates[index] = {
      ...updatedPlates[index],
      src: newSrc
    };
    setProjectForm((prev) => ({ ...prev, plates: updatedPlates }));
  };

  // Move plate up
  const movePlateUp = (index: number) => {
    if (index === 0) return;
    const plates = [...projectForm.plates];
    const temp = plates[index - 1];
    plates[index - 1] = plates[index];
    plates[index] = temp;
    setProjectForm((prev) => ({ ...prev, plates }));
  };

  // Move plate down
  const movePlateDown = (index: number) => {
    if (index >= projectForm.plates.length - 1) return;
    const plates = [...projectForm.plates];
    const temp = plates[index + 1];
    plates[index + 1] = plates[index];
    plates[index] = temp;
    setProjectForm((prev) => ({ ...prev, plates }));
  };

  // Remove plate
  const removePlate = (index: number) => {
    const plates = projectForm.plates.filter((_, i) => i !== index);
    setProjectForm((prev) => ({ ...prev, plates }));
  };

  // Update caption for a specific plate
  const updatePlateCaption = (index: number, newCaption: string) => {
    const updatedPlates = [...projectForm.plates];
    updatedPlates[index] = {
      ...updatedPlates[index],
      caption: newCaption
    };
    setProjectForm((prev) => ({ ...prev, plates: updatedPlates }));
  };

  // Save/Complete Project Form
  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      alert('프로젝트 제목을 입력해 주세요.');
      return;
    }

    if (isCreatingProject || !editingProject) {
      const newProj: Project = {
        id: editingProject?.id || `p_${Date.now()}`,
        number: projectForm.number.trim(),
        title: projectForm.title.trim(),
        typology: projectForm.typology.trim(),
        category: projectForm.category,
        year: projectForm.year.trim(),
        location: projectForm.location.trim(),
        scaleGfa: projectForm.scaleGfa.trim(),
        aspect: projectForm.aspect,
        aspectRatio: projectForm.aspectRatio,
        description: projectForm.description.trim(),
        order: projects.length + 1,
        plates: projectForm.plates
      };
      const updatedList = formatProjectsWithSequence([newProj, ...projects]);
      saveAllProjects(updatedList);
      showToast(`✨ 새 프로젝트 '${projectForm.title}' 추가가 완료되었습니다.`);
    } else {
      updateProject(editingProject.id, {
        number: projectForm.number.trim(),
        title: projectForm.title.trim(),
        typology: projectForm.typology.trim(),
        category: projectForm.category,
        year: projectForm.year.trim(),
        location: projectForm.location.trim(),
        scaleGfa: projectForm.scaleGfa.trim(),
        aspect: projectForm.aspect,
        aspectRatio: projectForm.aspectRatio,
        description: projectForm.description.trim(),
        order: projectForm.order,
        plates: projectForm.plates
      });
      showToast(`✨ 프로젝트 '${projectForm.title}' 수정이 완료되었습니다.`);
    }

    setIsCreatingProject(false);
    setEditingProject(null);
  };

  // Confirm Delete Project
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    const remaining = projects.filter((p) => p.id !== projectToDelete.id);
    const renumbered = formatProjectsWithSequence(remaining);
    saveAllProjects(renumbered);

    showToast(`🗑️ 프로젝트 '${projectToDelete.title}' 항목이 삭제되었습니다.`);
    setProjectToDelete(null);
  };

  // Change Admin Password Form submit
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    const activePass = settings.adminConfig?.password || settings.adminPasswordHash || 'mist2025';
    if (currentPassSetting !== activePass) {
      setPasswordNotice('❌ 현재 비밀번호가 올바르지 않습니다.');
      return;
    }

    if (!newPassSetting || newPassSetting.length < 4) {
      setPasswordNotice('❌ 새 비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (newPassSetting !== confirmPassSetting) {
      setPasswordNotice('❌ 새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    changeAdminCredentials(adminIdSetting || 'admin', newPassSetting);
    setCurrentPassSetting('');
    setNewPassSetting('');
    setConfirmPassSetting('');
    setPasswordNotice('✅ 비밀번호가 메모리 상의 siteData 객체에 즉시 반영되었습니다. siteData.json 다운로드 시 변경된 내용이 저장됩니다.');
  };

  // Render Login Screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-[#0a0a0a] flex items-center justify-center p-6 font-sans selection:bg-[#0a0a0a] selection:text-white">
        <div className="max-w-md w-full bg-white border-2 border-[#0a0a0a] p-8 md:p-10 shadow-2xl relative">
          <div className="text-center mb-8">
            <span className="font-mono text-xs tracking-[0.25em] text-[#e63926] uppercase block mb-2 font-bold">
              MIST ARCHITECTURE
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#0a0a0a] mb-2 uppercase font-mono">
              관리자 로그인
            </h1>
            <p className="text-xs text-[#666666] leading-relaxed font-medium">
              프로젝트 데이터 및 스튜디오 설정을 관리하기 위해 관리자 계정으로 로그인해 주세요.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase tracking-widest mb-1.5 font-bold">
                ADMIN USER ID (관리자 아이디)
              </label>
              <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                placeholder="아이디 입력 (기본: admin)"
                className="w-full bg-white border border-[#0a0a0a] px-4 py-2.5 text-sm text-[#0a0a0a] font-mono focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                required
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase tracking-widest mb-1.5 font-bold">
                ADMIN PASSWORD (비밀번호)
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호 입력 (기본: mist2025)"
                className="w-full bg-white border border-[#0a0a0a] px-4 py-2.5 text-sm text-[#0a0a0a] font-mono focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                required
                autoFocus
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-600 text-red-700 px-3 py-2 text-xs flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0a0a0a] text-white hover:bg-[#e63926] py-3 text-xs font-mono uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>ACCESS DASHBOARD</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#e5e5e5] text-center">
            <button
              onClick={() => setPage('home')}
              className="text-xs text-[#666666] hover:text-[#0a0a0a] transition-colors font-mono flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">west</span>
              <span>메인 홈페이지로 돌아가기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] pt-20 pb-24 font-sans selection:bg-[#0a0a0a] selection:text-white">
      {/* Hidden File Inputs for Import */}
      <input
        type="file"
        ref={projectsFileInputRef}
        accept=".json"
        onChange={handleProjectsFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={siteDataFileInputRef}
        accept=".json"
        onChange={handleSiteDataFileUpload}
        className="hidden"
      />

      {/* Toast Feedback Notification */}
      {feedback && (
        <div className="fixed top-24 right-6 z-50 bg-[#0a0a0a] text-white px-5 py-3 border border-black shadow-2xl flex items-center gap-3 transition-all animate-bounce max-w-lg">
          <span className="material-symbols-outlined text-emerald-400 text-sm shrink-0">check_circle</span>
          <span className="text-xs font-mono uppercase tracking-wide font-bold">{feedback}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Import / Export Action Buttons */}
        <div className="border-b-2 border-[#0a0a0a] pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#e63926] uppercase font-bold">
                SYSTEM ADMINISTRATION
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                <span>📁 JSON FILE MANAGEMENT &amp; URL PATH WORKFLOW</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0a0a0a] uppercase font-mono">
              MIST ARCHITECTURE — PROJECT &amp; SITE MANAGEMENT
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => projectsFileInputRef.current?.click()}
              className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 text-[#0a0a0a] text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#0a0a0a] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="컴퓨터의 projects.json 파일 불러오기"
            >
              <span className="material-symbols-outlined text-base text-[#e63926]">file_open</span>
              <span>기존 projects.json 불러오기</span>
            </button>

            <button
              onClick={() => siteDataFileInputRef.current?.click()}
              className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 text-[#0a0a0a] text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#0a0a0a] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="컴퓨터의 siteData.json 파일 불러오기"
            >
              <span className="material-symbols-outlined text-base text-[#e63926]">file_open</span>
              <span>기존 siteData.json 불러오기</span>
            </button>

            <button
              onClick={downloadProjectsJson}
              className="px-3.5 py-2.5 bg-[#0a0a0a] hover:bg-[#e63926] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>projects.json 다운로드</span>
            </button>

            <button
              onClick={downloadSiteDataJson}
              className="px-3.5 py-2.5 bg-[#0a0a0a] hover:bg-[#e63926] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>siteData.json 다운로드</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-xs font-mono text-red-600 border border-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>로그아웃</span>
            </button>
          </div>
        </div>

        {/* Import/Export Workflow Notice Banner */}
        <div className="bg-[#f8f8f8] border-2 border-[#0a0a0a] p-5 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 font-mono font-bold text-lg">
              📂
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm sm:text-base font-bold text-[#0a0a0a] uppercase tracking-tight font-mono flex items-center gap-2">
                <span>파일 업로드(Import) 및 다운로드(Export) 관리 워크플로우</span>
              </h2>
              <p className="text-xs text-[#333333] leading-relaxed font-medium">
                1) 대시보드 상단의 <strong>[기존 projects.json 불러오기]</strong> 및 <strong>[기존 siteData.json 불러오기]</strong> 버튼을 이용해 보관 중인 최신 JSON 파일의 데이터를 대시보드로 읽어올 수 있습니다.<br />
                2) 프로젝트 이미지 등록 시 Base64 변환 방식이 완전히 제거되었으며, <strong>"/images/projects/p01_01.jpg"</strong>와 같은 텍스트 경로(URL) 형태로 가볍게 관리됩니다.<br />
                3) 작업 완료 후 상단의 <strong>[projects.json 다운로드]</strong> 및 <strong>[siteData.json 다운로드]</strong> 버튼을 클릭하여 최종 파일로 다운로드받아 보관하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#0a0a0a] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] font-bold shadow-lg'
                : 'bg-white text-[#666666] border-[#cccccc] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>프로젝트 카드 관리 ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] font-bold shadow-lg'
                : 'bg-white text-[#666666] border-[#cccccc] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            <span>스튜디오 일반 설정 &amp; 비밀번호 변경</span>
          </button>

          <button
            onClick={() => setActiveTab('jsonFiles')}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'jsonFiles'
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] font-bold shadow-lg'
                : 'bg-white text-[#666666] border-[#cccccc] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">file_download</span>
            <span>JSON 파일 다운로드 &amp; 원본 코드</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] font-bold shadow-lg'
                : 'bg-white text-[#666666] border-[#cccccc] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">monitoring</span>
            <span>방문자 통계</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8f8f8] border border-[#0a0a0a] p-5">
              <div>
                <h2 className="text-lg font-black text-[#0a0a0a] uppercase font-mono flex items-center gap-2">
                  <span>프로젝트 목록 (가로형 1행 1카드 배치)</span>
                </h2>
                <p className="text-xs text-[#e63926] font-mono font-bold mt-1">
                  💡 상위 3개 카드가 메인 화면 'SELECTED WORKS CORPUS'에 순서대로 노출되며, 순서 변경 시 프로젝트 번호(P_01, P_02...)가 자동 재계산됩니다.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openCreateModal}
                  className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>새 프로젝트 추가</span>
                </button>

                <button
                  onClick={downloadProjectsJson}
                  className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>projects.json 다운로드</span>
                </button>
              </div>
            </div>

            {/* Project Cards List */}
            <div className="space-y-4">
              {projects.map((proj, idx) => {
                const isTop3 = idx < 3;
                const landingLabel =
                  idx === 0
                    ? '1ST LANDING SELECTED WORK (MAIN)'
                    : idx === 1
                    ? '2ND LANDING SELECTED WORK'
                    : idx === 2
                    ? '3RD LANDING SELECTED WORK'
                    : null;

                const currentNumber = `P_${String(idx + 1).padStart(2, '0')}`;

                return (
                  <div
                    key={proj.id || idx}
                    className={`bg-white border p-5 transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                      isTop3
                        ? 'border-2 border-[#0a0a0a] bg-amber-50/20'
                        : 'border-[#0a0a0a] hover:border-[#e63926]'
                    }`}
                  >
                    {/* Left: Image Thumbnail */}
                    <div className="w-full lg:w-64 shrink-0">
                      <div className="aspect-[16/10] bg-[#f0f0f0] border border-[#0a0a0a] overflow-hidden relative group">
                        {proj.plates && proj.plates[0]?.src ? (
                          <img
                            src={proj.plates[0].src}
                            alt={proj.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#888] font-mono text-xs">
                            NO IMAGE
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold border border-white">
                          PLATES: {proj.plates ? proj.plates.length : 0}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Info & Metadata */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-white uppercase font-bold tracking-widest bg-[#0a0a0a] px-2.5 py-0.5">
                          {currentNumber}
                        </span>

                        <span className="px-2.5 py-0.5 bg-[#f0f0f0] text-[#0a0a0a] border border-[#ccc] text-[10px] font-mono uppercase font-bold">
                          {proj.category}
                        </span>

                        {landingLabel && (
                          <span className="bg-[#e63926] text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                            ★ {landingLabel}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black text-[#0a0a0a] uppercase tracking-tight font-mono">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-[#444444] line-clamp-2 leading-relaxed max-w-3xl">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#666666] pt-1">
                        <span><strong>TYPOLOGY:</strong> {proj.typology}</span>
                        <span>•</span>
                        <span><strong>YEAR:</strong> {proj.year}</span>
                        <span>•</span>
                        <span><strong>LOCATION:</strong> {proj.location}</span>
                        <span>•</span>
                        <span><strong>SCALE:</strong> {proj.scaleGfa}</span>
                      </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-2 w-full lg:w-48 shrink-0 border-t lg:border-t-0 lg:border-l border-[#e5e5e5] pt-4 lg:pt-0 lg:pl-6">
                      <div className="font-mono text-[10px] text-[#888888] uppercase font-bold text-center mb-1">
                        POSITION #{idx + 1} ({currentNumber})
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => moveProjectUp(idx)}
                          disabled={idx === 0}
                          className="py-2 px-3 bg-[#f0f0f0] hover:bg-[#0a0a0a] hover:text-white disabled:opacity-25 disabled:hover:bg-[#f0f0f0] disabled:hover:text-[#0a0a0a] text-xs font-mono uppercase font-bold border border-[#0a0a0a] transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="카드 위로 이동"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                          <span>위로</span>
                        </button>

                        <button
                          onClick={() => moveProjectDown(idx)}
                          disabled={idx === projects.length - 1}
                          className="py-2 px-3 bg-[#f0f0f0] hover:bg-[#0a0a0a] hover:text-white disabled:opacity-25 disabled:hover:bg-[#f0f0f0] disabled:hover:text-[#0a0a0a] text-xs font-mono uppercase font-bold border border-[#0a0a0a] transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="카드 아래로 이동"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                          <span>아래로</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="bg-[#0a0a0a] hover:bg-[#e63926] text-white py-2 px-3 text-xs font-mono uppercase font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>수정</span>
                        </button>

                        <button
                          onClick={() => setProjectToDelete({ id: proj.id, title: proj.title })}
                          className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 py-2 px-3 text-xs font-mono uppercase border border-red-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          title="프로젝트 삭제"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO SETTINGS & ADMIN PASSWORD CHANGE */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-[#f8f8f8] border border-[#0a0a0a] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0a] uppercase font-mono">
                  스튜디오 일반 설정 &amp; 관리자 로그인 설정
                </h2>
                <p className="text-xs text-[#666666] mt-1">
                  수정 사항은 메모리 상의 siteData 객체에 즉시 반영되며, siteData.json 다운로드 시 함께 보존됩니다.
                </p>
              </div>

              <button
                onClick={downloadSiteDataJson}
                className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>siteData.json 다운로드</span>
              </button>
            </div>

            {/* SECTION 1: ADMIN ID & PASSWORD CHANGE FORM */}
            <div className="bg-white border-2 border-[#0a0a0a] p-6 space-y-6 shadow-md">
              <div className="border-b border-[#0a0a0a] pb-3 flex items-center justify-between">
                <h3 className="text-base font-black text-[#0a0a0a] uppercase font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">lock</span>
                  <span>관리자 계정 및 비밀번호 변경</span>
                </h3>
                <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 border border-amber-300">
                  siteData.json (adminConfig) SYNCED
                </span>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-xl text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    ADMIN USER ID (관리자 아이디)
                  </label>
                  <input
                    type="text"
                    value={adminIdSetting}
                    onChange={(e) => setAdminIdSetting(e.target.value)}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    CURRENT PASSWORD (현재 비밀번호)
                  </label>
                  <input
                    type="password"
                    value={currentPassSetting}
                    onChange={(e) => setCurrentPassSetting(e.target.value)}
                    placeholder="현재 비밀번호 (기본: mist2025)"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                      NEW PASSWORD (새 비밀번호)
                    </label>
                    <input
                      type="password"
                      value={newPassSetting}
                      onChange={(e) => setNewPassSetting(e.target.value)}
                      placeholder="최소 4자 이상 입력"
                      className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                      CONFIRM NEW PASSWORD (새 비밀번호 확인)
                    </label>
                    <input
                      type="password"
                      value={confirmPassSetting}
                      onChange={(e) => setConfirmPassSetting(e.target.value)}
                      placeholder="새 비밀번호 재입력"
                      className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                      required
                    />
                  </div>
                </div>

                {passwordNotice && (
                  <div
                    className={`p-3 text-xs font-medium border ${
                      passwordNotice.startsWith('✅')
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-red-50 border-red-500 text-red-800'
                    }`}
                  >
                    {passwordNotice}
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  비밀번호 변경 및 siteData 업데이트
                </button>
              </form>
            </div>

            {/* SECTION 2: STUDIO INFO & META */}
            <div className="bg-white border-2 border-[#0a0a0a] p-6 space-y-6 shadow-md">
              <div className="border-b border-[#0a0a0a] pb-3">
                <h3 className="text-base font-black text-[#0a0a0a] uppercase font-mono">
                  스튜디오 인적사항 및 연락처 설정
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    STUDIO NAME (스튜디오명)
                  </label>
                  <input
                    type="text"
                    value={settings.studioName || ''}
                    onChange={(e) => updateSettings({ studioName: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    ESTABLISHED YEAR (설립 연도)
                  </label>
                  <input
                    type="text"
                    value={settings.estYear || ''}
                    onChange={(e) => updateSettings({ estYear: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    TAGLINE (스튜디오 슬로건)
                  </label>
                  <input
                    type="text"
                    value={settings.tagline || ''}
                    onChange={(e) => updateSettings({ tagline: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    HERO DESCRIPTION (메인 소개글)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroDescription || ''}
                    onChange={(e) => updateSettings({ heroDescription: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] p-3 text-[#0a0a0a] font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    PHONE (전화번호)
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => updateSettings({ phone: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    EMAIL (대표 이메일)
                  </label>
                  <input
                    type="text"
                    value={settings.email || ''}
                    onChange={(e) => updateSettings({ email: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    NAVER BLOG URL (네이버 블로그 주소)
                  </label>
                  <input
                    type="text"
                    value={settings.naverBlogUrl || ''}
                    onChange={(e) => updateSettings({ naverBlogUrl: e.target.value })}
                    placeholder="https://blog.naver.com/..."
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    INSTAGRAM URL (인스타그램 주소)
                  </label>
                  <input
                    type="text"
                    value={settings.instagramUrl || ''}
                    onChange={(e) => updateSettings({ instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    OFFICE ADDRESS KR (국문 주소)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.officeAddressKr || ''}
                    onChange={(e) => updateSettings({ officeAddressKr: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] p-2 text-[#0a0a0a] font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    OFFICE ADDRESS EN (영문 주소)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.officeAddressEn || ''}
                    onChange={(e) => updateSettings({ officeAddressEn: e.target.value })}
                    className="w-full bg-white border border-[#0a0a0a] p-2 text-[#0a0a0a] font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JSON FILES VIEW & EXPORT */}
        {activeTab === 'jsonFiles' && (
          <div className="space-y-8">
            <div className="bg-[#f8f8f8] border border-[#0a0a0a] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0a] uppercase font-mono">
                  JSON 파일 다운로드 &amp; 원본 소스코드
                </h2>
                <p className="text-xs text-[#666666] mt-1">
                  현재 메모리의 최신 데이터를 JSON 형태로 다운로드하거나 클립보드에 복사할 수 있습니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadProjectsJson}
                  className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-4 py-2 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                >
                  projects.json 다운로드
                </button>
                <button
                  onClick={downloadSiteDataJson}
                  className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-4 py-2 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                >
                  siteData.json 다운로드
                </button>
              </div>
            </div>

            {/* projects.json Raw Block */}
            <div className="bg-white border-2 border-[#0a0a0a] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#0a0a0a] pb-3">
                <h3 className="text-base font-black text-[#0a0a0a] uppercase font-mono">
                  projects.json ({projects.length} PROJECTS INDEXED)
                </h3>
                <button
                  onClick={() => copyToClipboard(projectsJsonRaw, 'projects.json')}
                  className="bg-[#f0f0f0] hover:bg-[#0a0a0a] hover:text-white px-3 py-1.5 text-xs font-mono uppercase font-bold border border-[#0a0a0a] transition-all cursor-pointer"
                >
                  클립보드 전체 복사
                </button>
              </div>

              <pre className="bg-[#0a0a0a] text-emerald-400 p-4 text-xs font-mono overflow-x-auto max-h-96 border border-black selection:bg-emerald-900">
                {projectsJsonRaw}
              </pre>
            </div>

            {/* siteData.json Raw Block */}
            <div className="bg-white border-2 border-[#0a0a0a] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#0a0a0a] pb-3">
                <h3 className="text-base font-black text-[#0a0a0a] uppercase font-mono">
                  siteData.json (SETTINGS &amp; ADMIN CONFIG)
                </h3>
                <button
                  onClick={() => copyToClipboard(siteDataJsonRaw, 'siteData.json')}
                  className="bg-[#f0f0f0] hover:bg-[#0a0a0a] hover:text-white px-3 py-1.5 text-xs font-mono uppercase font-bold border border-[#0a0a0a] transition-all cursor-pointer"
                >
                  클립보드 전체 복사
                </button>
              </div>

              <pre className="bg-[#0a0a0a] text-amber-300 p-4 text-xs font-mono overflow-x-auto max-h-96 border border-black selection:bg-amber-900">
                {siteDataJsonRaw}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#f8f8f8] border border-[#0a0a0a] p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0a] uppercase font-mono">
                  방문자 통계 리포트
                </h2>
                <p className="text-xs text-[#666666] mt-1">
                  실시간 페이지 뷰 및 기기/유입 경로 분석입니다.
                </p>
              </div>
              <button
                onClick={() => {
                  resetAnalytics();
                  showToast('📊 통계 데이터가 리셋되었습니다.');
                }}
                className="bg-white hover:bg-red-600 hover:text-white text-xs font-mono text-[#0a0a0a] border border-[#0a0a0a] px-3 py-1.5 transition-colors cursor-pointer"
              >
                통계 초기화
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-[#0a0a0a] p-6 text-center">
                <span className="font-mono text-xs text-[#888] uppercase block">TOTAL PAGE VIEWS</span>
                <span className="font-mono text-4xl font-black text-[#0a0a0a] mt-2 block">
                  {analytics.totalPageViews}
                </span>
              </div>
              <div className="bg-white border-2 border-[#0a0a0a] p-6 text-center">
                <span className="font-mono text-xs text-[#888] uppercase block">TODAY UNIQUE VISITORS</span>
                <span className="font-mono text-4xl font-black text-[#e63926] mt-2 block">
                  {analytics.todayUniqueVisitors}
                </span>
              </div>
              <div className="bg-white border-2 border-[#0a0a0a] p-6 text-center">
                <span className="font-mono text-xs text-[#888] uppercase block">ACTIVE NOW</span>
                <span className="font-mono text-4xl font-black text-emerald-600 mt-2 block">
                  {analytics.activeNow}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {(isCreatingProject || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#0a0a0a] max-w-4xl w-full p-6 my-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#0a0a0a] pb-4">
              <h3 className="text-lg font-black text-[#0a0a0a] uppercase font-mono">
                {isCreatingProject ? '새 프로젝트 추가' : `프로젝트 편집 — ${projectForm.title}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingProject(false);
                  setEditingProject(null);
                }}
                className="text-xs font-mono text-[#888] hover:text-[#0a0a0a] cursor-pointer"
              >
                ✕ 닫기
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    PROJECT NUMBER (프로젝트 번호)
                  </label>
                  <input
                    type="text"
                    value={projectForm.number}
                    onChange={(e) => handleFormFieldChange('number', e.target.value)}
                    placeholder="예: P_01"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    CATEGORY (카테고리)
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => handleFormFieldChange('category', e.target.value as ProjectCategory)}
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-mono"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Workplace">Workplace</option>
                    <option value="Culture">Culture</option>
                    <option value="Public">Public</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    PROJECT TITLE (프로젝트 제목)
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => handleFormFieldChange('title', e.target.value)}
                    placeholder="프로젝트 제목 입력"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    TYPOLOGY (유형)
                  </label>
                  <input
                    type="text"
                    value={projectForm.typology}
                    onChange={(e) => handleFormFieldChange('typology', e.target.value)}
                    placeholder="예: COMMERCIAL / INTERIOR"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    YEAR (연도)
                  </label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => handleFormFieldChange('year', e.target.value)}
                    placeholder="예: 2025"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    LOCATION (위치)
                  </label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => handleFormFieldChange('location', e.target.value)}
                    placeholder="예: Seoul"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    SCALE / GFA (규모)
                  </label>
                  <input
                    type="text"
                    value={projectForm.scaleGfa}
                    onChange={(e) => handleFormFieldChange('scaleGfa', e.target.value)}
                    placeholder="예: 180 m²"
                    className="w-full bg-white border border-[#0a0a0a] px-3 py-2 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] text-[#0a0a0a] uppercase mb-1 font-bold">
                    DESCRIPTION (프로젝트 설명)
                  </label>
                  <textarea
                    rows={4}
                    value={projectForm.description}
                    onChange={(e) => handleFormFieldChange('description', e.target.value)}
                    placeholder="프로젝트 상세 설명 입력"
                    className="w-full bg-white border border-[#0a0a0a] p-3 leading-relaxed"
                  />
                </div>
              </div>

              {/* Plates Section (Text URL Input & Preview Only) */}
              <div className="border-t-2 border-[#0a0a0a] pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-mono text-xs font-bold text-[#0a0a0a] uppercase">
                    상세 플레이트 이미지 목록 ({projectForm.plates.length}장)
                  </h4>
                  <span className="text-[11px] font-mono text-[#666]">
                    이미지 파일 업로드(Base64) 방식이 제거되었으며, 텍스트 경로(URL)로 입력됩니다.
                  </span>
                </div>

                {/* Plates list with live preview and text input for src */}
                <div className="space-y-3 max-h-72 overflow-y-auto p-2 border border-[#eee]">
                  {projectForm.plates.length === 0 ? (
                    <div className="text-center py-6 text-neutral-400 font-mono text-xs">
                      등록된 이미지가 없습니다. 아래 입력창을 통해 이미지 경로를 추가해 주세요.
                    </div>
                  ) : (
                    projectForm.plates.map((plate, pIdx) => (
                      <div
                        key={plate.id || pIdx}
                        className="flex flex-col sm:flex-row items-center gap-3 bg-[#f9f9f9] border border-[#ccc] p-3"
                      >
                        {/* Live Image Preview */}
                        <div className="w-20 h-14 bg-neutral-200 border border-[#0a0a0a] overflow-hidden shrink-0">
                          {plate.src ? (
                            <img
                              src={plate.src}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400 font-mono">
                              NO PREVIEW
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div>
                            <label className="block font-mono text-[9px] text-[#666] uppercase mb-0.5">IMAGE PATH / URL (이미지 경로)</label>
                            <input
                              type="text"
                              value={plate.src || ''}
                              onChange={(e) => updatePlateSrc(pIdx, e.target.value)}
                              placeholder="/images/projects/p01_01.jpg"
                              className="w-full bg-white border border-[#ccc] px-2.5 py-1 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[9px] text-[#666] uppercase mb-0.5">CAPTION (캡션)</label>
                            <input
                              type="text"
                              value={plate.caption || ''}
                              onChange={(e) => updatePlateCaption(pIdx, e.target.value)}
                              placeholder="이미지 캡션 입력"
                              className="w-full bg-white border border-[#ccc] px-2.5 py-1 text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => movePlateUp(pIdx)}
                            disabled={pIdx === 0}
                            className="p-1.5 text-xs border bg-white disabled:opacity-20 cursor-pointer"
                            title="위로 이동"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => movePlateDown(pIdx)}
                            disabled={pIdx === projectForm.plates.length - 1}
                            className="p-1.5 text-xs border bg-white disabled:opacity-20 cursor-pointer"
                            title="아래로 이동"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => removePlate(pIdx)}
                            className="p-1.5 text-xs text-red-600 border border-red-300 bg-red-50 cursor-pointer"
                            title="삭제"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Single Image URL / Path input */}
                <div className="bg-[#f8f8f8] p-3 border border-[#ddd] space-y-2">
                  <span className="font-mono text-[10px] text-[#555] font-bold uppercase block">
                    새 플레이트 이미지 경로(URL) 및 캡션 추가
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      placeholder="이미지 경로 입력 (예: /images/projects/p01_01.jpg)"
                      className="flex-1 bg-white border border-[#0a0a0a] px-3 py-1.5 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={tempImageCaption}
                      onChange={(e) => setTempImageCaption(e.target.value)}
                      placeholder="이미지 캡션"
                      className="w-full sm:w-56 bg-white border border-[#0a0a0a] px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSinglePlate}
                      className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-4 py-1.5 text-xs font-mono font-bold uppercase cursor-pointer shrink-0"
                    >
                      플레이트 추가
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-[#0a0a0a] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProject(false);
                    setEditingProject(null);
                  }}
                  className="bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#0a0a0a] px-5 py-2.5 text-xs font-mono uppercase font-bold border border-[#0a0a0a] cursor-pointer"
                >
                  닫기
                </button>

                <button
                  type="submit"
                  className="bg-[#0a0a0a] hover:bg-[#e63926] text-white px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {isCreatingProject ? '프로젝트 저장' : '편집 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0a0a0a] max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-bold text-[#0a0a0a] uppercase font-mono">
                프로젝트 삭제 확인
              </h3>
            </div>

            <p className="text-xs text-[#333333] leading-relaxed font-medium">
              정말로 프로젝트 <strong className="text-[#0a0a0a]">'{projectToDelete.title}'</strong> 항목을 삭제하시겠습니까?
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0a0a0a]">
              <button
                onClick={() => setProjectToDelete(null)}
                className="bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#0a0a0a] px-4 py-2 text-xs font-mono uppercase border border-[#0a0a0a] cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                프로젝트 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
