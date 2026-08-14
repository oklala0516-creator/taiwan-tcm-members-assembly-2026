export type ScheduleItem = {
  id: string;
  start: string;
  end: string;
  title: string;
  place: string;
  detail: string;
  important?: boolean;
};

const base = import.meta.env.BASE_URL;

export const event = {
  title: "中藥材質量管理與源頭管理教育訓練暨科達製藥參訪",
  headline: "從一株藥材，看見品質的每一道堅持",
  dateLabel: "2026.09.19 SAT.",
  date: "2026-09-19",
  start: "2026-09-19T08:40:00+08:00",
  end: "2026-09-19T20:00:00+08:00",
  registrationDeadline: "2026-09-05T23:59:59+08:00",
  timezone: "Asia/Taipei",
  venue: "桃園平鎮",
  organizer: "台灣中藥權益促進會",
  course: {
    name: "中藥材質量管理與源頭管理",
    speaker: "科達製藥總經理特助 陳世豪",
    time: "10:00～12:00",
    place: "科達製藥會議室",
  },
  locations: {
    koda: {
      name: "科達製藥",
      address: "桃園市平鎮區工業三路 20-1 號",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%A1%83%E5%9C%92%E5%B8%82%E5%B9%B3%E9%8E%AE%E5%8D%80%E5%B7%A5%E6%A5%AD%E4%B8%89%E8%B7%AF20-1%E8%99%9F",
    },
    amour: {
      name: "Amour 阿沐餐廳 K1 廳",
      address: "桃園市平鎮區廣仁里延平路二段 371 號",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%A1%83%E5%9C%92%E5%B8%82%E5%B9%B3%E9%8E%AE%E5%8D%80%E5%BB%A3%E4%BB%81%E9%87%8C%E5%BB%B6%E5%B9%B3%E8%B7%AF%E4%BA%8C%E6%AE%B5371%E8%99%9F",
    },
    shuttle: {
      name: "桃園高鐵站 5 號出口",
      address: "桃園高鐵站 5 號出口",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%A1%83%E5%9C%92%E9%AB%98%E9%90%B5%E7%AB%99+5%E8%99%9F%E5%87%BA%E5%8F%A3",
    },
  },
  contact: {
    name: "秘書長唐畇芝（靈芝）",
    phoneDisplay: "0910-915-598",
    phoneHref: "+886910915598",
    email: "tcmy2016@gmail.com",
    lineId: "tcmy2016",
  },
  fees: {
    memberSelf: 500,
    memberShuttle: 600,
    nonMemberTraining: 1000,
    nonMemberDinner: 1000,
    annualMembership: 1800,
  },
  assets: {
    logo: `${base}assets/association-mark-v2.png`,
    mark: `${base}assets/association-mark-v2.png`,
    hero: `${base}assets/hero-ginseng.png`,
    originQuality: `${base}assets/origin-quality.webp`,
    processLegacy: `${base}assets/process-legacy.webp`,
  },
  documents: [
    {
      name: "完整活動通知與流程",
      purpose: "活動說明、費用、行程與會員大會正式通知",
      path: `${base}docs/event-notice-2026.pdf`,
    },
    {
      name: "會員大會委託書",
      purpose: "無法親自出席會員大會時填寫",
      path: `${base}docs/meeting-proxy-form.pdf`,
    },
    {
      name: "會員大會提案表",
      purpose: "9 月 5 日前提出會員大會議案",
      path: `${base}docs/meeting-proposal-form.pdf`,
    },
  ],
} as const;

export const schedule: ScheduleItem[] = [
  { id: "arrival", start: "08:30", end: "08:40", title: "集合與接駁", place: "桃園高鐵站 5 號出口／自行前往", detail: "搭乘接駁車者請於 08:40 集合；自行前往者請於 09:30 前抵達科達製藥。", important: true },
  { id: "checkin", start: "09:30", end: "10:00", title: "報到", place: "科達製藥會議室", detail: "完成活動報到，會員可同時繳交常年會費 1,800 元。" },
  { id: "training", start: "10:00", end: "12:00", title: "中藥材質量管理與源頭管理", place: "科達製藥會議室", detail: "講師：科達製藥總經理特助 陳世豪。" },
  { id: "lunch", start: "12:00", end: "13:00", title: "午餐", place: "科達製藥員工餐廳", detail: "午餐為便當，稍作休息後進入廠區參訪。" },
  { id: "visit", start: "13:00", end: "15:00", title: "科達製藥廠區參訪", place: "科達製藥廠區", detail: "實地觀察現代中藥製程與品質管理。" },
  { id: "transfer", start: "15:00", end: "15:30", title: "前往 Amour 阿沐餐廳", place: "遊覽車接駁／自行開車", detail: "移動至下午會議及餐敘場地。" },
  { id: "meeting-checkin", start: "15:30", end: "16:00", title: "會場準備及報到", place: "Amour 阿沐餐廳 K1 廳", detail: "會員大會會場報到與資料準備。" },
  { id: "board", start: "16:00", end: "16:30", title: "第三屆第五次理監事會議", place: "Amour 阿沐餐廳 K1 廳", detail: "理事、監事請準時參加。" },
  { id: "assembly", start: "16:30", end: "18:00", title: "第三屆第二次會員大會", place: "Amour 阿沐餐廳 K1 廳", detail: "年度重要會議；無法出席者請依規定填寫委託書。", important: true },
  { id: "dinner", start: "18:00", end: "19:30", title: "餐敘聯誼", place: "Amour 阿沐餐廳 K1 廳", detail: "交流聯誼，延續中藥產業夥伴情誼。" },
  { id: "return", start: "19:30", end: "20:00", title: "接駁車前往桃園高鐵站", place: "Amour 阿沐餐廳 → 桃園高鐵站", detail: "搭乘接駁車者請依現場引導上車。", important: true },
];
