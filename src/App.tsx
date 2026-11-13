import { useState, useEffect } from 'react';
import { loadState, saveState, getDefaultState, buildPillarTasks, determineFocusPillars } from './lib';
import type { GameState, OnboardingData } from './lib';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import DesignDocs from './DesignDocs';

export default function App() {
  const [state, setStateRaw] = useState<GameState>(loadState);

  const setState = (newState: GameState) => {
    setStateRaw(newState);
    saveState(newState);
  };

  // Handle login
  const handleLogin = () => {
    setState({ ...state, authenticated: true, phase: state.onboardingDone ? 'dashboard' : 'onboarding' });
  };

  const handleLogout = () => {
    setState({ ...getDefaultState(), phase: 'login' });
  };

  // Handle onboarding complete
  const handleOnboardingComplete = (data: OnboardingData) => {
    const tasks = buildPillarTasks(data);
    const focusPillars = determineFocusPillars({ ...state, tasks });
    setState({
      ...state,
      onboarding: data,
      onboardingDone: true,
      tasks,
      focusPillars,
      phase: 'first-quest',
    });
  };

  // Handle first quest done
  const handleFirstQuestDone = () => {
    setState({ ...state, firstQuestDone: true, phase: 'dashboard' });
  };

  // Render based on phase
  if (!state.authenticated || state.phase === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (!state.onboardingDone || state.phase === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (state.phase === 'first-quest' && !state.firstQuestDone) {
    return <FirstQuestView state={state} setState={setState} onDone={handleFirstQuestDone} />;
  }

  return <Dashboard state={state} setState={setState} onLogout={handleLogout} />;
}

// Login page (simple personal auth)
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--void)' }}>
      <div className="bg-ambient"><div className="glow3" /></div>
      
      <div className="card w-full max-w-sm text-center fade-in" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
            style={{ background: 'var(--holo)', backgroundSize: '220%', animation: 'holoShift 5s ease-in-out infinite' }}>
            <span className="text-2xl font-num font-black" style={{ color: '#050608' }}>S</span>
          </div>
          <h1 className="text-xl font-bold holo-text">سیستم</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>رشد شخصی هانتر</p>
        </div>

        <div className="space-y-3">
          <input className="input" type="email" placeholder="ایمیل" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="رمز عبور" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={onLogin} className="btn btn-primary w-full">ورود به سیستم</button>
        </div>

        <p className="text-[10px] mt-4" style={{ color: 'var(--text-faint)' }}>
          نسخه‌ی شخصی — فقط برای سازنده
        </p>
      </div>
    </div>
  );
}

// First quest view (Aha moment)
function FirstQuestView({ state, setState, onDone }: { state: GameState; setState: (s: GameState) => void; onDone: () => void }) {
  const [completed, setCompleted] = useState(false);

  // Find the task with lowest XP
  const task = state.tasks.reduce((min, t) => {
    const xp = t.durationMinutes * (t.difficulty === 'easy' ? 0.8 : t.difficulty === 'normal' ? 1.0 : t.difficulty === 'hard' ? 1.35 : 1.7);
    const minXp = min.durationMinutes * (min.difficulty === 'easy' ? 0.8 : min.difficulty === 'normal' ? 1.0 : min.difficulty === 'hard' ? 1.35 : 1.7);
    return xp < minXp ? t : min;
  }, state.tasks[0]);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(onDone, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--void)' }}>
      <div className="bg-ambient"><div className="glow3" /></div>
      
      <div className="card w-full max-w-sm text-center fade-in" style={{ position: 'relative', zIndex: 1 }}>
        <p className="text-xs mb-2" style={{ color: 'var(--iri-1)' }}>اولین قدم</p>
        <h2 className="text-lg font-bold mb-4">سفر شروع شد!</h2>
        
        {!completed ? (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
              فقط یه تسک ساده برای شروع. بعدش بقیه رو می‌بینی.
            </p>
            <div className="card mb-4" style={{ borderColor: 'var(--iri-1)' }}>
              <p className="text-sm font-bold">{task?.title}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{task?.durationMinutes} دقیقه</p>
            </div>
            <button onClick={handleComplete} className="btn btn-primary w-full">انجام دادم ✓</button>
            <button onClick={onDone} className="btn btn-ghost w-full mt-2 text-xs">رد کردن، برو مستقیم داشبورد</button>
          </>
        ) : (
          <div className="py-8">
            <div className="text-4xl mb-3 select-pop">✨</div>
            <p className="text-sm font-bold" style={{ color: 'var(--iri-1)' }}>آفرین! اولین قدم رو برداشتی.</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-dim)' }}>سیستم داره داشبورد رو آماده می‌کنه...</p>
          </div>
        )}
      </div>
    </div>
  );
}
