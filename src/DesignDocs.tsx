import { useState } from 'react';
import { Palette, Type, Layers, Sparkles, MousePointer, Layout, Smartphone, Eye, Image, BookOpen, ChevronDown, ChevronLeft, Copy, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type Section = 'tokens' | 'typography' | 'colors' | 'components' | 'animations' | 'prompts' | 'ux' | 'patterns' | 'pages' | 'responsive' | 'a11y';

const SECTIONS: { key: Section; icon: any; label: string }[] = [
  { key: 'tokens', icon: Layers, label: 'Design Tokens' },
  { key: 'typography', icon: Type, label: 'تایپوگرافی' },
  { key: 'colors', icon: Palette, label: 'رنگ‌ها' },
  { key: 'components', icon: Layout, label: 'کامپوننت‌ها' },
  { key: 'animations', icon: Sparkles, label: 'انیمیشن‌ها' },
  { key: 'prompts', icon: Image, label: 'پرامپت‌های تصویر' },
  { key: 'ux', icon: MousePointer, label: 'اصول UX' },
  { key: 'patterns', icon: Eye, label: 'الگوهای تعامل' },
  { key: 'pages', icon: BookOpen, label: 'صفحات' },
  { key: 'responsive', icon: Smartphone, label: 'ریسپانسیو' },
  { key: 'a11y', icon: Eye, label: 'دسترسی‌پذیری' },
];

export default function DesignDocs({ onBack }: Props) {
  const [active, setActive] = useState<Section>('tokens');
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', direction: 'rtl' }}>
      <div className="bg-ambient"><div className="glow3" /></div>

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: 'var(--void)', borderBottom: '1px solid var(--line)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn btn-ghost text-xs flex items-center gap-1">
            <ChevronLeft size={14} /> بازگشت
          </button>
          <h1 className="font-bold text-lg holo-text">مستندات طراحی</h1>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Design System v1.0</span>
      </header>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto relative z-10">
        {/* Sidebar */}
        <nav className="md:w-56 p-3 md:border-l" style={{ borderColor: 'var(--line)' }}>
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActive(s.key)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all"
                style={{
                  background: active === s.key ? 'var(--panel-2)' : 'transparent',
                  color: active === s.key ? 'var(--iri-1)' : 'var(--text-dim)',
                  border: active === s.key ? '1px solid var(--iri-1)' + '30' : '1px solid transparent',
                }}>
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {active === 'tokens' && <TokensSection copy={copy} copied={copied} />}
          {active === 'typography' && <TypographySection />}
          {active === 'colors' && <ColorsSection copy={copy} copied={copied} />}
          {active === 'components' && <ComponentsSection />}
          {active === 'animations' && <AnimationsSection />}
          {active === 'prompts' && <PromptsSection copy={copy} copied={copied} />}
          {active === 'ux' && <UxSection />}
          {active === 'patterns' && <PatternsSection />}
          {active === 'pages' && <PagesSection />}
          {active === 'responsive' && <ResponsiveSection />}
          {active === 'a11y' && <A11ySection />}
        </main>
      </div>
    </div>
  );
}

// --- Section Components ---

function CodeBlock({ code, id, copy, copied }: { code: string; id: string; copy: (t: string, i: string) => void; copied: string | null }) {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--void-2)', border: '1px solid var(--line)' }}>
      <button onClick={() => copy(code, id)}
        className="absolute top-2 left-2 p-1.5 rounded-lg transition-all"
        style={{ background: 'var(--panel)', color: copied === id ? 'var(--iri-1)' : 'var(--text-faint)' }}>
        {copied === id ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre className="p-4 text-xs overflow-x-auto" style={{ color: 'var(--text-dim)', direction: 'ltr', textAlign: 'left' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold mt-6 mb-2" style={{ color: 'var(--iri-1)' }}>{children}</h3>;
}

function TokensSection({ copy, copied }: { copy: (t: string, i: string) => void; copied: string | null }) {
  return (
    <div className="fade-in">
      <SectionTitle>🎨 Design Tokens</SectionTitle>
      <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>تمام مقادیر پایه‌ای طراحی — رنگ‌ها، فاصله‌ها، سایه‌ها</p>

      <SubTitle>رنگ‌های پس‌زمینه</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { name: '--void', value: '#050608', label: 'پس‌زمینه اصلی' },
          { name: '--void-2', value: '#0a0d16', label: 'پس‌زمینه ثانویه' },
          { name: '--panel', value: '#0d111c', label: 'پنل‌ها' },
          { name: '--panel-2', value: '#121728', label: 'کارت‌ها' },
        ].map(c => (
          <div key={c.name} className="card p-3 text-center cursor-pointer" onClick={() => copy(c.value, c.name)}>
            <div className="w-full h-12 rounded-lg mb-2" style={{ background: c.value, border: '1px solid var(--line)' }} />
            <p className="text-xs font-bold">{c.name}</p>
            <p className="text-[10px] font-num" style={{ color: 'var(--text-faint)' }}>{c.value}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <SubTitle>رنگ‌های ایریدسنت</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { name: '--iri-1', value: '#57f2c4', label: 'فیروزه‌ای' },
          { name: '--iri-2', value: '#5c8cff', label: 'آبی' },
          { name: '--iri-3', value: '#b37cff', label: 'بنفش' },
          { name: '--iri-4', value: '#ff62a8', label: 'صورتی' },
        ].map(c => (
          <div key={c.name} className="card p-3 text-center cursor-pointer" onClick={() => copy(c.value, c.name)}>
            <div className="w-full h-12 rounded-lg mb-2" style={{ background: c.value }} />
            <p className="text-xs font-bold">{c.name}</p>
            <p className="text-[10px] font-num" style={{ color: 'var(--text-faint)' }}>{c.value}</p>
          </div>
        ))}
      </div>

      <SubTitle>گرادیان هولو</SubTitle>
      <div className="card p-4 mb-4">
        <div className="h-16 rounded-xl holo-bar mb-2" />
        <CodeBlock id="holo" copy={copy} copied={copied} code={`--holo: linear-gradient(115deg, #57f2c4, #5c8cff 35%, #b37cff 65%, #ff62a8 100%);`} />
      </div>

      <SubTitle>رنگ پیلارها</SubTitle>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          { name: 'STR', value: '#ff6a4d', icon: '💪' },
          { name: 'VIT', value: '#57f2c4', icon: '🌿' },
          { name: 'INT', value: '#5c8cff', icon: '🧠' },
          { name: 'FIN', value: '#ffc15e', icon: '💰' },
          { name: 'PER', value: '#b37cff', icon: '🧘' },
        ].map(c => (
          <div key={c.name} className="card p-2 text-center cursor-pointer" onClick={() => copy(c.value, c.name)}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="w-full h-6 rounded mb-1" style={{ background: c.value }} />
            <p className="text-[10px] font-bold">{c.name}</p>
            <p className="text-[9px] font-num" style={{ color: 'var(--text-faint)' }}>{c.value}</p>
          </div>
        ))}
      </div>

      <SubTitle>Easing اصلی</SubTitle>
      <CodeBlock id="easing" copy={copy} copied={copied} code={`--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);\n/* فنری با overshoot خفیف — برای تمام تعاملات */`} />
    </div>
  );
}

function TypographySection() {
  return (
    <div className="fade-in">
      <SectionTitle>🔤 تایپوگرافی</SectionTitle>

      <SubTitle>فونت فارسی — Vazirmatn</SubTitle>
      <div className="card space-y-3 mb-4">
        {[
          { weight: 400, label: 'Regular — متن معمولی' },
          { weight: 500, label: 'Medium — تأکید ملایم' },
          { weight: 600, label: 'SemiBold — عنوان فرعی' },
          { weight: 700, label: 'Bold — عنوان اصلی' },
          { weight: 800, label: 'ExtraBold — عنوان بزرگ' },
        ].map(f => (
          <div key={f.weight} className="flex items-center justify-between">
            <span style={{ fontWeight: f.weight, fontSize: '18px' }}>نمونه متن فارسی — {f.label}</span>
            <span className="font-num text-xs" style={{ color: 'var(--text-faint)' }}>{f.weight}</span>
          </div>
        ))}
      </div>

      <SubTitle>فونت اعداد — Orbitron</SubTitle>
      <div className="card space-y-3 mb-4">
        {[500, 600, 700, 800, 900].map(w => (
          <div key={w} className="flex items-center justify-between">
            <span className="font-num" style={{ fontWeight: w, fontSize: '24px', color: 'var(--iri-1)' }}>42,150 XP</span>
            <span className="font-num text-xs" style={{ color: 'var(--text-faint)' }}>{w}</span>
          </div>
        ))}
      </div>

      <SubTitle>سلسله‌مراتب</SubTitle>
      <div className="card space-y-4">
        <div>
          <p style={{ fontSize: '24px', fontWeight: 800 }}>H1 — عنوان اصلی صفحه</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Vazirmatn 800, 24px</p>
        </div>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 700 }}>H2 — عنوان بخش</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Vazirmatn 700, 20px</p>
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>H3 — عنوان کارت</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Vazirmatn 600, 16px</p>
        </div>
        <div>
          <p style={{ fontSize: '14px' }}>Body — متن معمولی برای توضیحات و محتوا</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Vazirmatn 400, 14px</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Small — توضیحات و متن‌های کم‌اهمیت‌تر</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Vazirmatn 400, 12px</p>
        </div>
        <div>
          <p style={{ fontSize: '10px', color: 'var(--text-faint)' }}>Tiny — برچسب‌ها و metadata</p>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Vazirmatn 400, 10px</p>
        </div>
      </div>
    </div>
  );
}

function ColorsSection({ copy, copied }: { copy: (t: string, i: string) => void; copied: string | null }) {
  const ranks = [
    { rank: 'F', color: '#5b6480' },
    { rank: 'E', color: '#5c8cff' },
    { rank: 'D', color: '#57f2c4' },
    { rank: 'C', color: '#b37cff' },
    { rank: 'B', color: '#ff9d4d' },
    { rank: 'A', color: '#ff62a8' },
    { rank: 'S', color: 'holo' },
    { rank: 'Legend', color: '#ffd166' },
  ];

  return (
    <div className="fade-in">
      <SectionTitle>🎨 رنگ‌ها</SectionTitle>

      <SubTitle>رتبه‌ها</SubTitle>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ranks.map(r => (
          <div key={r.rank} className="card p-3 text-center cursor-pointer" onClick={() => r.color !== 'holo' && copy(r.color, r.rank)}>
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center font-num font-black text-lg mb-2"
              style={{
                border: `2px solid ${r.color === 'holo' ? 'var(--iri-1)' : r.color}`,
                color: r.color === 'holo' ? 'transparent' : r.color,
                background: r.color === 'holo' ? 'var(--holo)' : r.rank === 'Legend' ? r.color + '20' : 'transparent',
                backgroundSize: '220%',
                animation: r.color === 'holo' ? 'holoShift 5s ease-in-out infinite' : r.rank === 'Legend' ? 'legendGlow 2s ease-in-out infinite' : undefined,
                WebkitBackgroundClip: r.color === 'holo' ? 'text' : undefined,
                backgroundClip: r.color === 'holo' ? 'text' : undefined,
              }}>
              {r.rank === 'S' ? 'S' : r.rank === 'Legend' ? '👑' : r.rank}
            </div>
            <p className="text-xs font-bold">{r.rank}</p>
            <p className="text-[10px] font-num" style={{ color: 'var(--text-faint)' }}>{r.color === 'holo' ? '--holo' : r.color}</p>
          </div>
        ))}
      </div>

      <SubTitle>ترکیب‌های مجاز ✅</SubTitle>
      <div className="card space-y-2">
        <div className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--void-2)' }}>
          <div className="w-8 h-8 rounded" style={{ background: '#eaf0fa' }} />
          <span className="text-sm">متن اصلی روی پس‌زمینه تیره</span>
          <span className="text-[10px] font-num mr-auto" style={{ color: 'var(--iri-1)' }}>17:1 ✓</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--void-2)' }}>
          <div className="w-8 h-8 rounded" style={{ background: '#8993ac' }} />
          <span className="text-sm">متن ثانویه روی پنل</span>
          <span className="text-[10px] font-num mr-auto" style={{ color: 'var(--iri-1)' }}>5:1 ✓</span>
        </div>
      </div>

      <SubTitle>ترکیب‌های ممنوع ❌</SubTitle>
      <div className="card space-y-2">
        <p className="text-sm" style={{ color: 'var(--iri-4)' }}>• متن faint (#5b6480) برای اطلاعات مهم</p>
        <p className="text-sm" style={{ color: 'var(--iri-4)' }}>• بیش از ۲ رنگ تأکیدی در یک صفحه</p>
        <p className="text-sm" style={{ color: 'var(--iri-4)' }}>• رنگ‌های اشباع‌شده برای متن طولانی</p>
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <div className="fade-in">
      <SectionTitle>🧩 کامپوننت‌ها</SectionTitle>

      <SubTitle>کارت‌ها</SubTitle>
      <div className="space-y-3 mb-6">
        <div className="card">
          <p className="text-sm font-bold mb-1">کارت معمولی</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>background: --panel-2, border: --line, radius: 16px</p>
        </div>
        <div className="card holo-sweep">
          <p className="text-sm font-bold mb-1">کارت هولو (HoloSweep)</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>نور عبوری — برای پنل هانتر و کارت‌های ویژه</p>
        </div>
        <div className="card" style={{ background: 'radial-gradient(ellipse at top, #ff6a4d15, transparent 70%)' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#ff6a4d' }}>💪 کارت پیلار STR</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>radial-gradient از رنگ پیلار</p>
        </div>
        <div className="card" style={{ borderRight: '3px solid var(--iri-2)' }}>
          <p className="text-sm font-bold mb-1">کارت تأکیدی</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>border-right 3px رنگ — برای AI insight</p>
        </div>
      </div>

      <SubTitle>دکمه‌ها</SubTitle>
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="btn btn-primary">دکمه اصلی (Holo)</button>
        <button className="btn btn-ghost">دکمه Ghost</button>
        <button className="btn" style={{ background: '#ff6a4d', color: '#fff' }}>دکمه پیلار</button>
        <button className="btn" style={{ background: 'var(--panel)', color: 'var(--text-dim)', border: '1px solid var(--line)' }}>غیرفعال</button>
      </div>

      <SubTitle>نشان رتبه (RankBadge)</SubTitle>
      <div className="flex items-center gap-4 mb-6">
        {[18, 24, 32, 36].map(size => (
          <div key={size} className="flex flex-col items-center gap-1">
            <div className="rounded-full flex items-center justify-center font-num font-black"
              style={{ width: size, height: size, border: '2px solid var(--iri-1)', color: 'var(--iri-1)', fontSize: size * 0.4 }}>
              D
            </div>
            <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>{size}px</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-full flex items-center justify-center font-num font-black trial-pending"
            style={{ width: 32, height: 32, border: '2px solid var(--trial-pending)', color: 'var(--trial-pending)', fontSize: 13 }}>
            C
          </div>
          <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>Pending</span>
        </div>
      </div>

      <SubTitle>نوار پیشرفت</SubTitle>
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-dim)' }}>معمولی</span>
            <span className="font-num">65%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
            <div className="h-full rounded-full" style={{ width: '65%', background: 'var(--iri-1)' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-dim)' }}>هولو (XP)</span>
            <span className="font-num">42%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
            <div className="h-full holo-bar rounded-full" style={{ width: '42%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-dim)' }}>نازک</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--panel)' }}>
            <div className="h-full rounded-full" style={{ width: '80%', background: 'var(--iri-3)' }} />
          </div>
        </div>
      </div>

      <SubTitle>حلقه تکمیل</SubTitle>
      <div className="flex items-center gap-6 mb-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full" style={{ border: '2px dashed var(--iri-1)' }} />
          <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>خالی</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center select-pop" style={{ border: '2px solid var(--iri-1)', background: 'var(--iri-1)' }}>
            <span style={{ color: '#000', fontSize: '12px' }}>✓</span>
          </div>
          <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>تکمیل</span>
        </div>
      </div>

      <SubTitle>چیپ XP</SubTitle>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { pillar: 'STR', color: '#ff6a4d', xp: 45 },
          { pillar: 'VIT', color: '#57f2c4', xp: 17 },
          { pillar: 'INT', color: '#5c8cff', xp: 28 },
          { pillar: 'FIN', color: '#ffc15e', xp: 10 },
          { pillar: 'PER', color: '#b37cff', xp: 60 },
        ].map(c => (
          <span key={c.pillar} className="px-2 py-1 rounded-lg font-num text-xs" style={{ background: c.color + '20', color: c.color }}>
            +{c.xp} XP
          </span>
        ))}
      </div>

      <SubTitle>ورودی‌ها</SubTitle>
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="ورودی معمولی" />
        <input className="input font-num" placeholder="ورودی عددی (Orbitron)" style={{ direction: 'ltr', textAlign: 'left' }} />
      </div>
    </div>
  );
}

function AnimationsSection() {
  return (
    <div className="fade-in">
      <SectionTitle>✨ انیمیشن‌ها</SectionTitle>

      <SubTitle>انیمیشن پیلارها</SubTitle>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { key: 'str', icon: '💪', name: 'strPulse', desc: 'مشت‌مانند' },
          { key: 'vit', icon: '🌿', name: 'vitBreathe', desc: 'نفس‌کشیدن' },
          { key: 'int', icon: '🧠', name: 'intSpark', desc: 'جرقه' },
          { key: 'fin', icon: '💰', name: 'finRise', desc: 'پرش' },
          { key: 'per', icon: '🧘', name: 'perOrbit', desc: 'چرخش' },
        ].map(a => (
          <div key={a.key} className="card text-center p-3">
            <span className={`text-3xl anim-${a.key} inline-block`}>{a.icon}</span>
            <p className="text-[10px] font-bold mt-2">{a.name}</p>
            <p className="text-[9px]" style={{ color: 'var(--text-faint)' }}>{a.desc}</p>
          </div>
        ))}
      </div>

      <SubTitle>افکت‌های ویژه</SubTitle>
      <div className="space-y-3 mb-6">
        <div className="card holo-sweep">
          <p className="text-sm font-bold">HoloSweep — نور عبوری</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>4s, infinite — روی پنل هانتر</p>
        </div>
        <div className="card">
          <p className="text-sm font-bold mb-2">HoloShift — گرادیان متحرک</p>
          <div className="h-8 rounded-lg holo-bar" />
          <p className="text-xs mt-2" style={{ color: 'var(--text-dim)' }}>5s, infinite — نوار XP و رتبه S</p>
        </div>
        <div className="card">
          <p className="text-sm font-bold mb-2">glowDrift — نور محیطی</p>
          <div className="relative h-20 rounded-lg overflow-hidden" style={{ background: 'var(--void-2)' }}>
            <div className="absolute w-20 h-20 rounded-full" style={{ background: 'var(--iri-2)', filter: 'blur(30px)', opacity: 0.3, animation: 'glowDrift 8s ease-in-out infinite' }} />
            <div className="absolute w-16 h-16 rounded-full" style={{ background: 'var(--iri-4)', filter: 'blur(25px)', opacity: 0.3, animation: 'glowDrift 8s ease-in-out infinite', animationDelay: '-3s', left: '40%' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-dim)' }}>22s, infinite — پس‌زمینه کلی</p>
        </div>
        <div className="flex gap-4">
          <div className="card text-center flex-1">
            <div className="w-10 h-10 mx-auto rounded-full glow-pulse flex items-center justify-center" style={{ border: '2px solid var(--iri-1)' }}>
              <span className="font-num text-xs" style={{ color: 'var(--iri-1)' }}>↑</span>
            </div>
            <p className="text-[10px] mt-2">glowPulse</p>
          </div>
          <div className="card text-center flex-1">
            <div className="w-10 h-10 mx-auto rounded-full trial-pending flex items-center justify-center" style={{ border: '2px solid var(--trial-pending)' }}>
              <span className="font-num text-xs" style={{ color: 'var(--trial-pending)' }}>?</span>
            </div>
            <p className="text-[10px] mt-2">trialGlow</p>
          </div>
          <div className="card text-center flex-1">
            <div className="w-10 h-10 mx-auto rounded-full legend-glow flex items-center justify-center" style={{ border: '2px solid var(--legend-gold)' }}>
              <span className="text-xs">👑</span>
            </div>
            <p className="text-[10px] mt-2">legendGlow</p>
          </div>
        </div>
      </div>

      <SubTitle>Easing</SubTitle>
      <div className="card">
        <p className="text-sm mb-2">cubic-bezier(0.34, 1.56, 0.64, 1)</p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>فنری با overshoot خفیف — برای تمام تعاملات کاربر</p>
        <div className="mt-3 h-8 rounded-lg flex items-center px-4" style={{ background: 'var(--panel)' }}>
          <div className="w-6 h-6 rounded-full" style={{ background: 'var(--iri-1)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          <span className="text-xs mr-3" style={{ color: 'var(--text-faint)' }}>← hover کنید</span>
        </div>
      </div>
    </div>
  );
}

function PromptsSection({ copy, copied }: { copy: (t: string, i: string) => void; copied: string | null }) {
  const prompts = [
    {
      id: 'bg',
      title: '🌌 پس‌زمینه اصلی',
      prompt: `Abstract dark space background with subtle nebula effects, deep void black (#050608) base with scattered tiny stars, faint teal (#57f2c4) and purple (#b37cff) nebula clouds at edges, holographic light streaks, futuristic and minimal, 4K, ultra clean, no text, no characters, suitable as mobile app background, dark mode aesthetic, inspired by sci-fi game UI`,
      dims: '1080×1920',
    },
    {
      id: 'icon',
      title: '📱 آیکون اپ',
      prompt: `Mobile app icon design, letter "S" in futuristic Orbitron font style, holographic gradient from teal (#57f2c4) through blue (#5c8cff) and purple (#b37cff) to pink (#ff62a8), dark background (#050608), glowing edges, Solo Leveling anime system window inspired, clean geometric design, rounded square format, premium feel`,
      dims: '1024×1024',
    },
    {
      id: 'legend',
      title: '👑 نشان Legend',
      prompt: `Legendary rank badge design, golden crown with diamond encrusted details, radiant golden glow (#ffd166), dark void background, anime game UI style, Solo Leveling inspired, holographic light rays emanating from center, circular badge format, premium and majestic, no text`,
      dims: '512×512',
    },
    {
      id: 'levelup',
      title: '⚡ افکت Level Up',
      prompt: `Horizontal energy burst effect, holographic gradient from teal to purple, particle effects radiating outward, dark transparent background, gaming UI level up celebration effect, light streaks and sparkles, clean and modern, suitable for overlay on dark UI, no text`,
      dims: '1080×200',
    },
    {
      id: 'hud',
      title: '🖥️ پس‌زمینه HUD',
      prompt: `Futuristic HUD background panel, dark translucent material (#0d111c), subtle hexagonal grid pattern, faint holographic scan lines, teal and blue accent lights at edges, anime game system interface, Solo Leveling status window inspired, minimal and clean, no text, no characters, dark mode`,
      dims: '400×600',
    },
    {
      id: 'dungeon',
      title: '🚪 دروازه Dungeon',
      prompt: `Dark dungeon gate portal, glowing purple and teal energy swirl, ancient stone frame with runic markings, mysterious and inviting, anime RPG game style, Solo Leveling dungeon gate inspired, dark void background, dramatic lighting from within the portal, no characters, no text`,
      dims: '512×512',
    },
    {
      id: 'ceremony',
      title: '🎉 Cermony ارتقا',
      prompt: `Full screen celebration effect, massive holographic light burst from center, golden and teal particles exploding outward, concentric energy rings expanding, dark background, anime rank up ceremony moment, dramatic and epic, Solo Leveling system notification style, no text, no characters`,
      dims: '1080×1920',
    },
    {
      id: 'texture',
      title: '🔲 پترن کارت',
      prompt: `Subtle abstract pattern for card background, very faint geometric hexagonal grid, dark base (#121728), barely visible glowing lines in teal (#57f2c4 at 5% opacity), minimalist, futuristic, suitable as repeating background texture, no text`,
      dims: '400×400 (tileable)',
    },
  ];

  return (
    <div className="fade-in">
      <SectionTitle>🖼️ پرامپت‌های تولید تصویر</SectionTitle>
      <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
        پرامپت‌های آماده برای تولید تصاویر AI — با کلیک روی هر کارت، پرامپت کپی می‌شود.
      </p>

      <div className="space-y-4">
        {prompts.map(p => (
          <div key={p.id} className="card cursor-pointer" onClick={() => copy(p.prompt, p.id)}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm">{p.title}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-num" style={{ background: 'var(--panel)', color: 'var(--text-faint)' }}>
                {p.dims}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)', direction: 'ltr', textAlign: 'left' }}>
              {p.prompt}
            </p>
            {copied === p.id && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: 'var(--iri-1)' }}>
                <Check size={12} /> کپی شد!
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UxSection() {
  return (
    <div className="fade-in">
      <SectionTitle>🧠 اصول UX</SectionTitle>

      <div className="space-y-4">
        <div className="card" style={{ borderRight: '3px solid var(--iri-1)' }}>
          <h3 className="font-bold text-sm mb-2">۱. اصل "نگاه Finch"</h3>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>هرگز کاربر را برای جا ماندن سرزنش نکن. نبودن یک روز هیچ اتفاق بدی نیست.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(255,98,168,0.1)' }}>
              <p className="text-[10px] mb-1" style={{ color: 'var(--iri-4)' }}>❌ ممنوع</p>
              <p className="text-xs">"استریکت سوخت!"</p>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(87,242,196,0.1)' }}>
              <p className="text-[10px] mb-1" style={{ color: 'var(--iri-1)' }}>✅ درست</p>
              <p className="text-xs">"برگرد، هر لحظه می‌تونی شروع کنی"</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderRight: '3px solid var(--iri-2)' }}>
          <h3 className="font-bold text-sm mb-2">۲. Derive, Don't Ask</h3>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>تا جای ممکن از داده‌های موجود استخراج کن، نه اینکه از کاربر بپرسی.</p>
          <div className="mt-2 text-xs space-y-1" style={{ color: 'var(--text-faint)' }}>
            <p>• SL/TP از entry + risk% + RR</p>
            <p>• Hunter Rank از ضعیف‌ترین pillar</p>
            <p>• Focus pillars از نرخ تکمیل هفته</p>
          </div>
        </div>

        <div className="card" style={{ borderRight: '3px solid var(--iri-3)' }}>
          <h3 className="font-bold text-sm mb-2">۳. پیشنهاد، نه اعمال</h3>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>هر تغییر در task، stop loss، یا تنظیمات — همیشه با تأیید صریح کاربر.</p>
        </div>

        <div className="card" style={{ borderRight: '3px solid var(--iri-4)' }}>
          <h3 className="font-bold text-sm mb-2">۴. تقلیل تصمیم</h3>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>سیستم ۲ پیلار تمرکز را مشخص می‌کند. کاربر نباید هر روز تصمیم بگیرد.</p>
        </div>

        <div className="card" style={{ borderRight: '3px solid var(--legend-gold)' }}>
          <h3 className="font-bold text-sm mb-2">۵. بازخورد فوری</h3>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>هر تعامل باید بازخورد بصری فوری داشته باشد.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['✓ تکمیل → XP fly', '↑ Level up → glow', '🏆 Rank up → ceremony', '🪙 خرید → coin anim'].map(t => (
              <span key={t} className="text-[10px] px-2 py-1 rounded" style={{ background: 'var(--panel)', color: 'var(--text-dim)' }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ borderRight: '3px solid var(--fin)' }}>
          <h3 className="font-bold text-sm mb-2">۶. هرگز Farm نکن</h3>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>تکرار بی‌معنی یک کار ساده نباید XP بدهد. تنوع تشویق می‌شود.</p>
        </div>
      </div>
    </div>
  );
}

function PatternsSection() {
  return (
    <div className="fade-in">
      <SectionTitle>🔄 الگوهای تعامل</SectionTitle>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span style={{ color: 'var(--iri-1)' }}>۱.</span> تکمیل تسک (مهم‌ترین تعامل)
          </h3>
          <div className="space-y-2 text-xs" style={{ color: 'var(--text-dim)' }}>
            <p>۱. کاربر روی حلقه کلیک می‌کند</p>
            <p>۲. حلقه با <code className="px-1 rounded" style={{ background: 'var(--panel)' }}>selectPop</code> پر می‌شود (300ms)</p>
            <p>۳. درخشش حلقه‌ای (300ms)</p>
            <p>۴. عدد XP به سمت نوار بالا پرواز می‌کند (800ms)</p>
            <p>۵. Toast "+XP ✨" ظاهر می‌شود</p>
            <p>۶. عنوان تسک خط‌خورده و fade می‌شود</p>
            <p>۷. اگر همه تسک‌های پیلار تکمیل شد → مهر "تکمیل ✓"</p>
            <p>۸. اگر همه تسک‌های روز تکمیل شد → streak +1 + glow</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span style={{ color: 'var(--iri-2)' }}>۲.</span> ورود به پیلار
          </h3>
          <div className="space-y-2 text-xs" style={{ color: 'var(--text-dim)' }}>
            <p>۱. کلیک روی آیکون پیلار در bottom nav</p>
            <p>۲. صفحه با fadeIn وارد می‌شود</p>
            <p>۳. هدر با radial-gradient رنگ پیلار</p>
            <p>۴. آیکون با انیمیشن اختصاصی</p>
            <p>۵. نوار XP با رنگ پیلار</p>
            <p>۶. لیست تسک‌ها با opacity transition</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span style={{ color: 'var(--iri-3)' }}>۳.</span> ثبت معامله (Trade)
          </h3>
          <div className="space-y-2 text-xs" style={{ color: 'var(--text-dim)' }}>
            <p>۱. فرم با فیلدهای ضروری</p>
            <p>۲. محاسبه فوری SL/TP هنگام تایپ</p>
            <p>۳. هشدار زرد اگر از سقف ریسک رد شود</p>
            <p>۴. هشدار هم‌پوشانی اگر نماد تکراری باشد</p>
            <p>۵. ثبت → نمایش در لیست با انیمیشن</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagesSection() {
  const pages = [
    { name: 'ورود', icon: '🔐', desc: 'ایمیل + رمز (شخصی)' },
    { name: 'آنبوردینگ', icon: '📝', desc: '۶ مرحله wizard' },
    { name: 'اولین تسک', icon: '🎯', desc: 'Aha moment' },
    { name: 'خانه', icon: '🏠', desc: 'داشبورد اصلی' },
    { name: 'پیلارها', icon: '💪🌿🧠💰🧘', desc: 'تسک‌های هر بخش' },
    { name: 'جایزه', icon: '🎁', desc: 'فروشگاه' },
    { name: 'دستاوردها', icon: '🏆', desc: 'مدال‌ها' },
    { name: 'گزارش', icon: '📊', desc: 'آمار و تحلیل' },
    { name: 'هانتر', icon: '⭐', desc: 'وضعیت کلی + کلاس' },
    { name: 'ماجراجویی', icon: '⚔️', desc: 'Dungeon system' },
    { name: 'ترید', icon: '📈', desc: '۴ tab داخلی' },
  ];

  return (
    <div className="fade-in">
      <SectionTitle>📄 صفحات و جریان کاربر</SectionTitle>

      <SubTitle>جریان اصلی</SubTitle>
      <div className="card mb-4">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="px-2 py-1 rounded" style={{ background: 'var(--panel)', color: 'var(--iri-1)' }}>Login</span>
          <span style={{ color: 'var(--text-faint)' }}>→</span>
          <span className="px-2 py-1 rounded" style={{ background: 'var(--panel)', color: 'var(--iri-2)' }}>Onboarding</span>
          <span style={{ color: 'var(--text-faint)' }}>→</span>
          <span className="px-2 py-1 rounded" style={{ background: 'var(--panel)', color: 'var(--iri-3)' }}>First Quest</span>
          <span style={{ color: 'var(--text-faint)' }}>→</span>
          <span className="px-2 py-1 rounded" style={{ background: 'var(--panel)', color: 'var(--iri-4)' }}>Dashboard</span>
        </div>
      </div>

      <SubTitle>لیست صفحات</SubTitle>
      <div className="grid grid-cols-2 gap-2">
        {pages.map(p => (
          <div key={p.name} className="card p-3">
            <p className="text-lg mb-1">{p.icon}</p>
            <p className="text-sm font-bold">{p.name}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponsiveSection() {
  return (
    <div className="fade-in">
      <SectionTitle>📱 Responsive Design</SectionTitle>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-bold text-sm mb-3">Breakpoints</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--void-2)' }}>
              <span className="text-lg">📱</span>
              <div>
                <p className="text-sm font-bold">موبایل (پیش‌فرض)</p>
                <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>max-width: 100%, padding: 16px</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--void-2)' }}>
              <span className="text-lg">📟</span>
              <div>
                <p className="text-sm font-bold">تبلت (≥768px)</p>
                <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>max-width: 480px, margin: 0 auto</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--void-2)' }}>
              <span className="text-lg">🖥️</span>
              <div>
                <p className="text-sm font-bold">دسکتاپ (≥1040px)</p>
                <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>LiveClock فعال, پنل‌ها عریض‌تر</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3">قوانین</h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-dim)' }}>
            <li>• اپ mobile-first طراحی شده</li>
            <li>• حداکثر عرض محتوا: 480px (حتی در دسکتاپ)</li>
            <li>• Bottom nav همیشه ثابت</li>
            <li>• Header sticky</li>
            <li>• اسکرول عمودی طبیعی</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function A11ySection() {
  return (
    <div className="fade-in">
      <SectionTitle>♿ دسترسی‌پذیری</SectionTitle>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-bold text-sm mb-3">کنتراست</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--void-2)' }}>
              <span className="text-sm" style={{ color: '#eaf0fa' }}>متن اصلی (#eaf0fa)</span>
              <span className="font-num text-xs" style={{ color: 'var(--iri-1)' }}>17:1 ✓✓✓</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--panel-2)' }}>
              <span className="text-sm" style={{ color: '#8993ac' }}>متن dim (#8993ac)</span>
              <span className="font-num text-xs" style={{ color: 'var(--iri-1)' }}>5:1 ✓✓</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--panel-2)' }}>
              <span className="text-sm" style={{ color: '#5b6480' }}>متن faint (#5b6480)</span>
              <span className="font-num text-xs" style={{ color: 'var(--iri-4)' }}>2.8:1 ⚠️</span>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>هرگز متن faint برای اطلاعات مهم استفاده نکن</p>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3">RTL</h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-dim)' }}>
            <li>• direction: rtl روی body</li>
            <li>• text-align: right پیش‌فرض</li>
            <li>• آیکون‌های جهت‌دار معکوس می‌شوند</li>
            <li>• اعداد و متن انگلیسی LTR باقی می‌مانند</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3">Reduced Motion</h3>
          <pre className="text-xs p-3 rounded-lg" style={{ background: 'var(--void-2)', color: 'var(--text-dim)', direction: 'ltr', textAlign: 'left' }}>
{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}
          </pre>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3">Focus</h3>
          <pre className="text-xs p-3 rounded-lg" style={{ background: 'var(--void-2)', color: 'var(--text-dim)', direction: 'ltr', textAlign: 'left' }}>
{`:focus-visible {
  outline: 2px solid var(--iri-1);
  outline-offset: 2px;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
