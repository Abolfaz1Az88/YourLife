// Game Logic - Core formulas, types, and state management

export type Pillar = 'str' | 'vit' | 'int' | 'fin' | 'per';
export type Rank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'very_hard';
export type HunterClass = 'vanguard' | 'sage' | 'strategist' | 'ascetic' | 'warden' | null;
export type Mood = 'great' | 'good' | 'ok' | 'hard' | 'frustrated';

export interface PillarStat {
  level: number;
  xp: number;
  promotionPending: boolean;
}

export interface Task {
  id: string;
  pillar: Pillar;
  title: string;
  durationMinutes: number;
  difficulty: Difficulty;
  source: 'fixed' | 'ai_bonus' | 'user_custom';
  slug?: string;
}

export interface TaskLog {
  taskId: string;
  date: string;
  done: boolean;
  mood?: Mood;
  feeling?: string;
}

export interface OnboardingData {
  username: string;
  age: number;
  height: number;
  weight: number;
  strengthGoal: 'cut' | 'bulk' | 'recomp' | 'endurance' | 'maintain';
  physicalLimits: string[];
  location: 'home' | 'gym';
  baseFitness: number; // 0-5 pushups/pullups/squats count
  vitActivities: string[];
  vitRewards: string[];
  financialGoal: 'save' | 'cut_costs' | 'debt' | 'invest' | 'income';
}

export interface GameState {
  authenticated: boolean;
  onboardingDone: boolean;
  onboarding: OnboardingData | null;
  coins: number;
  streak: number;
  lastActiveDate: string;
  streakFreezes: number;
  legendCycles: number;
  hunterClass: HunterClass;
  firstQuestDone: boolean;
  focusModeEnabled: boolean;
  reminderHour: number | null;
  pillarStats: Record<Pillar, PillarStat>;
  tasks: Task[];
  taskLogs: TaskLog[];
  achievements: string[];
  redeemedRewards: string[];
  dungeons: DungeonProgress[];
  tradeJournal: TradeJournalEntry[];
  tradeWatchlist: WatchlistItem[];
  tradePositions: TradePosition[];
  tradeSettings: TradeSettings;
  focusPillars: [Pillar, Pillar];
  phase: 'login' | 'onboarding' | 'first-quest' | 'dashboard';
}

export interface DungeonProgress {
  id: string;
  title: string;
  description: string;
  pillarFocus: Pillar[];
  durationDays: number;
  type: 'challenge' | 'trial';
  startedAt: string;
  completedAt?: string;
  questLog: { id: string; title: string; done: boolean; date: string }[];
}

export interface TradeJournalEntry {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  capital: number;
  leverage: number;
  riskPercent: number;
  moodTag?: string;
  reason?: string;
  pnlAmount: number;
  pnlPercent: number;
  realizedR: number | null;
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  triggered: boolean;
}

export interface TradePosition {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  capital: number;
  leverage: number;
  riskPercent: number;
  rr: number;
  positionSize: number;
  riskAmount: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  status: 'open' | 'closed';
  trailStage: number;
  openedAt: string;
}

export interface TradeSettings {
  baseCapital: number;
  dailyLossLimitPercent: number;
  totalRiskCapPercent: number;
}

// Constants
export const RANK_ORDER: Rank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
export const RANK_THRESHOLDS: Record<Rank, number> = { F: 1, E: 5, D: 10, C: 18, B: 28, A: 42, S: 60 };
export const RANK_MULTIPLIER: Record<Rank, number> = { F: 1.0, E: 1.15, D: 1.35, C: 1.6, B: 2.0, A: 2.5, S: 3.2 };
export const RANK_COLORS: Record<Rank, string> = {
  F: '#5b6480', E: '#5c8cff', D: '#57f2c4', C: '#b37cff',
  B: '#ff9d4d', A: '#ff62a8', S: 'holo'
};

export const PILLAR_COLORS: Record<Pillar, string> = {
  str: '#ff6a4d', vit: '#57f2c4', int: '#5c8cff', fin: '#ffc15e', per: '#b37cff'
};

export const PILLAR_NAMES: Record<Pillar, string> = {
  str: 'قدرت', vit: 'سرزندگی', int: 'هوش', fin: 'مالی', per: 'تمرکز'
};

export const PILLAR_ICONS: Record<Pillar, string> = {
  str: '💪', vit: '🌿', int: '🧠', fin: '💰', per: '🧘'
};

export const MOODS: { key: Mood; label: string; emoji: string }[] = [
  { key: 'great', label: 'عالی', emoji: '😄' },
  { key: 'good', label: 'خوب', emoji: '🙂' },
  { key: 'ok', label: 'معمولی', emoji: '😐' },
  { key: 'hard', label: 'سخت‌بود', emoji: '😔' },
  { key: 'frustrated', label: 'کلافه‌کننده', emoji: '😤' },
];

export const ACHIEVEMENTS = [
  { id: 'first_quest', title: 'اولین قدم', desc: 'حداقل ۱ تسک امروز' },
  { id: 'streak_3', title: 'سه‌روزه', desc: 'استریک ≥ ۳' },
  { id: 'streak_7', title: 'یک‌هفته‌ای', desc: 'استریک ≥ ۷' },
  { id: 'rank_d', title: 'شکارچی', desc: 'رتبه‌ی هانتر به D برسه' },
  { id: 'rank_c', title: 'ماهر', desc: 'رتبه‌ی هانتر به C برسه' },
  { id: 'class_awakening', title: 'بیداری کلاس', desc: 'انتخاب اولین کلاس هانتر' },
  { id: 'first_trial', title: 'آزمون گذر', desc: 'رد کردن اولین آزمون ارتقا' },
  { id: 'all_pillars', title: 'تعادل کامل', desc: 'هر ۵ پیلار حداقل یک تسک' },
  { id: 'first_reward', title: 'اولین جایزه', desc: 'اولین خرید از فروشگاه' },
  { id: 'str_streak_10', title: 'استقامت', desc: '۱۰ روز پشت سر هم تسک قدرت' },
  { id: 'fin_streak_4w', title: 'نظم مالی', desc: '۴ هفته پشت سر هم تسک مالی' },
  { id: 'per_streak_7', title: 'ذهن آرام', desc: '۷ روز پشت سر هم تسک تمرکز' },
  { id: 'full_month_balance', title: 'تعادل ماهانه', desc: 'تعادل کامل در طول یک ماه' },
  { id: 'first_ascend', title: 'افسانه', desc: 'رسیدن به سطح Legend' },
];

// Formulas
export function rankForLevel(level: number): Rank {
  let current: Rank = 'F';
  for (const r of RANK_ORDER) {
    if (level >= RANK_THRESHOLDS[r]) current = r;
  }
  return current;
}

export function xpToNextLevel(level: number): number {
  const base = 60 + level * 15;
  return Math.round(base * RANK_MULTIPLIER[rankForLevel(level)]);
}

const BASE_PER_MINUTE = 1.1;
const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 0.8, normal: 1.0, hard: 1.35, very_hard: 1.7
};

export function xpForTask(durationMinutes: number, difficulty: Difficulty): number {
  const raw = BASE_PER_MINUTE * durationMinutes * DIFFICULTY_MULTIPLIER[difficulty];
  return Math.min(60, Math.max(10, Math.round(raw)));
}

export function hunterRank(pillarStats: Record<Pillar, PillarStat>): Rank {
  let weakest: Rank = 'S';
  for (const p of (Object.keys(pillarStats) as Pillar[])) {
    const r = rankForLevel(pillarStats[p].level);
    if (RANK_ORDER.indexOf(r) < RANK_ORDER.indexOf(weakest)) {
      weakest = r;
    }
  }
  return weakest;
}

export function farmDecayMultiplier(completionsInLast14Days: number): number {
  if (completionsInLast14Days <= 2) return 1.0;
  if (completionsInLast14Days <= 4) return 0.7;
  return 0.4;
}

// Build fixed pillar tasks from onboarding
export function buildPillarTasks(ob: OnboardingData): Task[] {
  const tasks: Task[] = [];
  
  // STR
  const locLabel = ob.location === 'home' ? 'خونه' : 'باشگاه';
  const goalLabels: Record<string, string> = {
    cut: 'چربی‌سوزی', bulk: 'عضله‌سازی', recomp: 'ترکیبی',
    endurance: 'استقامت', maintain: 'حفظ وضعیت'
  };
  tasks.push({
    id: 'str_primary', pillar: 'str', slug: 'str_primary',
    title: `۳۰ دقیقه تمرین بدنی در ${locLabel} — هدف: ${goalLabels[ob.strengthGoal]}`,
    durationMinutes: 30, difficulty: 'hard', source: 'fixed'
  });
  tasks.push({
    id: 'str_recovery', pillar: 'str', slug: 'str_recovery',
    title: '۱۰ دقیقه کشش و ریکاوری',
    durationMinutes: 10, difficulty: 'easy', source: 'fixed'
  });

  // VIT
  if (ob.vitActivities.length > 0) {
    const selected = ob.vitActivities.slice(0, 2);
    tasks.push({
      id: 'vit_activity', pillar: 'vit', slug: 'vit_activity',
      title: `۱۵ دقیقه ${selected.join(' و ')}`,
      durationMinutes: 15, difficulty: 'normal', source: 'fixed'
    });
  } else {
    tasks.push({
      id: 'vit_activity', pillar: 'vit', slug: 'vit_activity',
      title: '۱۵ دقیقه فعالیت لذت‌بخش',
      durationMinutes: 15, difficulty: 'normal', source: 'fixed'
    });
  }
  tasks.push({
    id: 'vit_water', pillar: 'vit', slug: 'vit_water',
    title: '۸ لیوان آب',
    durationMinutes: 5, difficulty: 'easy', source: 'fixed'
  });

  // INT
  tasks.push({
    id: 'int_read', pillar: 'int', slug: 'int_read',
    title: '۲۰ صفحه مطالعه',
    durationMinutes: 25, difficulty: 'normal', source: 'fixed'
  });
  tasks.push({
    id: 'int_lang', pillar: 'int', slug: 'int_lang',
    title: '۱۵ دقیقه زبان',
    durationMinutes: 15, difficulty: 'normal', source: 'fixed'
  });

  // FIN
  tasks.push({
    id: 'fin_expense', pillar: 'fin', slug: 'fin_expense',
    title: 'ثبت هزینه‌های امروز',
    durationMinutes: 10, difficulty: 'easy', source: 'fixed'
  });
  const finGoalLabels: Record<string, string> = {
    save: 'کنار گذاشتن مبلغ هفتگی', cut_costs: 'بررسی و کاهش یک هزینه',
    debt: 'پرداخت بخشی از بدهی', invest: 'مطالعه‌ی یک مفهوم سرمایه‌گذاری',
    income: 'پیگیری یک فرصت درآمدی'
  };
  tasks.push({
    id: 'fin_goal', pillar: 'fin', slug: 'fin_goal',
    title: finGoalLabels[ob.financialGoal],
    durationMinutes: 15, difficulty: 'normal', source: 'fixed'
  });

  // PER
  tasks.push({
    id: 'per_meditate', pillar: 'per', slug: 'per_meditate',
    title: '۱۰ دقیقه مدیتیشن',
    durationMinutes: 10, difficulty: 'hard', source: 'fixed'
  });
  tasks.push({
    id: 'per_deep', pillar: 'per', slug: 'per_deep',
    title: '۱ ساعت کار عمیق',
    durationMinutes: 60, difficulty: 'hard', source: 'fixed'
  });

  return tasks;
}

// State management with localStorage
const STORAGE_KEY = 'system_hunter_state';

export function getDefaultState(): GameState {
  return {
    authenticated: false,
    onboardingDone: false,
    onboarding: null,
    coins: 0,
    streak: 0,
    lastActiveDate: '',
    streakFreezes: 1,
    legendCycles: 0,
    hunterClass: null,
    firstQuestDone: false,
    focusModeEnabled: true,
    reminderHour: null,
    pillarStats: {
      str: { level: 1, xp: 0, promotionPending: false },
      vit: { level: 1, xp: 0, promotionPending: false },
      int: { level: 1, xp: 0, promotionPending: false },
      fin: { level: 1, xp: 0, promotionPending: false },
      per: { level: 1, xp: 0, promotionPending: false },
    },
    tasks: [],
    taskLogs: [],
    achievements: [],
    redeemedRewards: [],
    dungeons: [],
    tradeJournal: [],
    tradeWatchlist: [],
    tradePositions: [],
    tradeSettings: { baseCapital: 0, dailyLossLimitPercent: 5, totalRiskCapPercent: 6 },
    focusPillars: ['str', 'vit'],
    phase: 'login',
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...getDefaultState(), ...JSON.parse(raw) };
  } catch {}
  return getDefaultState();
}

export function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Trade formulas
export function calcPositionSize(capital: number, leverage: number, stopPercent: number) {
  const positionSize = capital * leverage;
  const riskAmount = positionSize * (stopPercent / 100);
  return { positionSize, riskAmount, riskPercentOfCapital: (riskAmount / capital) * 100 };
}

export function derivePositionLevels(entryPrice: number, capital: number, leverage: number, riskPercent: number, rr: number, direction: 'long' | 'short') {
  const positionSize = capital * leverage;
  const riskAmount = capital * (riskPercent / 100);
  const stopFraction = riskAmount / positionSize;
  const rewardFraction = stopFraction * rr;
  const sign = direction === 'long' ? 1 : -1;
  return {
    positionSize,
    riskAmount,
    stopLossPrice: entryPrice * (1 - sign * stopFraction),
    takeProfitPrice: entryPrice * (1 + sign * rewardFraction),
  };
}

export function calcLivePnL(entryPrice: number, currentPrice: number, capital: number, positionSize: number, stopLossPrice: number, takeProfitPrice: number, direction: 'long' | 'short') {
  const sign = direction === 'long' ? 1 : -1;
  const pnlFraction = sign * ((currentPrice - entryPrice) / entryPrice);
  const pnlAmount = pnlFraction * positionSize;
  const hitTP = direction === 'long' ? currentPrice >= takeProfitPrice : currentPrice <= takeProfitPrice;
  const hitSL = direction === 'long' ? currentPrice <= stopLossPrice : currentPrice >= stopLossPrice;
  return { pnlAmount, pnlPercentOfCapital: (pnlAmount / capital) * 100, hitTP, hitSL };
}

export function calcJournalResult(entryPrice: number, exitPrice: number, capital: number, leverage: number, riskPercent: number, direction: 'long' | 'short') {
  const positionSize = capital * leverage;
  const sign = direction === 'long' ? 1 : -1;
  const pnlAmount = sign * ((exitPrice - entryPrice) / entryPrice) * positionSize;
  const riskAmount = capital * (riskPercent / 100);
  return {
    pnlAmount,
    pnlPercentOfCapital: (pnlAmount / capital) * 100,
    realizedR: riskAmount > 0 ? pnlAmount / riskAmount : null,
  };
}

// Mock AI insights
export function getMockInsight(pillar: Pillar, state: GameState): string {
  const insights: Record<Pillar, string[]> = {
    str: ['بدنت آماده‌ی چالش بیشتره', 'ریکاوری فراموش نشه', 'امروز رو قوی شروع کن'],
    vit: ['آب خوردن رو جدی بگیر', 'یه فعالیت سبک حالتو خوب میکنه', 'انرژیت پایدار بمونه'],
    int: ['ذهنت تشنه‌ی یادگیریه', 'یه صفحه بیشتر بخون', 'تمرکزت امروز خوبه'],
    fin: ['ثبت هزینه عادت خوبیه', 'یه قدم به هدفت نزدیک‌تر', 'نظم مالیت قوی بشه'],
    per: ['آرامش امروز، قدرت فرداست', 'کار عمیق = رشد واقعی', 'ذهنت رو آزاد کن'],
  };
  const arr = insights[pillar];
  return arr[Math.floor(Math.random() * arr.length)];
}

// Focus mode: determine 2 pillars to focus on based on recent completion rates
export function determineFocusPillars(state: GameState): [Pillar, Pillar] {
  const rates: Record<Pillar, number> = { str: 0, vit: 0, int: 0, fin: 0, per: 0 };
  const last7 = Array.from({ length: 7 }, (_, i) => daysAgo(i));
  
  for (const p of (Object.keys(rates) as Pillar[])) {
    const pillarTasks = state.tasks.filter(t => t.pillar === p);
    let total = 0, done = 0;
    for (const day of last7) {
      for (const t of pillarTasks) {
        total++;
        const log = state.taskLogs.find(l => l.taskId === t.id && l.date === day);
        if (log?.done) done++;
      }
    }
    rates[p] = total > 0 ? done / total : 0;
  }
  
  const sorted = (Object.keys(rates) as Pillar[]).sort((a, b) => rates[a] - rates[b]);
  return [sorted[0], sorted[1]];
}
