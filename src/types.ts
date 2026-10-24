export type PageType = 'home' | 'works' | 'architects' | 'contact' | 'admin';

export interface ProjectPlate {
  id: string;
  src: string;
  caption?: string;
}

export type ProjectCategory =
  | 'Residential'
  | 'Commercial'
  | 'Workplace'
  | 'Culture'
  | 'Public'
  | 'Renovation';

export interface Project {
  id: string;
  number: string; // e.g. 'P_01'
  title: string;
  typology: string; // e.g. 'COMMERCIAL / INTERIOR'
  category: ProjectCategory;
  year: string;
  location: string;
  scaleGfa: string; // e.g. '180 m²'
  aspect: string; // 'aspect-[3/4]' | 'aspect-[16/9]' | 'aspect-[2/3]' | 'aspect-[2/1]' | 'aspect-[4/3]' | 'aspect-auto'
  aspectRatio?: string; // e.g. '16 / 9', '3 / 4', '4 / 3'
  description: string;
  featuredOnHome?: boolean;
  order: number;
  plates: ProjectPlate[];
}

export interface AdminConfig {
  id: string;
  password: string;
}

export interface StudioSettings {
  adminConfig?: AdminConfig;
  studioName: string;
  estYear: string;
  tagline: string;
  heroDescription: string;
  heroImageLeft: string;
  heroImageRight: string;
  philosophyTitle: string;
  philosophyQuote: string;
  philosophyPoints: {
    number: string;
    title: string;
    description: string;
  }[];
  officeAddressKr: string;
  officeAddressEn: string;
  phone: string;
  email: string;
  naverBlogUrl: string;
  instagramUrl?: string;
  drawingRoomImage?: string;
  adminPasswordHash: string; // default hashed/stored
}

export interface InquiryReply {
  id: string;
  sentAt: string;
  sender: string;
  subject: string;
  message: string;
}

export type InquiryStatus = 'NEW' | 'REVIEWING' | 'REPLIED' | 'ARCHIVED';

export interface ConsultationInquiry {
  id: string;
  createdAt: string;
  clientName: string;
  organization: string;
  phone: string;
  email: string;
  typologies: string[];
  siteLocation: string;
  targetScale: string;
  timeline: string;
  estimate: string;
  details: string;
  status: InquiryStatus;
  adminNotes?: string;
  replies: InquiryReply[];
  isRead: boolean;
}

export interface DailyVisitorStat {
  date: string; // 'YYYY-MM-DD'
  pageViews: number;
  uniqueVisitors: number;
  worksViews: number;
  contactViews: number;
  architectsViews: number;
}

export interface VisitorAnalytics {
  totalPageViews: number;
  todayUniqueVisitors: number;
  activeNow: number;
  dailyStats: DailyVisitorStat[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  referrerBreakdown: {
    name: string;
    count: number;
    percentage: number;
  }[];
  launchedAt?: string;
  lastResetAt?: string;
}

