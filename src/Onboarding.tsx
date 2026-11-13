import { useState } from 'react';
import { ChevronRight, ChevronLeft, Dumbbell, Heart, Brain, Wallet, Focus } from 'lucide-react';
import type { OnboardingData } from './lib';

interface Props {
  onComplete: (data: OnboardingData) => void;
}

const STEPS = ['پروفایل', 'قدرت', 'سرزندگی', 'هوش', 'مالی', 'تمرکز'];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    username: '', age: 25, height: 175, weight: 70,
    strengthGoal: 'recomp', physicalLimits: [], location: 'home', baseFitness: 0,
    vitActivities: [], vitRewards: [], financialGoal: 'save',
  });

  const next = () => step < 5 ? setStep(step + 1) : onComplete(data);
  const prev = () => step > 0 && setStep(step - 1);

  const bmi = data.weight / ((data.height / 100) ** 2);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--void)' }}>
      <div className="bg-ambient"><div className="glow3" /></div>
      
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i <= step ? 'var(--iri-1)' : 'var(--line-strong)', transform: i === step ? 'scale(1.3)' : 'scale(1)' }} />
        ))}
      </div>

      <div className="card w-full max-w-lg fade-in" style={{ position: 'relative', zIndex: 1 }}>
        <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>مرحله {step + 1} از ۶</p>
        <h2 className="text-xl font-bold mb-1">{STEPS[step]}</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>{getSubtitle(step)}</p>

        {step === 0 && <StepProfile data={data} setData={setData} />}
        {step === 1 && <StepSTR data={data} setData={setData} bmi={bmi} />}
        {step === 2 && <StepVIT data={data} setData={setData} />}
        {step === 3 && <StepINT />}
        {step === 4 && <StepFIN data={data} setData={setData} />}
        {step === 5 && <StepPER />}

        <div className="flex justify-between mt-8">
          <button onClick={prev} className="btn btn-ghost flex items-center gap-1" disabled={step === 0}>
            <ChevronRight size={16} /> قبلی
          </button>
          <button onClick={next} className="btn btn-primary flex items-center gap-1">
            {step === 5 ? 'شروع سفر' : 'ادامه'} <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getSubtitle(step: number): string {
  const subs = [
    'بیا با هم آشنا بشیم',
    'هدف و وضعیت جسمانیت',
    'چی بهت انرژی میده؟',
    'رشد ذهنی و یادگیری',
    'هدف مالیت چیه؟',
    'آرامش و تمرکز',
  ];
  return subs[step];
}

function StepProfile({ data, setData }: { data: OnboardingData; setData: (d: OnboardingData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm block mb-1" style={{ color: 'var(--text-dim)' }}>اسم</label>
        <input className="input" value={data.username} onChange={e => setData({ ...data, username: e.target.value })} placeholder="اسمت چیه؟" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm block mb-1" style={{ color: 'var(--text-dim)' }}>سن</label>
          <input type="number" className="input font-num" value={data.age} onChange={e => setData({ ...data, age: +e.target.value })} />
        </div>
        <div>
          <label className="text-sm block mb-1" style={{ color: 'var(--text-dim)' }}>قد (cm)</label>
          <input type="number" className="input font-num" value={data.height} onChange={e => setData({ ...data, height: +e.target.value })} />
        </div>
        <div>
          <label className="text-sm block mb-1" style={{ color: 'var(--text-dim)' }}>وزن (kg)</label>
          <input type="number" className="input font-num" value={data.weight} onChange={e => setData({ ...data, weight: +e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function StepSTR({ data, setData, bmi }: { data: OnboardingData; setData: (d: OnboardingData) => void; bmi: number }) {
  const goals = [
    { key: 'cut', label: 'چربی‌سوزی' },
    { key: 'bulk', label: 'عضله‌سازی' },
    { key: 'recomp', label: 'ترکیبی' },
    { key: 'endurance', label: 'استقامت' },
    { key: 'maintain', label: 'حفظ وضعیت' },
  ];
  const limits = ['زانو', 'کمر', 'شونه', 'مچ', 'هیچکدام'];

  return (
    <div className="space-y-4">
      {bmi > 0 && (
        <div className="text-sm p-3 rounded-lg" style={{ background: 'var(--panel)', color: 'var(--text-dim)' }}>
          BMI نمایشی: <span className="font-num">{bmi.toFixed(1)}</span>
        </div>
      )}
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>هدف تمرین</label>
        <div className="flex flex-wrap gap-2">
          {goals.map(g => (
            <button key={g.key} onClick={() => setData({ ...data, strengthGoal: g.key as any })}
              className="btn text-xs" style={{
                background: data.strengthGoal === g.key ? 'var(--str)' : 'var(--panel)',
                color: data.strengthGoal === g.key ? '#fff' : 'var(--text-dim)',
                border: `1px solid ${data.strengthGoal === g.key ? 'var(--str)' : 'var(--line)'}`,
              }}>{g.label}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>محل تمرین</label>
        <div className="flex gap-2">
          {(['home', 'gym'] as const).map(loc => (
            <button key={loc} onClick={() => setData({ ...data, location: loc })}
              className="btn text-xs" style={{
                background: data.location === loc ? 'var(--str)' : 'var(--panel)',
                color: data.location === loc ? '#fff' : 'var(--text-dim)',
              }}>{loc === 'home' ? '🏠 خونه' : '🏋️ باشگاه'}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>محدودیت جسمی</label>
        <div className="flex flex-wrap gap-2">
          {limits.map(l => {
            const active = data.physicalLimits.includes(l);
            return (
              <button key={l} onClick={() => {
                const next = active ? data.physicalLimits.filter(x => x !== l) : [...data.physicalLimits, l];
                setData({ ...data, physicalLimits: next });
              }} className="btn text-xs" style={{
                background: active ? 'var(--iri-4)' : 'var(--panel)',
                color: active ? '#fff' : 'var(--text-dim)',
              }}>{l}</button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>سطح آمادگی (چند شنا/بارفیکس پشت سر هم؟)</label>
        <input type="range" min="0" max="5" value={data.baseFitness}
          onChange={e => setData({ ...data, baseFitness: +e.target.value })}
          className="w-full" />
        <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
          {data.baseFitness === 0 ? 'هیچی/نمیتونم' : `${data.baseFitness} تا`}
        </p>
      </div>
    </div>
  );
}

function StepVIT({ data, setData }: { data: OnboardingData; setData: (d: OnboardingData) => void }) {
  const activities = ['موسیقی', 'فیلم', 'بیرون‌رفتن', 'طبیعت', 'پیاده‌روی', 'عکاسی', 'نقاشی', 'دوستان'];
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>چی بهت حس سرزندگی میده؟ (چندتا انتخاب کن)</label>
        <div className="flex flex-wrap gap-2">
          {activities.map(a => {
            const active = data.vitActivities.includes(a);
            return (
              <button key={a} onClick={() => {
                const next = active ? data.vitActivities.filter(x => x !== a) : [...data.vitActivities, a];
                setData({ ...data, vitActivities: next });
              }} className="btn text-xs" style={{
                background: active ? 'var(--vit)' : 'var(--panel)',
                color: active ? '#000' : 'var(--text-dim)',
              }}>{a}</button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>جایزه‌های لذت‌بخش (این‌ها تسک نمیشن، با coin خریداری میشن)</label>
        <input className="input" placeholder="مثلاً: دیدن یه قسمت سریال، خرید گجت..."
          onChange={e => setData({ ...data, vitRewards: e.target.value.split('،').map(s => s.trim()).filter(Boolean) })} />
      </div>
    </div>
  );
}

function StepINT() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'var(--panel)' }}>
        <Brain size={24} style={{ color: 'var(--int)' }} />
        <div>
          <p className="font-bold">رشد ذهنی</p>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>مطالعه، یادگیری زبان و آموزش کوتاه — هر روز</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-faint)' }}>تسک‌های ثابت: ۲۰ صفحه مطالعه + ۱۵ دقیقه زبان</p>
    </div>
  );
}

function StepFIN({ data, setData }: { data: OnboardingData; setData: (d: OnboardingData) => void }) {
  const goals = [
    { key: 'save', label: 'پس‌انداز' },
    { key: 'cut_costs', label: 'کاهش هزینه' },
    { key: 'debt', label: 'خروج از بدهی' },
    { key: 'invest', label: 'سرمایه‌گذاری' },
    { key: 'income', label: 'افزایش درآمد' },
  ];
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm block mb-2" style={{ color: 'var(--text-dim)' }}>هدف مالی</label>
        <div className="flex flex-wrap gap-2">
          {goals.map(g => (
            <button key={g.key} onClick={() => setData({ ...data, financialGoal: g.key as any })}
              className="btn text-xs" style={{
                background: data.financialGoal === g.key ? 'var(--fin)' : 'var(--panel)',
                color: data.financialGoal === g.key ? '#000' : 'var(--text-dim)',
              }}>{g.label}</button>
          ))}
        </div>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-faint)' }}>تسک‌های ثابت: ثبت هزینه + {goals.find(g => g.key === data.financialGoal)?.label}</p>
    </div>
  );
}

function StepPER() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'var(--panel)' }}>
        <Focus size={24} style={{ color: 'var(--per)' }} />
        <div>
          <p className="font-bold">آرامش و تمرکز</p>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>مدیتیشن، دوری از فضای مجازی و کار عمیق</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-faint)' }}>تسک‌های ثابت: ۱۰ دقیقه مدیتیشن + ۱ ساعت کار عمیق</p>
    </div>
  );
}
