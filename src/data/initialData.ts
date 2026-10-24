// AUTO_GENERATED_BY_ADMIN_CODE_UPDATE: 2026-10-23T12:00:00.000Z
import { Project, StudioSettings, ConsultationInquiry, VisitorAnalytics } from "../types";
import defaultDrawingRoomImage from "../assets/images/drawing_room_empty_1792300107736.jpg";
import rawProjects from "./projects.json";
import rawSettings from "./siteData.json";

export const INITIAL_SETTINGS: StudioSettings = {
  ...(rawSettings as unknown as StudioSettings),
  adminPasswordHash: (rawSettings as any).adminPasswordHash || 'mist2025',
  philosophyPoints: rawSettings.philosophyPoints || [
    {
      number: '01',
      title: 'TECTONIC HONESTY',
      description: '과도한 덧붙임 없이 재료 고유의 본질과 구축의 논리를 정직하게 드러냅니다.'
    },
    {
      number: '02',
      title: 'SPATIAL SILENCE',
      description: '빛과 어둠, 비움과 채움의 침묵 속에서 사유할 수 있는 고요한 공간을 직조합니다.'
    },
    {
      number: '03',
      title: 'TEMPORAL PERMANENCE',
      description: '유행을 좇지 않고 시간의 흐름 속에서 자연스럽게 깊어지는 영속적인 공간을 추구합니다.'
    }
  ],
  drawingRoomImage: rawSettings.drawingRoomImage || defaultDrawingRoomImage,
};

export const INITIAL_PROJECTS: Project[] = rawProjects as unknown as Project[];

export const INITIAL_INQUIRIES: ConsultationInquiry[] = [
  {
    id: 'inq-101',
    createdAt: '2026-10-16 14:32',
    clientName: '김민수',
    organization: '(주)미스트홀딩스 개발기획팀',
    phone: '010-4829-1928',
    email: 'minsu.kim@mistholdings.com',
    typologies: ['신축 건축', '기획 컨설팅'],
    siteLocation: '서울시 강남구 신사동 642번지 일원',
    targetScale: '연면적 약 350평 (1,150㎡), 지하 1층~지상 5층',
    timeline: '2026년 하반기 인허가 착수 희망 (2027년 준공)',
    estimate: '약 35억 ~ 40억 원',
    details:
      '기존 노후 상가주택을 철거하고 부티크 사옥 겸 갤러리 복합 상업건물을 신축하고자 합니다. MIST의 RP BIO 사옥과 같이 절제된 석재 파사드와 깊이감 있는 개구부 설계를 선호하며, 부지 형상에 맞춘 초기 법규 검토 및 규모 검토(Feasibility Study)를 먼저 의뢰드리고 싶습니다.',
    status: 'NEW',
    isRead: false,
    replies: []
  },
  {
    id: 'inq-102',
    createdAt: '2026-10-14 11:15',
    clientName: '박서현',
    organization: '개인 건축주',
    phone: '010-9182-3746',
    email: 'sh.park99@atelier-studio.kr',
    typologies: ['신축 건축'],
    siteLocation: '강원도 양양군 강현면 해안가 대지 (약 200평)',
    targetScale: '연면적 약 75평 (250㎡), 단독주택 겸 프라이빗 작업실',
    timeline: '2027년 봄 착공 희망',
    estimate: '약 12억 ~ 15억 원',
    details:
      '동해안 암반 지형을 마주하는 주택으로 AURA HOUSE의 노출콘크리트 질감과 바다를 담아내는 수평 개구부에 깊은 인상을 받았습니다. 대지 현장 방문 미팅 일정을 상의드리고 싶습니다.',
    status: 'REVIEWING',
    isRead: true,
    adminNotes: '지적도 및 토지이용계획확인원 수령 완료. 1차 유선 브리핑 후 현장 방문 일정 잡을 것.',
    replies: [
      {
        id: 'rep-01',
        sentAt: '2026-10-15 09:30',
        sender: '권혁준 대표건축사',
        subject: '[MIST ARCHITECTURE] 강원 양양 단독주택 프로젝트 상담 회신',
        message:
          '박서현 건축주님, 안녕하세요. MIST ARCHITECTURE 대표 권혁준입니다.\n\n보내주신 대지 정보와 원하시는 공간의 성격을 정독하였습니다. 암반 지형과 동해안의 수평선을 연결하는 작업은 저희가 오랜 시간 연구해 온 Tectonic Honesty의 지향점과도 깊이 맞닿아 있습니다.\n\n대지의 지반 특성 및 도로 사선 등 건축 법규 기본 검토를 마친 후, 구의동 아틀리에에서 1:1 대면 미팅을 진행하고자 합니다. 편하신 날짜(평일 10:00~17:00)를 회신 주시면 일정을 조율해 드리겠습니다.\n\n감사합니다.\n권혁준 배상'
      }
    ]
  },
  {
    id: 'inq-103',
    createdAt: '2026-10-11 16:40',
    clientName: '이진호 실장',
    organization: '(주)어반루트 엔터테인먼트',
    phone: '010-3321-8890',
    email: 'jh.lee@urbanroute.io',
    typologies: ['증개축·대수선', '문화'],
    siteLocation: '서울시 성수동 구 공장지대 (구 벽돌공장)',
    targetScale: '연면적 500평 (1,650㎡)',
    timeline: '2026년 동절기 설계 완료 요망',
    estimate: '약 25억 원 내외',
    details:
      '붉은 벽돌과 철골조가 보존된 구 공장 건물을 복합 문화공간 및 브랜드 쇼룸으로 리노베이션하고자 합니다. GRAIN CYLINDER PRAXIS와 같은 구조적 진정성을 살린 설계를 원합니다.',
    status: 'REPLIED',
    isRead: true,
    adminNotes: '10/18 아틀리에 미팅 완료. 실측 조사 계약서 송부 예정.',
    replies: [
      {
        id: 'rep-02',
        sentAt: '2026-10-12 14:10',
        sender: '김민석 파트너 건축사',
        subject: '[MIST ARCHITECTURE] 성수동 공장 리노베이션 상담 안내',
        message:
          '이진호 실장님, 성수동 대수선 및 리노베이션 프로젝트 문의 감사드립니다. 현장 사진 및 도면을 검토하였으며 미팅을 통해 상세 프로세스를 제안드렸습니다.'
      }
    ]
  }
];

const getInitialDateStr = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const INITIAL_ANALYTICS: VisitorAnalytics = {
  totalPageViews: 0,
  todayUniqueVisitors: 0,
  activeNow: 1,
  dailyStats: [
    {
      date: getInitialDateStr(),
      pageViews: 0,
      uniqueVisitors: 0,
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
    { name: 'Direct (mist-arch.kr / 직접 접속)', count: 0, percentage: 0 },
    { name: 'Naver Search / Naver Blog', count: 0, percentage: 0 },
    { name: 'Instagram (@mist_architecture)', count: 0, percentage: 0 },
    { name: 'Google Search', count: 0, percentage: 0 },
    { name: '기타 포털 / 링크 유입', count: 0, percentage: 0 }
  ],
  launchedAt: '2026-10-18',
  lastResetAt: '2026-10-18'
};
