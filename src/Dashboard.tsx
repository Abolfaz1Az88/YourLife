import { useState, useEffect, useMemo } from 'react';
import { Home, Dumbbell, Heart, Brain, Wallet, Focus, Gift, Trophy, BarChart3, Swords, TrendingUp, LogOut, Sparkles, Check, Star, Zap, Target } from 'lucide-react';
import {
  type GameState, type Pillar, type Task, type TaskLog, type Mood, type Rank,
  PILLAR_COLORS, PILLAR_NAMES, PILLAR_ICONS, MOODS, ACHIEVEMENTS,
  rankForLevel, xpToNextLevel, xpForTask, hunterRank, RANK_COLORS, RANK_ORDER,
  buildPillarTasks, getMockInsight, determineFocusPillars,
  calcJournalResult, derivePositionLevels, calcLivePnL, calcPositionSize,
  daysAgo, todayStr,
} from './lib';

type View = 'home' | 'str' | 'vit' | 'int' | 'fin' | 'per' | 'rewards' | 'achievements' | 'report' | 'hunter' | 'dungeons' | 'trade';

interface Props {
  state: GameState;
  setState: (s: GameState) => void;
  onLogout: () => void;
}

export default function Dashboard({ state, setState, onLogout }: Props) {
  const [view, setView] = useState<View>('home');
  const [toast, setToast] = useState<string | null>(null);
  const [showMood, setShowMood] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const hRank = hunterRank(state.pillarStats);
  const today = todayStr();

  // Update streak on mount
  useEffect(() => {
    if (state.lastActiveDate !== today) {
      const yesterday = daysAgo(1);
      let newStreak = state.streak;
      if (state.lastActiveDate === yesterday) {
        newStreak = state.streak + 1;
      } else if (state.lastActiveDate && state.lastActiveDate !== today) {
        if (state.streakFreezes > 0) {
          setState({ ...state, streakFreezes: state.streakFreezes - 1, lastActiveDate: today });
          return;
        }
        newStreak = 0;
      } else {
        newStreak = 1;
      }
      setState({ ...state, streak: newStreak, lastActiveDate: today });
    }
  }, []);

  // Check achievements
  useEffect(() => {
    const newAch: string[] = [];
    const todayLogs = state.taskLogs.filter(l => l.date === today && l.done);
    const todayTasks = state.tasks.filter(t => todayLogs.some(l => l.taskId === t.id));
    const uniquePillars = new Set(todayTasks.map(t => t.pillar));

    if (todayLogs.length >= 1 && !state.achievements.includes('first_quest')) newAch.push('first_quest');
    if (state.streak >= 3 && !state.achievements.includes('streak_3')) newAch.push('streak_3');
    if (state.streak >= 7 && !state.achievements.includes('streak_7')) newAch.push('streak_7');
    if (RANK_ORDER.indexOf(hRank) >= RANK_ORDER.indexOf('D') && !state.achievements.includes('rank_d')) newAch.push('rank_d');
    if (RANK_ORDER.indexOf(hRank) >= RANK_ORDER.indexOf('C') && !state.achievements.includes('rank_c')) newAch.push('rank_c');
    if (uniquePillars.size >= 5 && !state.achievements.includes('all_pillars')) newAch.push('all_pillars');

    if (newAch.length > 0) {
      setState({ ...state, achievements: [...state.achievements, ...newAch] });
    }
  }, [state.taskLogs, state.streak, hRank]);

  const completeTask = (task: Task) => {
    const existingLog = state.taskLogs.find(l => l.taskId === task.id && l.date === today);
    if (existingLog?.done) return;

    const xp = xpForTask(task.durationMinutes, task.difficulty);
    const classBonus = getClassBonus(state.hunterClass, task.pillar);
    const finalXp = Math.round(xp * (1 + classBonus));

    // Update pillar stats
    const ps = { ...state.pillarStats };
    const pillar = ps[task.pillar];
    let newLevel = pillar.level;
    let newXp = pillar.xp + finalXp;
    let pending = pillar.promotionPending;
    let needed = xpToNextLevel(newLevel);
    while (newXp >= needed) {
      newXp -= needed;
      newLevel++;
      needed = xpToNextLevel(newLevel);
      if (newLevel >= 60 && !pending) {
        pending = true;
      }
    }
    ps[task.pillar] = { level: newLevel, xp: newXp, promotionPending: pending };

    // Check if all tasks done today
    const allTasks = state.tasks;
    const doneCount = state.taskLogs.filter(l => l.date === today && l.done).length + 1;
    const allDone = doneCount >= allTasks.length;
    const newStreak = allDone && state.lastActiveDate !== today ? state.streak + 1 : state.streak;

    const newLog: TaskLog = { taskId: task.id, date: today, done: true };
    const newLogs = [...state.taskLogs.filter(l => !(l.taskId === task.id && l.date === today)), newLog];

    setState({
      ...state,
      pillarStats: ps,
      taskLogs: newLogs,
      coins: state.coins + Math.round(finalXp * 0.5),
      streak: newStreak,
      lastActiveDate: today,
      firstQuestDone: true,
    });

    showToast(`+${finalXp} XP ✨`);
  };

  const navItems: { key: View; icon: any; label: string }[] = [
    { key: 'home', icon: Home, label: 'خانه' },
    { key: 'str', icon: Dumbbell, label: 'قدرت' },
    { key: 'vit', icon: Heart, label: 'سرزندگی' },
    { key: 'int', icon: Brain, label: 'هوش' },
    { key: 'fin', icon: Wallet, label: 'مالی' },
    { key: 'per', icon: Focus, label: 'تمرکز' },
    { key: 'dungeons', icon: Swords, label: 'ماجراجویی' },
    { key: 'trade', icon: TrendingUp, label: 'ترید' },
    { key: 'rewards', icon: Gift, label: 'جایزه' },
    { key: 'achievements', icon: Trophy, label: 'دستاوردها' },
    { key: 'report', icon: BarChart3, label: 'گزارش' },
    { key: 'hunter', icon: Star, label: 'هانتر' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--void)' }}>
      <div className="bg-ambient"><div className="glow3" /></div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast px-4 py-2 rounded-xl font-bold"
          style={{ background: 'var(--panel-2)', border: '1px solid var(--iri-1)', color: 'var(--iri-1)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: 'var(--void)', borderBottom: '1px solid var(--line)' }}>
        <div className="flex items-center gap-3">
          <RankBadgeDisplay rank={hRank} size={36} />
          <div>
            <p className="text-sm font-bold">{state.onboarding?.username || 'هانتر'}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>رتبه: <span className="font-num">{hRank}</span> | 🔥 <span className="font-num">{state.streak}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-num text-sm" style={{ color: 'var(--fin)' }}>🪙 {state.coins}</span>
          <button onClick={onLogout} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--text-faint)' }}>
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-20 relative z-10">
        {view === 'home' && <HomeView state={state} completeTask={completeTask} showToast={showToast} focusPillars={state.focusPillars} />}
        {view === 'str' && <PillarView pillar="str" state={state} completeTask={completeTask} />}
        {view === 'vit' && <PillarView pillar="vit" state={state} completeTask={completeTask} />}
        {view === 'int' && <PillarView pillar="int" state={state} completeTask={completeTask} />}
        {view === 'fin' && <PillarView pillar="fin" state={state} completeTask={completeTask} />}
        {view === 'per' && <PillarView pillar="per" state={state} completeTask={completeTask} />}
        {view === 'rewards' && <RewardsView state={state} setState={setState} showToast={showToast} />}
        {view === 'achievements' && <AchievementsView state={state} />}
        {view === 'report' && <ReportView state={state} />}
        {view === 'hunter' && <HunterPanel state={state} setState={setState} showToast={showToast} />}
        {view === 'dungeons' && <DungeonsView state={state} setState={setState} showToast={showToast} />}
        {view === 'trade' && <TradeView state={state} setState={setState} showToast={showToast} />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto gap-1 px-2 py-2" style={{ background: 'var(--void)', borderTop: '1px solid var(--line)' }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setView(item.key)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[56px] transition-all"
            style={{
              background: view === item.key ? 'var(--panel-2)' : 'transparent',
              color: view === item.key ? 'var(--iri-1)' : 'var(--text-faint)',
            }}>
            <item.icon size={18} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// --- Sub Components ---

function RankBadgeDisplay({ rank, size = 32, pending = false }: { rank: Rank; size?: number; pending?: boolean }) {
  const isHolo = rank === 'S';
  const color = RANK_COLORS[rank];
  return (
    <div className={`flex items-center justify-center rounded-full font-num font-bold ${pending ? 'trial-pending' : ''}`}
      style={{
        width: size, height: size,
        background: isHolo ? 'var(--holo)' : 'transparent',
        border: `2px solid ${isHolo ? 'transparent' : color}`,
        color: isHolo ? '#000' : color,
        fontSize: size * 0.4,
        backgroundSize: '220%',
        animation: isHolo ? 'holoShift 5s ease-in-out infinite' : undefined,
      }}>
      {rank}
    </div>
  );
}

function HomeView({ state, completeTask, showToast, focusPillars }: { state: GameState; completeTask: (t: Task) => void; showToast: (m: string) => void; focusPillars: [Pillar, Pillar] }) {
  const today = todayStr();
  const todayLogs = state.taskLogs.filter(l => l.date === today);
  const totalTasks = state.tasks.length;
  const doneTasks = todayLogs.filter(l => l.done).length;
  const progress = totalTasks > 0 ? doneTasks / totalTasks : 0;

  // Hero quest: highest XP task not done yet
  const undoneTasks = state.tasks.filter(t => !todayLogs.find(l => l.taskId === t.id && l.done));
  const heroTask = undoneTasks.sort((a, b) => xpForTask(b.durationMinutes, b.difficulty) - xpForTask(a.durationMinutes, a.difficulty))[0];

  return (
    <div className="space-y-4 fade-in">
      {/* Overall progress */}
      <div className="card holo-sweep">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-dim)' }}>پیشرفت امروز</span>
          <span className="font-num text-sm">{doneTasks} از {totalTasks}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
          <div className="h-full holo-bar rounded-full transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Focus pillars */}
      {state.focusModeEnabled && (
        <div className="card" style={{ borderColor: 'var(--iri-1)', borderWidth: '1px' }}>
          <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--iri-1)' }}>
            <Target size={12} /> تمرکز امروز
          </p>
          <div className="flex gap-2">
            {focusPillars.map(p => (
              <span key={p} className="text-xs px-2 py-1 rounded-full" style={{ background: PILLAR_COLORS[p] + '20', color: PILLAR_COLORS[p] }}>
                {PILLAR_ICONS[p]} {PILLAR_NAMES[p]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hero quest */}
      {heroTask && (
        <div className="card" style={{ borderImage: 'var(--holo) 1', borderImageSlice: 1 }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} style={{ color: 'var(--iri-1)' }} />
            <span className="text-xs font-bold holo-text">کوئست قهرمان</span>
          </div>
          <QuestCard task={heroTask} done={false} onComplete={() => completeTask(heroTask)} isHero />
        </div>
      )}

      {/* All quests grouped by pillar */}
      {(Object.keys(PILLAR_NAMES) as Pillar[]).map(pillar => {
        const pillarTasks = state.tasks.filter(t => t.pillar === pillar);
        if (pillarTasks.length === 0) return null;
        const done = pillarTasks.filter(t => todayLogs.find(l => l.taskId === t.id && l.done));
        const allDone = done.length === pillarTasks.length;
        const isFocused = focusPillars.includes(pillar);

        return (
          <div key={pillar} className="rounded-2xl p-4 relative" style={{
            background: `radial-gradient(ellipse at top, ${PILLAR_COLORS[pillar]}10, transparent 70%)`,
            opacity: state.focusModeEnabled && !isFocused ? 0.6 : 1,
          }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-lg anim-${pillar}`}>{PILLAR_ICONS[pillar]}</span>
                <span className="font-bold text-sm" style={{ color: PILLAR_COLORS[pillar] }}>{PILLAR_NAMES[pillar]}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pillarTasks.length > 0 ? (done.length / pillarTasks.length) * 100 : 0}%`, background: PILLAR_COLORS[pillar] }} />
                </div>
                {allDone && <Check size={16} style={{ color: PILLAR_COLORS[pillar] }} />}
              </div>
            </div>
            <div className="space-y-2">
              {pillarTasks.map(task => {
                const isDone = !!todayLogs.find(l => l.taskId === task.id && l.done);
                return <QuestCard key={task.id} task={task} done={isDone} onComplete={() => completeTask(task)} />;
              })}
            </div>
          </div>
        );
      })}

      {/* AI Insight */}
      <div className="card" style={{ borderRight: '3px solid var(--iri-2)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--iri-2)' }}>💡 اینسایت سیستم</p>
        <p className="text-sm">{getMockInsight(focusPillars[0], state)}</p>
      </div>
    </div>
  );
}

function QuestCard({ task, done, onComplete, isHero = false }: { task: Task; done: boolean; onComplete: () => void; isHero?: boolean }) {
  const xp = xpForTask(task.durationMinutes, task.difficulty);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (done || animating) return;
    setAnimating(true);
    setTimeout(() => { onComplete(); setAnimating(false); }, 300);
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${animating ? 'select-pop' : ''}`}
      style={{
        background: done ? 'var(--panel)' : 'var(--panel-2)',
        border: `1px solid ${done ? 'var(--line)' : PILLAR_COLORS[task.pillar] + '40'}`,
        opacity: done ? 0.6 : 1,
      }}>
      {/* Completion ring */}
      <button onClick={handleClick}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          border: `2px ${done ? 'solid' : 'dashed'} ${PILLAR_COLORS[task.pillar]}`,
          background: done ? PILLAR_COLORS[task.pillar] : 'transparent',
        }}>
        {done && <Check size={14} color="#000" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${done ? 'line-through' : ''}`} style={{ color: done ? 'var(--text-faint)' : 'var(--text)' }}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: PILLAR_COLORS[task.pillar] + '20', color: PILLAR_COLORS[task.pillar] }}>
            {task.durationMinutes} دقیقه
          </span>
          {task.source !== 'fixed' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--iri-1)' + '20', color: 'var(--iri-1)' }}>
              AI QUEST
            </span>
          )}
        </div>
      </div>

      {/* XP chip */}
      <div className="flex-shrink-0 px-2 py-1 rounded-lg font-num text-xs" style={{ background: PILLAR_COLORS[task.pillar] + '20', color: PILLAR_COLORS[task.pillar] }}>
        +{xp}
      </div>
    </div>
  );
}

function PillarView({ pillar, state, completeTask }: { pillar: Pillar; state: GameState; completeTask: (t: Task) => void }) {
  const today = todayStr();
  const todayLogs = state.taskLogs.filter(l => l.date === today);
  const pillarTasks = state.tasks.filter(t => t.pillar === pillar);
  const ps = state.pillarStats[pillar];
  const rank = rankForLevel(ps.level);
  const needed = xpToNextLevel(ps.level);
  const progress = needed > 0 ? ps.xp / needed : 0;
  const insight = getMockInsight(pillar, state);

  return (
    <div className="space-y-4 fade-in">
      {/* Pillar header */}
      <div className="card" style={{ background: `linear-gradient(135deg, ${PILLAR_COLORS[pillar]}15, var(--panel-2))` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`text-3xl anim-${pillar}`}>{PILLAR_ICONS[pillar]}</span>
            <div>
              <h2 className="font-bold text-lg" style={{ color: PILLAR_COLORS[pillar] }}>{PILLAR_NAMES[pillar]}</h2>
              <div className="flex items-center gap-2">
                <RankBadgeDisplay rank={rank} size={24} pending={ps.promotionPending} />
                <span className="font-num text-sm">Lv.{ps.level}</span>
              </div>
            </div>
          </div>
        </div>
        {/* XP bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-dim)' }}>XP</span>
            <span className="font-num" style={{ color: PILLAR_COLORS[pillar] }}>{ps.xp}/{needed}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress * 100}%`, background: PILLAR_COLORS[pillar] }} />
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="card" style={{ borderRight: `3px solid ${PILLAR_COLORS[pillar]}` }}>
        <p className="text-xs mb-1" style={{ color: PILLAR_COLORS[pillar] }}>💡 اینسایت</p>
        <p className="text-sm">{insight}</p>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {pillarTasks.map(task => {
          const isDone = !!todayLogs.find(l => l.taskId === task.id && l.done);
          return <QuestCard key={task.id} task={task} done={isDone} onComplete={() => completeTask(task)} />;
        })}
      </div>
    </div>
  );
}

function RewardsView({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; showToast: (m: string) => void }) {
  const rewards = state.onboarding?.vitRewards || ['دیدن یه قسمت سریال', 'خرید یه کتاب جدید'];
  const redeem = (idx: number) => {
    const cost = 30 + idx * 15;
    if (state.coins < cost) { showToast('coin کافی نداری!'); return; }
    setState({ ...state, coins: state.coins - cost, redeemedRewards: [...state.redeemedRewards, `reward_${idx}_${Date.now()}`] });
    showToast('🎉 جایزه باز شد!');
    if (!state.achievements.includes('first_reward')) {
      setState({ ...state, achievements: [...state.achievements, 'first_reward'] });
    }
  };

  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-lg font-bold flex items-center gap-2"><Gift size={20} style={{ color: 'var(--iri-4)' }} /> فروشگاه جایزه</h2>
      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>🪙 موجودی: <span className="font-num">{state.coins}</span></p>
      <div className="space-y-2">
        {rewards.map((r, i) => {
          const cost = 30 + i * 15;
          const canAfford = state.coins >= cost;
          return (
            <div key={i} className="card flex items-center justify-between">
              <span className="text-sm">{r}</span>
              <button onClick={() => redeem(i)} className="btn text-xs" disabled={!canAfford}
                style={{ background: canAfford ? 'var(--iri-4)' : 'var(--panel)', color: canAfford ? '#000' : 'var(--text-faint)' }}>
                🪙 {cost}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsView({ state }: { state: GameState }) {
  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-lg font-bold flex items-center gap-2"><Trophy size={20} style={{ color: 'var(--legend-gold)' }} /> دستاوردها</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map(ach => {
          const unlocked = state.achievements.includes(ach.id);
          return (
            <div key={ach.id} className="card text-center" style={{ opacity: unlocked ? 1 : 0.4, borderColor: unlocked ? 'var(--legend-gold)' : 'var(--line)' }}>
              <div className="text-2xl mb-1">{unlocked ? '🏆' : '🔒'}</div>
              <p className="text-sm font-bold">{ach.title}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{ach.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportView({ state }: { state: GameState }) {
  const last7 = Array.from({ length: 7 }, (_, i) => daysAgo(i));
  const heatmap = last7.map(day => {
    const logs = state.taskLogs.filter(l => l.date === day && l.done);
    return { day, count: logs.length };
  }).reverse();
  const maxCount = Math.max(...heatmap.map(h => h.count), 1);

  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={20} style={{ color: 'var(--iri-2)' }} /> گزارش هفتگی</h2>
      
      {/* Heatmap */}
      <div className="card">
        <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>۷ روز اخیر</p>
        <div className="flex gap-1 items-end h-20">
          {heatmap.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t transition-all" style={{
                height: `${(h.count / maxCount) * 60}px`,
                background: h.count > 0 ? 'var(--iri-1)' : 'var(--panel)',
                minHeight: '4px',
              }} />
              <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>{h.day.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar stats */}
      <div className="card">
        <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>وضعیت پیلارها</p>
        <div className="space-y-2">
          {(Object.keys(PILLAR_NAMES) as Pillar[]).map(p => {
            const ps = state.pillarStats[p];
            const rank = rankForLevel(ps.level);
            return (
              <div key={p} className="flex items-center gap-3">
                <span>{PILLAR_ICONS[p]}</span>
                <span className="text-sm flex-1">{PILLAR_NAMES[p]}</span>
                <RankBadgeDisplay rank={rank} size={20} />
                <span className="font-num text-xs" style={{ color: PILLAR_COLORS[p] }}>Lv.{ps.level}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Monthly summary placeholder */}
      <div className="card" style={{ borderRight: '3px solid var(--iri-3)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--iri-3)' }}>📊 تحلیل ماهانه</p>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {state.taskLogs.length < 21 ? 'هنوز داده‌ی کافی برای تحلیل همبستگی نیست (حداقل ۳ هفته لازم است).' : 'سیستم در حال تحلیل الگوهای بلندمدت شماست...'}
        </p>
      </div>
    </div>
  );
}

function HunterPanel({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; setState2?: any; showToast: (m: string) => void }) {
  const hRank = hunterRank(state.pillarStats);
  const classes = [
    { key: 'vanguard', label: 'Vanguard', pillar: 'str' as Pillar, desc: '+8% XP قدرت' },
    { key: 'warden', label: 'Warden', pillar: 'vit' as Pillar, desc: '+8% XP سرزندگی' },
    { key: 'sage', label: 'Sage', pillar: 'int' as Pillar, desc: '+8% XP هوش' },
    { key: 'strategist', label: 'Strategist', pillar: 'fin' as Pillar, desc: '+8% XP مالی' },
    { key: 'ascetic', label: 'Ascetic', pillar: 'per' as Pillar, desc: '+8% XP تمرکز' },
  ];
  const canChooseClass = RANK_ORDER.indexOf(hRank) >= RANK_ORDER.indexOf('D');

  const chooseClass = (cls: string) => {
    const newState = { ...state, hunterClass: cls as any };
    if (!state.achievements.includes('class_awakening')) {
      newState.achievements = [...state.achievements, 'class_awakening'];
    }
    setState(newState);
    showToast('🎉 کلاس انتخاب شد!');
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Hunter status HUD */}
      <div className="card holo-sweep text-center py-8" style={{ background: 'linear-gradient(135deg, var(--panel-2), var(--void-2))' }}>
        <div className={`mx-auto mb-3 ${hRank === 'S' ? 'legend-glow' : ''}`} style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${RANK_COLORS[hRank] === 'holo' ? 'var(--iri-1)' : RANK_COLORS[hRank]}`, background: hRank === 'S' ? 'var(--holo)' : 'transparent', backgroundSize: '220%' }}>
          <span className="font-num text-3xl" style={{ color: hRank === 'S' ? '#000' : RANK_COLORS[hRank] === 'holo' ? 'var(--iri-1)' : RANK_COLORS[hRank] }}>{hRank}</span>
        </div>
        <p className="font-bold text-lg">{state.onboarding?.username || 'هانتر'}</p>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {state.hunterClass ? `کلاس: ${classes.find(c => c.key === state.hunterClass)?.label}` : canChooseClass ? 'آماده‌ی بیداری کلاس' : `رتبه‌ی D برای بیداری کلاس لازم است`}
        </p>
        {state.legendCycles > 0 && (
          <p className="text-xs mt-1" style={{ color: 'var(--legend-gold)' }}>👑 افسانه × {state.legendCycles}</p>
        )}
      </div>

      {/* 5 pillar stats */}
      <div className="card">
        <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>آمار ۵ پیلار</p>
        <div className="space-y-3">
          {(Object.keys(PILLAR_NAMES) as Pillar[]).map(p => {
            const ps = state.pillarStats[p];
            const rank = rankForLevel(ps.level);
            const needed = xpToNextLevel(ps.level);
            const pct = needed > 0 ? (ps.xp / needed) * 100 : 0;
            return (
              <div key={p}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm flex items-center gap-1">
                    <span className={`anim-${p}`}>{PILLAR_ICONS[p]}</span> {PILLAR_NAMES[p]}
                  </span>
                  <div className="flex items-center gap-2">
                    <RankBadgeDisplay rank={rank} size={18} pending={ps.promotionPending} />
                    <span className="font-num text-xs" style={{ color: PILLAR_COLORS[p] }}>Lv.{ps.level}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PILLAR_COLORS[p] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class selection */}
      {canChooseClass && !state.hunterClass && (
        <div className="card">
          <p className="text-sm font-bold mb-3 flex items-center gap-2">
            <Zap size={16} style={{ color: 'var(--legend-gold)' }} /> بیداری کلاس
          </p>
          <div className="grid grid-cols-2 gap-2">
            {classes.map(c => (
              <button key={c.key} onClick={() => chooseClass(c.key)} className="card text-center hover:scale-105 transition-transform cursor-pointer" style={{ borderColor: PILLAR_COLORS[c.pillar] + '40' }}>
                <p className="font-bold text-sm">{c.label}</p>
                <p className="text-[10px]" style={{ color: PILLAR_COLORS[c.pillar] }}>{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center">
          <p className="font-num text-lg" style={{ color: 'var(--iri-1)' }}>{state.streak}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>استریک 🔥</p>
        </div>
        <div className="card text-center">
          <p className="font-num text-lg" style={{ color: 'var(--fin)' }}>{state.coins}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>سکه 🪙</p>
        </div>
        <div className="card text-center">
          <p className="font-num text-lg" style={{ color: 'var(--iri-3)' }}>{state.achievements.length}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>دستاورد 🏆</p>
        </div>
      </div>
    </div>
  );
}

function DungeonsView({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; showToast: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<'challenge' | 'trial'>('challenge');
  const challenges = [
    { id: 'silence_7', title: '۷ روز سکوت', desc: 'بدون فضای مجازی برای ۷ روز', pillar: 'per' as Pillar, days: 7 },
    { id: 'iron_week', title: 'هفته‌ی آهن', desc: 'تمرین قدرت سخت هر روز', pillar: 'str' as Pillar, days: 7 },
    { id: 'saving_14', title: 'چالش صرفه‌جویی', desc: 'ثبت دقیق هزینه ۱۴ روز', pillar: 'fin' as Pillar, days: 14 },
    { id: 'deep_read', title: 'معارت عمیق', desc: 'خواندن یک کتاب کامل در ۲۱ روز', pillar: 'int' as Pillar, days: 21 },
  ];

  const startDungeon = (ch: typeof challenges[0]) => {
    const quests = Array.from({ length: ch.days }, (_, i) => ({
      id: `${ch.id}_day_${i}`,
      title: `روز ${i + 1}: ${ch.desc}`,
      done: false,
      date: daysAgo(-i),
    }));
    const dungeon = {
      id: `${ch.id}_${Date.now()}`,
      title: ch.title,
      description: ch.desc,
      pillarFocus: [ch.pillar],
      durationDays: ch.days,
      type: 'challenge' as const,
      startedAt: new Date().toISOString(),
      questLog: quests,
    };
    setState({ ...state, dungeons: [...state.dungeons, dungeon] });
    showToast('🗡️ ماجراجویی شروع شد!');
  };

  const completeDungeonQuest = (dungeonId: string, questId: string) => {
    const dungeons = state.dungeons.map(d => {
      if (d.id !== dungeonId) return d;
      const questLog = d.questLog.map(q => q.id === questId ? { ...q, done: true } : q);
      const allDone = questLog.every(q => q.done);
      return { ...d, questLog, completedAt: allDone ? new Date().toISOString() : undefined };
    });
    setState({ ...state, dungeons });
  };

  const activeDungeons = state.dungeons.filter(d => !d.completedAt);
  const trials = activeDungeons.filter(d => d.type === 'trial');
  const challengeDungeons = activeDungeons.filter(d => d.type === 'challenge');

  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-lg font-bold flex items-center gap-2"><Swords size={20} style={{ color: 'var(--iri-3)' }} /> ماجراجویی‌ها</h2>

      {/* Active dungeons */}
      {activeDungeons.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold" style={{ color: 'var(--iri-1)' }}>فعال</p>
          {activeDungeons.map(d => (
            <div key={d.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-sm">{d.title}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{d.description}</p>
                </div>
                {d.type === 'trial' && <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--trial-pending)', color: '#000' }}>آزمون ارتقا</span>}
              </div>
              <div className="space-y-1">
                {d.questLog.map(q => (
                  <div key={q.id} className="flex items-center gap-2 text-xs">
                    <button onClick={() => completeDungeonQuest(d.id, q.id)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ border: `1.5px ${q.done ? 'solid' : 'dashed'} var(--iri-3)`, background: q.done ? 'var(--iri-3)' : 'transparent' }}>
                      {q.done && <Check size={10} color="#000" />}
                    </button>
                    <span style={{ color: q.done ? 'var(--text-faint)' : 'var(--text)', textDecoration: q.done ? 'line-through' : 'none' }}>{q.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available challenges */}
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-dim)' }}>چالش‌های موجود</p>
        <div className="space-y-2">
          {challenges.map(ch => (
            <div key={ch.id} className="card flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{ch.title}</p>
                <p className="text-[10px]" style={{ color: PILLAR_COLORS[ch.pillar] }}>{PILLAR_NAMES[ch.pillar]} • {ch.days} روز</p>
              </div>
              <button onClick={() => startDungeon(ch)} className="btn text-xs btn-primary">شروع</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TradeView({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; showToast: (m: string) => void }) {
  const [tab, setTab] = useState<'journal' | 'watchlist' | 'position' | 'calculator'>('journal');
  const tabs = [
    { key: 'journal', label: '📓 ژورنال' },
    { key: 'watchlist', label: '👀 واچ‌لیست' },
    { key: 'position', label: '📈 پوزیشن' },
    { key: 'calculator', label: '🧮 ماشین‌حساب' },
  ];

  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-lg font-bold flex items-center gap-2"><TrendingUp size={20} style={{ color: 'var(--fin)' }} /> سیستم ترید</h2>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className="btn text-xs whitespace-nowrap" style={{
              background: tab === t.key ? 'var(--panel-2)' : 'transparent',
              color: tab === t.key ? 'var(--fin)' : 'var(--text-faint)',
              border: `1px solid ${tab === t.key ? 'var(--fin)' : 'var(--line)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {tab === 'journal' && <TradeJournal state={state} setState={setState} showToast={showToast} />}
      {tab === 'watchlist' && <TradeWatchlist state={state} setState={setState} showToast={showToast} />}
      {tab === 'position' && <TradePosition state={state} setState={setState} showToast={showToast} />}
      {tab === 'calculator' && <TradeCalculator state={state} />}
    </div>
  );
}

function TradeJournal({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; showToast: (m: string) => void }) {
  const [form, setForm] = useState({ symbol: '', direction: 'long' as 'long' | 'short', entryPrice: '', exitPrice: '', capital: '', leverage: '1', riskPercent: '2', moodTag: '', reason: '' });

  const submit = () => {
    if (!form.symbol || !form.entryPrice || !form.exitPrice || !form.capital) { showToast('همه فیلدها رو پر کن'); return; }
    const result = calcJournalResult(+form.entryPrice, +form.exitPrice, +form.capital, +form.leverage, +form.riskPercent, form.direction);
    const entry = {
      id: `j_${Date.now()}`,
      symbol: form.symbol,
      direction: form.direction,
      entryPrice: +form.entryPrice,
      exitPrice: +form.exitPrice,
      capital: +form.capital,
      leverage: +form.leverage,
      riskPercent: +form.riskPercent,
      moodTag: form.moodTag || undefined,
      reason: form.reason || undefined,
      pnlAmount: result.pnlAmount,
      pnlPercent: result.pnlPercentOfCapital,
      realizedR: result.realizedR,
      createdAt: new Date().toISOString(),
    };
    setState({ ...state, tradeJournal: [...state.tradeJournal, entry] });
    showToast(result.pnlAmount > 0 ? '✅ سود!' : '📉 ضرر');
    setForm({ symbol: '', direction: 'long', entryPrice: '', exitPrice: '', capital: '', leverage: '1', riskPercent: '2', moodTag: '', reason: '' });

    // Daily loss limit check
    if (state.tradeSettings.baseCapital > 0) {
      const todayEntries = [...state.tradeJournal, entry].filter(e => e.createdAt.slice(0, 10) === todayStr());
      const dailyPnl = todayEntries.reduce((s, e) => s + e.pnlAmount, 0);
      const limit = -state.tradeSettings.baseCapital * state.tradeSettings.dailyLossLimitPercent / 100;
      if (dailyPnl < limit) {
        showToast('⚠️ امروز بسه، فردا با ذهن باز برگرد');
      }
    }
  };

  const winRate = state.tradeJournal.length > 0 ? (state.tradeJournal.filter(e => e.pnlAmount > 0).length / state.tradeJournal.length * 100).toFixed(0) : '0';
  const avgR = state.tradeJournal.filter(e => e.realizedR !== null).length > 0
    ? (state.tradeJournal.reduce((s, e) => s + (e.realizedR || 0), 0) / state.tradeJournal.length).toFixed(2)
    : '0';

  const moodOptions = [
    { key: 'calm', label: '😌 آروم' },
    { key: 'fomo', label: '😬 FOMO' },
    { key: 'revenge', label: '😤 انتقامی' },
    { key: 'confident', label: '💪 مطمئن' },
  ];

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <p className="text-sm font-bold">ثبت معامله</p>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="نماد" value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} />
          <div className="flex gap-1">
            {(['long', 'short'] as const).map(d => (
              <button key={d} onClick={() => setForm({ ...form, direction: d })} className="btn text-xs flex-1"
                style={{ background: form.direction === d ? (d === 'long' ? 'var(--vit)' : 'var(--iri-4)') : 'var(--panel)', color: form.direction === d ? '#000' : 'var(--text-dim)' }}>
                {d === 'long' ? 'Long' : 'Short'}
              </button>
            ))}
          </div>
          <input className="input font-num" type="number" placeholder="قیمت ورود" value={form.entryPrice} onChange={e => setForm({ ...form, entryPrice: e.target.value })} />
          <input className="input font-num" type="number" placeholder="قیمت خروج" value={form.exitPrice} onChange={e => setForm({ ...form, exitPrice: e.target.value })} />
          <input className="input font-num" type="number" placeholder="سرمایه" value={form.capital} onChange={e => setForm({ ...form, capital: e.target.value })} />
          <input className="input font-num" type="number" placeholder="اهرم" value={form.leverage} onChange={e => setForm({ ...form, leverage: e.target.value })} />
          <input className="input font-num" type="number" placeholder="ریسک %" value={form.riskPercent} onChange={e => setForm({ ...form, riskPercent: e.target.value })} />
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>حس و حال</p>
          <div className="flex gap-1">
            {moodOptions.map(m => (
              <button key={m.key} onClick={() => setForm({ ...form, moodTag: m.key })} className="btn text-[10px]"
                style={{ background: form.moodTag === m.key ? 'var(--panel-2)' : 'transparent', border: `1px solid ${form.moodTag === m.key ? 'var(--fin)' : 'var(--line)'}`, color: form.moodTag === m.key ? 'var(--fin)' : 'var(--text-faint)' }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <input className="input" placeholder="دلیل ورود (اختیاری)" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
        <button onClick={submit} className="btn btn-primary w-full">ثبت</button>
      </div>

      {/* Stats */}
      {state.tradeJournal.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="card text-center">
            <p className="font-num text-lg" style={{ color: 'var(--vit)' }}>{winRate}%</p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>نرخ بُرد</p>
          </div>
          <div className="card text-center">
            <p className="font-num text-lg" style={{ color: 'var(--int)' }}>{avgR}R</p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>میانگین R</p>
          </div>
          <div className="card text-center">
            <p className="font-num text-lg" style={{ color: 'var(--fin)' }}>{state.tradeJournal.length}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>معاملات</p>
          </div>
        </div>
      )}

      {/* Journal list */}
      <div className="space-y-2">
        {state.tradeJournal.slice().reverse().map(e => (
          <div key={e.id} className="card flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{e.symbol} <span style={{ color: e.direction === 'long' ? 'var(--vit)' : 'var(--iri-4)' }}>({e.direction})</span></p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{e.createdAt.slice(0, 10)} {e.moodTag && `• ${e.moodTag}`}</p>
            </div>
            <span className="font-num text-sm" style={{ color: e.pnlAmount >= 0 ? 'var(--vit)' : 'var(--iri-4)' }}>
              {e.pnlAmount >= 0 ? '+' : ''}{e.pnlAmount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TradeWatchlist({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; showToast: (m: string) => void }) {
  const [form, setForm] = useState({ symbol: '', targetPrice: '' });

  const add = () => {
    if (!form.symbol || !form.targetPrice) { showToast('نماد و قیمت رو وارد کن'); return; }
    const item = {
      id: `w_${Date.now()}`,
      symbol: form.symbol,
      targetPrice: +form.targetPrice,
      direction: 'above' as 'above' | 'below',
      triggered: false,
    };
    setState({ ...state, tradeWatchlist: [...state.tradeWatchlist, item] });
    setForm({ symbol: '', targetPrice: '' });
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <input className="input" placeholder="نماد" value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} />
        <input className="input font-num" type="number" placeholder="قیمت هدف" value={form.targetPrice} onChange={e => setForm({ ...form, targetPrice: e.target.value })} />
        <button onClick={add} className="btn btn-primary w-full">افزودن</button>
      </div>
      <div className="space-y-2">
        {state.tradeWatchlist.map(w => (
          <div key={w.id} className="card flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{w.symbol}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>هدف: <span className="font-num">{w.targetPrice}</span></p>
            </div>
            <button onClick={() => setState({ ...state, tradeWatchlist: state.tradeWatchlist.filter(x => x.id !== w.id) })}
              className="text-xs" style={{ color: 'var(--iri-4)' }}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TradePosition({ state, setState, showToast }: { state: GameState; setState: (s: GameState) => void; showToast: (m: string) => void }) {
  const [form, setForm] = useState({ symbol: '', direction: 'long' as 'long' | 'short', entryPrice: '', capital: '', riskPercent: '2', rr: '2', leverage: '1', currentPrice: '' });
  const [warning, setWarning] = useState('');

  const submit = () => {
    if (!form.symbol || !form.entryPrice || !form.capital) { showToast('فیلدها رو پر کن'); return; }
    const levels = derivePositionLevels(+form.entryPrice, +form.capital, +form.leverage, +form.riskPercent, +form.rr, form.direction);
    
    // Check total risk cap
    const openRisk = state.tradePositions.filter(p => p.status === 'open').reduce((s, p) => s + p.riskPercent, 0);
    if (openRisk + +form.riskPercent > state.tradeSettings.totalRiskCapPercent) {
      setWarning(`مجموع ریسکت با این یکی می‌شه ${(openRisk + +form.riskPercent).toFixed(1)}٪ — از سقف ${state.tradeSettings.totalRiskCapPercent}٪ رد می‌شه`);
    } else {
      setWarning('');
    }

    const pos = {
      id: `p_${Date.now()}`,
      symbol: form.symbol,
      direction: form.direction,
      entryPrice: +form.entryPrice,
      currentPrice: form.currentPrice ? +form.currentPrice : +form.entryPrice,
      capital: +form.capital,
      leverage: +form.leverage,
      riskPercent: +form.riskPercent,
      rr: +form.rr,
      positionSize: levels.positionSize,
      riskAmount: levels.riskAmount,
      stopLossPrice: levels.stopLossPrice,
      takeProfitPrice: levels.takeProfitPrice,
      status: 'open' as const,
      trailStage: 0,
      openedAt: new Date().toISOString(),
    };
    setState({ ...state, tradePositions: [...state.tradePositions, pos] });
    showToast('📈 پوزیشن باز شد');
    setForm({ symbol: '', direction: 'long', entryPrice: '', capital: '', riskPercent: '2', rr: '2', leverage: '1', currentPrice: '' });
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <p className="text-sm font-bold">پوزیشن زنده</p>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="نماد" value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} />
          <div className="flex gap-1">
            {(['long', 'short'] as const).map(d => (
              <button key={d} onClick={() => setForm({ ...form, direction: d })} className="btn text-xs flex-1"
                style={{ background: form.direction === d ? (d === 'long' ? 'var(--vit)' : 'var(--iri-4)') : 'var(--panel)', color: form.direction === d ? '#000' : 'var(--text-dim)' }}>
                {d === 'long' ? 'Long' : 'Short'}
              </button>
            ))}
          </div>
          <input className="input font-num" type="number" placeholder="قیمت ورود" value={form.entryPrice} onChange={e => setForm({ ...form, entryPrice: e.target.value })} />
          <input className="input font-num" type="number" placeholder="قیمت فعلی" value={form.currentPrice} onChange={e => setForm({ ...form, currentPrice: e.target.value })} />
          <input className="input font-num" type="number" placeholder="سرمایه" value={form.capital} onChange={e => setForm({ ...form, capital: e.target.value })} />
          <input className="input font-num" type="number" placeholder="اهرم" value={form.leverage} onChange={e => setForm({ ...form, leverage: e.target.value })} />
          <input className="input font-num" type="number" placeholder="ریسک %" value={form.riskPercent} onChange={e => setForm({ ...form, riskPercent: e.target.value })} />
          <input className="input font-num" type="number" placeholder="R:R" value={form.rr} onChange={e => setForm({ ...form, rr: e.target.value })} />
        </div>
        {warning && <p className="text-xs p-2 rounded" style={{ background: 'var(--fin)' + '20', color: 'var(--fin)' }}>⚠️ {warning}</p>}
        <button onClick={submit} className="btn btn-primary w-full">باز کردن پوزیشن</button>
      </div>

      {/* Open positions */}
      <div className="space-y-2">
        {state.tradePositions.filter(p => p.status === 'open').map(p => {
          const pnl = calcLivePnL(p.entryPrice, p.currentPrice, p.capital, p.positionSize, p.stopLossPrice, p.takeProfitPrice, p.direction);
          return (
            <div key={p.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-sm">{p.symbol} ({p.direction})</p>
                <span className="font-num text-sm" style={{ color: pnl.pnlAmount >= 0 ? 'var(--vit)' : 'var(--iri-4)' }}>
                  {pnl.pnlAmount >= 0 ? '+' : ''}{pnl.pnlAmount.toFixed(2)} ({pnl.pnlPercentOfCapital.toFixed(1)}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px]" style={{ color: 'var(--text-dim)' }}>
                <span>SL: <span className="font-num">{p.stopLossPrice.toFixed(2)}</span></span>
                <span>TP: <span className="font-num">{p.takeProfitPrice.toFixed(2)}</span></span>
              </div>
              {pnl.hitTP && <p className="text-[10px] mt-1" style={{ color: 'var(--vit)' }}>✅ به TP رسید!</p>}
              {pnl.hitSL && <p className="text-[10px] mt-1" style={{ color: 'var(--iri-4)' }}>⛔ به SL رسید!</p>}
              <button onClick={() => setState({ ...state, tradePositions: state.tradePositions.map(x => x.id === p.id ? { ...x, status: 'closed' as const } : x) })}
                className="btn text-xs mt-2 btn-ghost">بستن</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TradeCalculator({ state }: { state: GameState }) {
  const [form, setForm] = useState({ capital: '', leverage: '1', stopPercent: '2' });
  const result = form.capital ? calcPositionSize(+form.capital, +form.leverage, +form.stopPercent) : null;

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <p className="text-sm font-bold">ماشین‌حساب ریسک</p>
        <input className="input font-num" type="number" placeholder="سرمایه" value={form.capital} onChange={e => setForm({ ...form, capital: e.target.value })} />
        <input className="input font-num" type="number" placeholder="اهرم" value={form.leverage} onChange={e => setForm({ ...form, leverage: e.target.value })} />
        <input className="input font-num" type="number" placeholder="فاصله استاپ %" value={form.stopPercent} onChange={e => setForm({ ...form, stopPercent: e.target.value })} />
      </div>
      {result && (
        <div className="card space-y-2">
          <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-dim)' }}>حجم پوزیشن</span><span className="font-num">{result.positionSize.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-dim)' }}>مقدار ریسک</span><span className="font-num">{result.riskAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-dim)' }}>ریسک از سرمایه</span><span className="font-num">{result.riskPercentOfCapital.toFixed(2)}%</span></div>
        </div>
      )}
    </div>
  );
}

function getClassBonus(hunterClass: string | null, pillar: Pillar): number {
  if (!hunterClass) return 0;
  const map: Record<string, Pillar> = { vanguard: 'str', warden: 'vit', sage: 'int', strategist: 'fin', ascetic: 'per' };
  return map[hunterClass] === pillar ? 0.08 : 0;
}
