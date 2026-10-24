import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageType,
  Project,
  ProjectCategory,
  StudioSettings,
  VisitorAnalytics
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SETTINGS,
  INITIAL_ANALYTICS
} from '../data/initialData';

export const normalizeProjectCategory = (cat: string): ProjectCategory => {
  const c = (cat || '').toUpperCase();
  if (c.includes('RESIDENTIAL')) return 'Residential';
  if (c.includes('COMMERCIAL')) return 'Commercial';
  if (c.includes('WORKPLACE') || c.includes('HEADQUARTERS') || c.includes('OFFICE')) return 'Workplace';
  if (c.includes('CULTURAL') || c.includes('CULTURE')) return 'Culture';
  if (c.includes('PUBLIC') || c.includes('INFRASTRUCTURE') || c.includes('PAVILION')) return 'Public';
  if (c.includes('RENOVATION') || c.includes('ADAPTIVE REUSE')) return 'Renovation';
  return 'Commercial';
};

interface AppContextType {
  page: PageType;
  setPage: (page: PageType) => void;
  projects: Project[];
  saveAllProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleFeatured: (id: string) => void;
  settings: StudioSettings;
  updateSettings: (newSettings: Partial<StudioSettings>) => void;
  analytics: VisitorAnalytics;
  recordPageView: (pageName: PageType) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (idOrPassword: string, passwordInput?: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => void;
  changeAdminCredentials: (newId: string, newPassword: string) => void;
  updateProjectField: (indexOrId: number | string, field: keyof Project, value: any) => void;
  onProjectInput: (indexOrId: number | string, field: keyof Project, value: any) => void;
  activeModalProject: Project | null;
  initialPlateIndex: number;
  openProjectModal: (project: Project, plateIndex?: number) => void;
  closeProjectModal: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  resetAnalytics: () => void;
  resetToDefaults: () => Promise<void>;
  importProjectsJson: (jsonContent: string | Project[]) => { success: boolean; message: string; count?: number };
  importSiteDataJson: (jsonContent: string | StudioSettings) => { success: boolean; message: string };
  exportProjectsJson: () => string;
  exportSiteDataJson: () => string;
  projectsJsonRaw: string;
  siteDataJsonRaw: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayDateStr = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPageState] = useState<PageType>('home');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [settings, setSettings] = useState<StudioSettings>(INITIAL_SETTINGS);
  const [analytics, setAnalytics] = useState<VisitorAnalytics>(INITIAL_ANALYTICS);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [initialPlateIndex, setInitialPlateIndex] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial fetch from data/projects.json & data/siteData.json
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        const projRes = await fetch('data/projects.json').catch(() => fetch('/data/projects.json'));
        if (projRes && projRes.ok) {
          const parsedProj = await projRes.json();
          if (Array.isArray(parsedProj) && parsedProj.length > 0 && isMounted) {
            const normalized = parsedProj.map((p: any) => ({
              ...p,
              category: normalizeProjectCategory(p.category)
            }));
            setProjects(normalized);
          }
        }
      } catch (err) {
        console.warn('Initial fetch for projects.json error:', err);
      }

      try {
        const siteRes = await fetch('data/siteData.json').catch(() => fetch('/data/siteData.json'));
        if (siteRes && siteRes.ok) {
          const parsedSite = await siteRes.json();
          if (parsedSite && typeof parsedSite === 'object' && isMounted) {
            setSettings((prev) => ({ ...prev, ...parsedSite }));
          }
        }
      } catch (err) {
        console.warn('Initial fetch for siteData.json error:', err);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const projectsJsonRaw = JSON.stringify(projects, null, 2);
  const siteDataJsonRaw = JSON.stringify(settings, null, 2);

  // Initial analytics tracking in memory
  useEffect(() => {
    const today = getTodayDateStr();
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const currentDevice = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    const ref = typeof document !== 'undefined' ? document.referrer.toLowerCase() : '';
    let refCategory = 'Direct (mist-arch.kr / 직접 접속)';
    if (ref.includes('naver.com') || ref.includes('blog.naver')) {
      refCategory = 'Naver Search / Naver Blog';
    } else if (ref.includes('instagram.com')) {
      refCategory = 'Instagram (@mist_architecture)';
    } else if (ref.includes('google.com')) {
      refCategory = 'Google Search';
    } else if (ref && !ref.includes(window.location.hostname)) {
      refCategory = '기타 포털 / 링크 유입';
    }

    setAnalytics((prev) => {
      const dailyStats = [...prev.dailyStats];
      const todayIdx = dailyStats.findIndex((item) => item.date === today);

      let updatedDaily = [...dailyStats];
      if (todayIdx >= 0) {
        updatedDaily[todayIdx] = {
          ...updatedDaily[todayIdx],
          pageViews: updatedDaily[todayIdx].pageViews + 1,
          uniqueVisitors: updatedDaily[todayIdx].uniqueVisitors + 1
        };
      } else {
        updatedDaily.push({
          date: today,
          pageViews: 1,
          uniqueVisitors: 1,
          worksViews: 0,
          contactViews: 0,
          architectsViews: 0
        });
      }

      if (updatedDaily.length > 14) {
        updatedDaily = updatedDaily.slice(-14);
      }

      const updatedReferrers = prev.referrerBreakdown.map((r) => {
        if (r.name.includes(refCategory.slice(0, 6)) || r.name === refCategory) {
          return { ...r, count: r.count + 1 };
        }
        return r;
      });
      const totalRefs = updatedReferrers.reduce((sum, item) => sum + item.count, 0);
      const normalizedReferrers = updatedReferrers.map((r) => ({
        ...r,
        percentage: totalRefs > 0 ? Math.round((r.count / totalRefs) * 100) : 0
      }));

      const desktopCount = (prev.deviceBreakdown.desktop || 0) + (currentDevice === 'desktop' ? 1 : 0);
      const mobileCount = (prev.deviceBreakdown.mobile || 0) + (currentDevice === 'mobile' ? 1 : 0);
      const tabletCount = (prev.deviceBreakdown.tablet || 0) + (currentDevice === 'tablet' ? 1 : 0);
      const totalDev = desktopCount + mobileCount + tabletCount;

      const normalizedDevices = {
        desktop: totalDev > 0 ? Math.round((desktopCount / totalDev) * 100) : 100,
        mobile: totalDev > 0 ? Math.round((mobileCount / totalDev) * 100) : 0,
        tablet: totalDev > 0 ? Math.round((tabletCount / totalDev) * 100) : 0
      };

      const todayRecord = updatedDaily.find((item) => item.date === today);

      return {
        ...prev,
        totalPageViews: prev.totalPageViews + 1,
        todayUniqueVisitors: todayRecord ? todayRecord.uniqueVisitors : prev.todayUniqueVisitors + 1,
        activeNow: 1,
        dailyStats: updatedDaily,
        deviceBreakdown: normalizedDevices,
        referrerBreakdown: normalizedReferrers
      };
    });
  }, []);

  const setPage = (newPage: PageType) => {
    setPageState(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    recordPageView(newPage);
  };

  const recordPageView = (pageName: PageType) => {
    const today = getTodayDateStr();
    setAnalytics((prev) => {
      const updatedTotal = prev.totalPageViews + 1;
      const dailyStats = [...prev.dailyStats];
      const todayIdx = dailyStats.findIndex((item) => item.date === today);

      let updatedDaily = [...dailyStats];
      if (todayIdx >= 0) {
        updatedDaily[todayIdx] = {
          ...updatedDaily[todayIdx],
          pageViews: updatedDaily[todayIdx].pageViews + 1,
          worksViews: pageName === 'works' ? updatedDaily[todayIdx].worksViews + 1 : updatedDaily[todayIdx].worksViews,
          contactViews: pageName === 'contact' ? updatedDaily[todayIdx].contactViews + 1 : updatedDaily[todayIdx].contactViews,
          architectsViews:
            pageName === 'architects' ? updatedDaily[todayIdx].architectsViews + 1 : updatedDaily[todayIdx].architectsViews
        };
      } else {
        updatedDaily.push({
          date: today,
          pageViews: 1,
          uniqueVisitors: 1,
          worksViews: pageName === 'works' ? 1 : 0,
          contactViews: pageName === 'contact' ? 1 : 0,
          architectsViews: pageName === 'architects' ? 1 : 0
        });
      }

      const todayRecord = updatedDaily.find((item) => item.date === today);

      return {
        ...prev,
        totalPageViews: updatedTotal,
        todayUniqueVisitors: todayRecord ? todayRecord.uniqueVisitors : prev.todayUniqueVisitors,
        dailyStats: updatedDaily
      };
    });
  };

  // State mutators for projects in memory
  const saveAllProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject = { ...projectData, id: `p_${Date.now()}` } as Project;
    setProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const updateProjectField = (indexOrId: number | string, field: keyof Project, value: any) => {
    onProjectInput(indexOrId, field, value);
  };

  const onProjectInput = (indexOrId: number | string, field: keyof Project, value: any) => {
    setProjects((prevProjects) => {
      let targetIdx = -1;
      if (typeof indexOrId === 'number') {
        targetIdx = indexOrId;
      } else {
        targetIdx = prevProjects.findIndex((p) => p.id === indexOrId);
      }

      if (targetIdx < 0 || targetIdx >= prevProjects.length) {
        return prevProjects;
      }

      return prevProjects.map((p, idx) => {
        if (idx === targetIdx) {
          return { ...p, [field]: value };
        }
        return p;
      });
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, featuredOnHome: !p.featuredOnHome } : p)));
  };

  const updateSettings = (newSettings: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // File Import Functions
  const importProjectsJson = (jsonContent: string | Project[]): { success: boolean; message: string; count?: number } => {
    try {
      let parsed: any = jsonContent;
      if (typeof jsonContent === 'string') {
        parsed = JSON.parse(jsonContent);
      }
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'projects.json 데이터가 올바른 배열(Array) 형식이 아닙니다.' };
      }
      const normalized = parsed.map((p: any) => ({
        ...p,
        category: normalizeProjectCategory(p.category)
      }));
      setProjects(normalized);
      return {
        success: true,
        message: `projects.json 파일에서 총 ${normalized.length}개의 프로젝트 데이터를 성공적으로 불러왔습니다.`,
        count: normalized.length
      };
    } catch (err: any) {
      console.error('importProjectsJson error:', err);
      return { success: false, message: `projects.json 파싱 실패: ${err.message || '유효하지 않은 JSON 데이터입니다.'}` };
    }
  };

  const importSiteDataJson = (jsonContent: string | StudioSettings): { success: boolean; message: string } => {
    try {
      let parsed: any = jsonContent;
      if (typeof jsonContent === 'string') {
        parsed = JSON.parse(jsonContent);
      }
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, message: 'siteData.json 데이터가 올바른 객체(Object) 형식이 아닙니다.' };
      }
      setSettings((prev) => ({ ...prev, ...parsed }));
      return { success: true, message: 'siteData.json 설정 데이터를 성공적으로 불러와 메모리에 반영했습니다.' };
    } catch (err: any) {
      console.error('importSiteDataJson error:', err);
      return { success: false, message: `siteData.json 파싱 실패: ${err.message || '유효하지 않은 JSON 데이터입니다.'}` };
    }
  };

  // File Export Functions
  const exportProjectsJson = (): string => {
    return JSON.stringify(projects, null, 2);
  };

  const exportSiteDataJson = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  // Reset to default files from server
  const resetToDefaults = async () => {
    try {
      const projRes = await fetch(`data/projects.json?t=${Date.now()}`).catch(() => fetch(`/data/projects.json?t=${Date.now()}`));
      if (projRes && projRes.ok) {
        const text = await projRes.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setProjects(parsed.map((p: any) => ({ ...p, category: normalizeProjectCategory(p.category) })));
        }
      } else {
        setProjects(INITIAL_PROJECTS);
      }

      const siteRes = await fetch(`data/siteData.json?t=${Date.now()}`).catch(() => fetch(`/data/siteData.json?t=${Date.now()}`));
      if (siteRes && siteRes.ok) {
        const text = await siteRes.text();
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object') {
          setSettings(parsed);
        }
      } else {
        setSettings(INITIAL_SETTINGS);
      }
    } catch (err) {
      console.error('resetToDefaults error:', err);
      setProjects(INITIAL_PROJECTS);
      setSettings(INITIAL_SETTINGS);
    }
  };

  const loginAdmin = (idOrPassword: string, passwordInput?: string): boolean => {
    const adminId = settings.adminConfig?.id || 'admin';
    const adminPass = settings.adminConfig?.password || settings.adminPasswordHash || 'mist2025';

    if (passwordInput !== undefined) {
      if ((idOrPassword.trim().toLowerCase() === adminId.toLowerCase() || idOrPassword.trim() === 'admin') && passwordInput === adminPass) {
        setIsAdminAuthenticated(true);
        return true;
      }
    } else {
      if (idOrPassword === adminPass) {
        setIsAdminAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const changeAdminPassword = (newPassword: string) => {
    const currentId = settings.adminConfig?.id || 'admin';
    updateSettings({
      adminConfig: { id: currentId, password: newPassword },
      adminPasswordHash: newPassword
    });
  };

  const changeAdminCredentials = (newId: string, newPassword: string) => {
    updateSettings({
      adminConfig: { id: newId || 'admin', password: newPassword },
      adminPasswordHash: newPassword
    });
  };

  const openProjectModal = (project: Project, plateIndex = 0) => {
    setActiveModalProject(project);
    setInitialPlateIndex(plateIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setActiveModalProject(null);
    setInitialPlateIndex(0);
    document.body.style.overflow = '';
  };

  const resetAnalytics = () => {
    const today = getTodayDateStr();
    const freshAnalytics: VisitorAnalytics = {
      totalPageViews: 1,
      todayUniqueVisitors: 1,
      activeNow: 1,
      dailyStats: [
        {
          date: today,
          pageViews: 1,
          uniqueVisitors: 1,
          worksViews: 0,
          contactViews: 0,
          architectsViews: 0
        }
      ],
      deviceBreakdown: {
        desktop: 100,
        mobile: 0,
        tablet: 0
      },
      referrerBreakdown: [
        { name: 'Direct (mist-arch.kr / 직접 접속)', count: 1, percentage: 100 },
        { name: 'Naver Search / Naver Blog', count: 0, percentage: 0 },
        { name: 'Instagram (@mist_architecture)', count: 0, percentage: 0 },
        { name: 'Google Search', count: 0, percentage: 0 },
        { name: '기타 포털 / 링크 유입', count: 0, percentage: 0 }
      ],
      launchedAt: new Date().toISOString().slice(0, 10),
      lastResetAt: new Date().toISOString().slice(0, 10)
    };
    setAnalytics(freshAnalytics);
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        projects,
        saveAllProjects,
        addProject,
        updateProject,
        deleteProject,
        toggleFeatured,
        settings,
        updateSettings,
        analytics,
        recordPageView,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        changeAdminCredentials,
        updateProjectField,
        onProjectInput,
        activeModalProject,
        initialPlateIndex,
        openProjectModal,
        closeProjectModal,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        resetAnalytics,
        resetToDefaults,
        importProjectsJson,
        importSiteDataJson,
        exportProjectsJson,
        exportSiteDataJson,
        projectsJsonRaw,
        siteDataJsonRaw
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
