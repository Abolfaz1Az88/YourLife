# 🎨 Design System — "سیستم" (System Hunter App)

> مستندات کامل طراحی UI/UX پروژه — شامل Design Tokens، پرامپت‌های تولید تصویر،
> راهنمای کامپوننت‌ها، اصول UX، و الگوهای تعامل.

---

## 📋 فهرست

1. [فلسفه طراحی](#1-فلسفه-طراحی)
2. [Design Tokens](#2-design-tokens)
3. [تایپوگرافی](#3-تایپوگرافی)
4. [رنگ‌ها](#4-رنگ‌ها)
5. [فاصله‌ها و گرید](#5-فاصله‌ها-و-گرید)
6. [کامپوننت‌ها](#6-کامپوننت‌ها)
7. [انیمیشن‌ها](#7-انیمیشن‌ها)
8. [پرامپت‌های تولید تصویر](#8-پرامپت‌های-تولید-تصویر)
9. [اصول UX](#9-اصول-ux)
10. [الگوهای تعامل](#10-الگوهای-تعامل)
11. [صفحات و جریان کاربر](#11-صفحات-و-جریان-کاربر)
12. [Responsive Design](#12-responsive-design)
13. [دسترسی‌پذیری (Accessibility)](#13-دسترسی‌پذیری)

---

## 1. فلسفه طراحی

### مفهوم کلیدی
**"فرم بازی‌گونه، محتوای واقعی"** — ظاهر RPG/Solo Leveling، ولی زیرش یه مربی رشد فردی واقعی.

### اصول سه‌گانه
1. **تاریک و فضایی** — حس فضای خلاء، ستاره‌ها، و انرژی کیهانی
2. **هولوگرافیک و ایریدسنت** — گرادیان‌های چندرنگ که آرام حرکت می‌کنند
3. **مینیمال ولی غنی** — اطلاعات زیاد، ولی بدون شلوغی بصری

### الهام‌ها
- **Solo Leveling** — سیستم HUD، نوارهای XP، نشان‌های رتبه
- **Iron Man HUD** — شفافیت لایه‌ها، خطوط نازک، داده‌های شناور
- **Notion** — سادگی و خوانایی محتوای فارسی
- **Linear** — انیمیشن‌های نرم و حرفه‌ای

### قانون طلایی
> هیچ‌چیزی صرفاً برای زیبایی اضافه نمی‌شود. هر المان بصری باید معنا، اطلاعات،
> یا بازخورد عملکردی داشته باشد.

---

## 2. Design Tokens

### رنگ‌های پایه (Background)
```css
--void: #050608;          /* پس‌زمینه اصلی — تقریباً سیاه با ته‌مایه آبی */
--void-2: #0a0d16;        /* پس‌زمینه ثانویه */
--panel: #0d111c;         /* پس‌زمینه پنل‌ها */
--panel-2: #121728;       /* پس‌زمینه کارت‌ها */
```

### خطوط و حاشیه‌ها
```css
--line: rgba(255, 255, 255, 0.09);        /* خط معمولی */
--line-strong: rgba(255, 255, 255, 0.18); /* خط تأکیدی */
```

### متن
```css
--text: #eaf0fa;          /* متن اصلی */
--text-dim: #8993ac;      /* متن ثانویه */
--text-faint: #5b6480;    /* متن کم‌رنگ */
```

### رنگ‌های ایریدسنت (Iridescent)
```css
--iri-1: #57f2c4;   /* فیروزه‌ای — انرژی، سرزندگی */
--iri-2: #5c8cff;   /* آبی — هوش، اعتماد */
--iri-3: #b37cff;   /* بنفش — خلاقیت، رمز و راز */
--iri-4: #ff62a8;   /* صورتی — اشتیاق، هشدار */
```

### گرادیان هولو
```css
--holo: linear-gradient(115deg, #57f2c4, #5c8cff 35%, #b37cff 65%, #ff62a8 100%);
```

### رنگ‌های اختصاصی
```css
--legend-gold: #ffd166;    /* رتبه Legend — طلایی */
--trial-pending: #f2c94c;  /* حلقه انتظار آزمون ارتقا */
```

### رنگ پیلارها
| پیلار | رنگ | کد HEX | معنا |
|-------|------|--------|------|
| STR (قدرت) | 🟠 نارنجی-قرمز | `#ff6a4d` | قدرت، حرارت، انرژی فیزیکی |
| VIT (سرزندگی) | 🟢 فیروزه‌ای | `#57f2c4` | طراوت، زندگی، تعادل |
| INT (هوش) | 🔵 آبی | `#5c8cff` | ذهن، منطق، یادگیری |
| FIN (مالی) | 🟡 طلایی | `#ffc15e` | ثروت، ارزش، امنیت |
| PER (تمرکز) | 🟣 بنفش | `#b37cff` | عمق، آرامش، معنویت |

### رنگ رتبه‌ها
| رتبه | رنگ | کد HEX |
|------|------|--------|
| F | خاکستری | `#5b6480` |
| E | آبی | `#5c8cff` |
| D | فیروزه‌ای | `#57f2c4` |
| C | بنفش | `#b37cff` |
| B | نارنجی | `#ff9d4d` |
| A | صورتی | `#ff62a8` |
| S | هولو (گرادیان) | `--holo` |
| Legend | طلایی + درخشش | `--legend-gold` |

---

## 3. تایپوگرافی

### فونت‌ها
```css
/* فونت اصلی فارسی */
font-family: 'Vazirmatn', system-ui, sans-serif;
/* وزن‌ها: 400 (معمولی), 500 (متوسط), 600 (نیمه‌-bold), 700 (bold), 800 (extra-bold) */

/* فونت اعداد و برچسب‌های انگلیسی */
font-family: 'Orbitron', monospace;
/* وزن‌ها: 500, 600, 700, 800, 900 */
```

### سلسله‌مراتب متن
| سطح | فونت | وزن | سایز | کاربرد |
|-----|------|-----|------|--------|
| H1 | Vazirmatn | 800 | 24px | عنوان اصلی صفحه |
| H2 | Vazirmatn | 700 | 20px | عنوان بخش |
| H3 | Vazirmatn | 600 | 16px | عنوان کارت |
| Body | Vazirmatn | 400 | 14px | متن معمولی |
| Small | Vazirmatn | 400 | 12px | توضیحات |
| Tiny | Vazirmatn | 400 | 10px | برچسب‌ها |
| Number | Orbitron | 700 | متغیر | XP, Level, Coin, آمار |

### نمونه‌های عددی
```
Level: Lv.42        → Orbitron 700, 14px, رنگ پیلار
XP: 1250/2000       → Orbitron 700, 12px
Rank: S             → Orbitron 900, 24px, رنگ رتبه
Coin: 🪙 340        → Orbitron 700, 14px, --fin
Streak: 🔥 7        → Orbitron 700, 14px, --iri-1
```

---

## 4. رنگ‌ها

### روانشناسی رنگ در پروژه

#### تاریکی (Void)
- **حس:** فضا، عمق، بی‌نهایت، تمرکز
- **کاربرد:** ۹۰٪ پس‌زمینه
- **نکته:** هرگز از سیاه خالص `#000` استفاده نکن — ته‌مایه آبی `#050608` حس عمق می‌دهد

#### گرادیان هولو
- **حس:** فناوری پیشرفته، انرژی، تحول
- **کاربرد:** دکمه‌های اصلی، نوار XP، نشان رتبه S
- **حرکت:** `background-size: 220%` با انیمیشن ۵ ثانیه‌ای

#### رنگ‌های پیلار
- هر پیلار **رنگ اختصاصی** دارد که در تمام المان‌هایش استفاده می‌شود
- پس‌زمینه‌ها: `color + 10-15% opacity`
- حاشیه‌ها: `color + 25-40% opacity`
- متن: رنگ خالص
- آیکون: رنگ خالص

### ترکیب‌های رنگی مجاز
```
✅ متن روی پس‌زمینه تیره: --text روی --void/panel
✅ تأکید: --iri-1/2/3/4 روی --panel-2
✅ هشدار: --iri-4 یا --trial-pending
✅ موفقیت: --iri-1 (فیروزه‌ای)
✅ طلایی: فقط برای Legend و دستاوردهای خاص

❌ متن تیره روی پس‌زمینه تیره
❌ رنگ‌های اشباع‌شده برای متن طولانی
❌ بیش از ۲ رنگ تأکیدی در یک صفحه
```

---

## 5. فاصله‌ها و گرید

### سیستم فاصله (4px base)
```
--space-1: 4px    /* فاصله داخلی کوچک */
--space-2: 8px    /* فاصله بین المان‌های نزدیک */
--space-3: 12px   /* فاصله معمولی */
--space-4: 16px   /* padding کارت */
--space-5: 20px   /* padding کارت بزرگ */
--space-6: 24px   /* فاصله بین بخش‌ها */
--space-8: 32px   /* فاصله بین گروه‌ها */
```

### گرید
- **موبایل:** تک‌ستونه، padding 16px
- **تبلت:** ۲ ستونه، padding 20px
- **دسکتاپ:** حداکثر عرض 480px (اپ موبایلی)

### Border Radius
```
--radius-sm: 8px    /* دکمه‌ها، تگ‌ها */
--radius-md: 12px   /* اینپوت‌ها */
--radius-lg: 16px   /* کارت‌ها */
--radius-xl: 24px   /* مودال‌ها */
--radius-full: 9999px /* دکمه‌های گرد، آواتار */
```

---

## 6. کامپوننت‌ها

### 6.1 کارت (Card)
```css
background: var(--panel-2);
border: 1px solid var(--line);
border-radius: 16px;
padding: 20px;
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```
- **Hover:** border-color → `--line-strong`
- **انواع:**
  - کارت معمولی: پس‌زمینه `--panel-2`
  - کارت پیلار: radial-gradient از رنگ پیلار
  - کارت هولو: `holo-sweep` class
  - کارت تأکیدی: border-right 3px رنگ

### 6.2 دکمه (Button)
```css
/* اصلی */
background: var(--holo);
color: #050608;
border-radius: 12px;
padding: 10px 20px;
font-weight: 600;

/* Ghost */
background: transparent;
border: 1px solid var(--line);
color: var(--text-dim);

/* پیلار */
background: var(--pillar-color);
color: #000; /* یا #fff بسته به رنگ */
```
- **Hover:** `transform: scale(1.04)`
- **Active:** `transform: scale(0.97)`
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (فنری)

### 6.3 نشان رتبه (RankBadge)
```
شکل: دایره
اندازه: 18px (کوچک) | 24px (متوسط) | 32px (بزرگ) | 36px (هدر)
حاشیه: 2px solid [رنگ رتبه]
متن: Orbitron 900, رنگ رتبه

رتبه S: background: --holo, متن مشکی
رتبه Legend: legend-glow animation
آزمون در انتظار: trial-pending animation
```

### 6.4 نوار پیشرفت (ProgressBar)
```css
/* کانتینر */
height: 8px;
background: var(--panel);
border-radius: 9999px;
overflow: hidden;

/* پرشونده */
height: 100%;
border-radius: 9999px;
transition: width 0.5s ease;

/* انواع */
- معمولی: background: [رنگ پیلار]
- هولو: background: --holo, background-size: 220%
- نازک: height: 2-4px (برای هدر)
```

### 6.5 حلقه تکمیل (CompletionRing)
```
شکل: دایره 32×32px
حالت خالی: border 2px dashed [رنگ پیلار]
حالت پر: border solid + background [رنگ پیلار] + ✓
انیمیشن تکمیل:
  1. selectPop (scale 0.8→1.15→1)
  2. درخشش حلقه‌ای 300ms
  3. XP fly به سمت نوار بالا
```

### 6.6 چیپ XP
```css
background: [pillar-color] + 20% opacity;
color: [pillar-color];
padding: 4px 8px;
border-radius: 8px;
font-family: Orbitron;
font-size: 12px;
font-weight: 700;
```

### 6.7 ورودی (Input)
```css
background: var(--panel);
border: 1px solid var(--line);
border-radius: 10px;
padding: 10px 14px;
color: var(--text);
font-family: Vazirmatn;
font-size: 14px;
transition: border-color 0.2s;

/* Focus */
border-color: var(--iri-2);
```

### 6.8 Toast (اعلان)
```css
position: fixed;
top: 16px;
left: 50%;
transform: translateX(-50%);
background: var(--panel-2);
border: 1px solid var(--iri-1);
border-radius: 12px;
padding: 8px 16px;
animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 6.9 مودال (Modal)
```css
position: fixed;
inset: 0;
background: rgba(5, 6, 8, 0.85);
backdrop-filter: blur(8px);
display: flex;
align-items: center;
justify-content: center;
z-index: 100;

/* محتوا */
max-width: 400px;
width: 90%;
background: var(--panel-2);
border: 1px solid var(--line-strong);
border-radius: 24px;
padding: 24px;
animation: fadeIn 0.3s ease-out;
```

---

## 7. انیمیشن‌ها

### Easing اصلی
```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
/* فنری با overshoot خفیف — برای تمام تعاملات */
```

### انیمیشن‌های پس‌زمینه
```css
/* حرکت آرام نورهای محیطی */
@keyframes glowDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 20px) scale(0.95); }
}
/* مدت: 22s | easing: ease-in-out | infinite */

/* حرکت گرادیان هولو */
@keyframes holoShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
/* مدت: 5-6s | easing: ease-in-out | infinite */

/* HoloSweep — نور عبوری روی کارت */
@keyframes holoSweep {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}
/* مدت: 4s | easing: ease-in-out | infinite */
```

### انیمیشن‌های پیلار
```css
/* STR — مشت‌مانند، مقیاس + چرخش جزئی */
@keyframes strPulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.12) rotate(3deg); }
}
/* مدت: 2s | easing: spring | infinite */

/* VIT — نفس‌کشیدن آرام */
@keyframes vitBreathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}
/* مدت: 3s | easing: ease-in-out | infinite */

/* INT — جرقه دیجیتالی */
@keyframes intSpark {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; transform: scale(0.95); }
}
/* مدت: 1.5s | steps(3) | infinite */

/* FIN — پرش رو به بالا */
@keyframes finRise {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
/* مدت: 2s | easing: spring | infinite */

/* PER — چرخش مداوم */
@keyframes perOrbit {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* مدت: 8s | easing: linear | infinite */
```

### انیمیشن‌های تعاملی
```css
/* تکمیل تسک */
@keyframes selectPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
/* مدت: 0.3s | easing: spring */

/* پرواز XP */
@keyframes xpFly {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(-30px, -80px) scale(0.5); }
}
/* مدت: 0.8s | easing: ease-out | forwards */

/* درخشش Level Up */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(87, 242, 196, 0.3); }
  50% { box-shadow: 0 0 40px rgba(87, 242, 196, 0.6); }
}
/* مدت: 1.5s | easing: ease-in-out | infinite */

/* انتظار آزمون */
@keyframes trialGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(242, 201, 76, 0.4); }
  50% { box-shadow: 0 0 16px rgba(242, 201, 76, 0.7); }
}
/* مدت: 2s | easing: ease-in-out | infinite */

/* درخشش Legend */
@keyframes legendGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(255, 209, 102, 0.4); }
  50% { box-shadow: 0 0 24px rgba(255, 209, 102, 0.7); }
}
/* مدت: 2s | easing: ease-in-out | infinite */

/* ورود نرم */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
/* مدت: 0.4s | easing: ease-out */

/* Toast */
@keyframes toastIn {
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
/* مدت: 0.3s | easing: spring */
```

### قوانین انیمیشن
1. **هرگز** چشمک‌زن آزاردهنده نداشته باش
2. انیمیشن‌های پس‌زمینه **بسیار آرام** باشند (22s+)
3. انیمیشن‌های تعاملی **کوتاه و فنری** باشند (0.2-0.5s)
4. `prefers-reduced-motion` را محترم بشمار
5. هیچ انیمیشانی نباید محتوای خواندنی را مختل کند

---

## 8. پرامپت‌های تولید تصویر

### 8.1 پس‌زمینه اصلی (Hero Background)
```
Prompt:
Abstract dark space background with subtle nebula effects, deep void black 
(#050608) base with scattered tiny stars, faint teal (#57f2c4) and purple 
(#b37cff) nebula clouds at edges, holographic light streaks, futuristic 
and minimal, 4K, ultra clean, no text, no characters, suitable as mobile 
app background, dark mode aesthetic, inspired by sci-fi game UI

Dimensions: 1080×1920 (mobile) or 1920×1080 (desktop)
Style: Abstract, minimal, dark
```

### 8.2 آیکون اپ (App Icon)
```
Prompt:
Mobile app icon design, letter "S" in futuristic Orbitron font style, 
holographic gradient from teal (#57f2c4) through blue (#5c8cff) and 
purple (#b37cff) to pink (#ff62a8), dark background (#050608), 
glowing edges, Solo Leveling anime system window inspired, 
clean geometric design, rounded square format, premium feel

Dimensions: 1024×1024
Style: Icon design, futuristic, holographic
```

### 8.3 نشان رتبه Legend
```
Prompt:
Legendary rank badge design, golden crown with diamond encrusted details, 
radiant golden glow (#ffd166), dark void background, anime game UI style, 
Solo Leveling inspired, holographic light rays emanating from center, 
circular badge format, premium and majestic, no text

Dimensions: 512×512
Style: Game UI badge, golden, legendary
```

### 8.4 افکت Level Up
```
Prompt:
Horizontal energy burst effect, holographic gradient from teal to purple, 
particle effects radiating outward, dark transparent background, 
gaming UI level up celebration effect, light streaks and sparkles, 
clean and modern, suitable for overlay on dark UI, no text

Dimensions: 1080×200
Style: VFX, holographic, energy burst
```

### 8.5 پس‌زمینه پنل هانتر
```
Prompt:
Futuristic HUD background panel, dark translucent material (#0d111c), 
subtle hexagonal grid pattern, faint holographic scan lines, 
teal and blue accent lights at edges, anime game system interface, 
Solo Leveling status window inspired, minimal and clean, 
no text, no characters, dark mode

Dimensions: 400×600
Style: Game HUD, futuristic, translucent
```

### 8.6 المان Dungeon
```
Prompt:
Dark dungeon gate portal, glowing purple and teal energy swirl, 
ancient stone frame with runic markings, mysterious and inviting, 
anime RPG game style, Solo Leveling dungeon gate inspired, 
dark void background, dramatic lighting from within the portal, 
no characters, no text

Dimensions: 512×512
Style: Fantasy RPG, dark portal, anime
```

### 8.7 پترن پس‌زمینه کارت پیلار
```
Prompt:
Subtle abstract pattern for card background, very faint geometric 
hexagonal grid, dark base (#121728), barely visible glowing lines 
in teal (#57f2c4 at 5% opacity), minimalist, futuristic, 
suitable as repeating background texture, no text

Dimensions: 400×400 (tileable)
Style: Texture, geometric, minimal
```

### 8.8 افکت Cermony ارتقا رتبه
```
Prompt:
Full screen celebration effect, massive holographic light burst from center, 
golden and teal particles exploding outward, concentric energy rings 
expanding, dark background, anime rank up ceremony moment, 
dramatic and epic, Solo Leveling system notification style, 
no text, no characters

Dimensions: 1080×1920
Style: VFX, celebration, epic, holographic
```

---

## 9. اصول UX

### 9.1 اصل "نگاه Finch" (نه Habitica)
> **هرگز** کاربر را برای جا ماندن، افت عملکرد، یا مصرف توکن فریز سرزنش نکن.
> نبودن یک روز هیچ اتفاق بدی نیست. برگشتن یک لِفت کوچک واقعیه.

**پیاده‌سازی:**
- ❌ پیام "استریکت سوخت!" → ✅ "برگرد، هر لحظه می‌تونی شروع کنی"
- ❌ رنگ قرمز برای روزهای خالی → ✅ رنگ خاکستری کم‌رنگ
- ❌ از دست دادن XP → ✅ هیچ‌چیز از دست نمی‌رود

### 9.2 سلسله‌مراتب اطلاعات
```
سطح ۱ (فوری):    XP gained, Task completion, Streak
سطح ۲ (امروز):   Quest list, Daily progress, Focus pillars
سطح ۳ (هفتگی):   Heatmap, Weekly report, AI insight
سطح ۴ (بلندمدت): Rank, Level, Achievements, Correlations
```

### 9.3 اصل "Derive, Don't Ask"
> تا جای ممکن از داده‌های موجود استخراج کن، نه اینکه از کاربر بپرسی.

**مثال‌ها:**
- SL/TP از entry + risk% + RR derive می‌شوند
- Hunter Rank از ضعیف‌ترین pillar محاسبه می‌شود
- Focus pillars از نرخ تکمیل هفته اخیر تعیین می‌شوند

### 9.4 اصل "پیشنهاد، نه اعمال"
> هر تغییر در task، stop loss، یا تنظیمات — همیشه با تأیید صریح کاربر.

### 9.5 اصل "تقلیل تصمیم"
> کاربر نباید هر روز تصمیم بگیرد چه کاری انجام دهد.
> سیستم ۲ پیلار تمرکز را مشخص می‌کند.

### 9.6 اصل "بازخورد فوری"
> هر تعامل باید بازخورد بصری/لمسی فوری داشته باشد:
> - تکمیل تسک → انیمیشن + XP fly + toast
> - Level up → glow pulse
> - Rank up → ceremony
> - خرید → coin deduction animation

### 9.7 اصل "هرگز farm نکن"
> تکرار بی‌معنی یک کار ساده نباید XP بدهد.
> تنوع تشویق می‌شود، تکرار بی‌هدف diminishing returns دارد.

---

## 10. الگوهای تعامل

### 10.1 تکمیل تسک (مهم‌ترین تعامل)
```
1. کاربر روی حلقه کلیک می‌کند
2. حلقه با selectPop پر می‌شود (300ms)
3. درخشش حلقه‌ای (300ms)
4. عدد XP از کارت به سمت نوار بالا پرواز می‌کند (800ms)
5. Toast "+XP ✨" ظاهر می‌شود
6. عنوان تسک خط‌خورده و fade می‌شود
7. اگر همه تسک‌های پیلار انجام شد → مهر "تکمیل ✓" با درخشش
8. اگر همه تسک‌های روز انجام شد → streak +1 + glow pulse
```

### 10.2 ورود به پیلار
```
1. کاربر روی آیکون پیلار در bottom nav کلیک می‌کند
2. صفحه با fadeIn وارد می‌شود
3. هدر پیلار با radial-gradient رنگ پیلار
4. آیکون پیلار با انیمیشن اختصاصی‌اش
5. نوار XP با رنگ پیلار
6. لیست تسک‌ها با opacity transition
```

### 10.3 باز شدن Dungeon
```
1. کاربر روی "شروع" کلیک می‌کند
2. مودال تأیید با اطلاعات dungeon
3. پس از تأیید → انیمیشن ورود (fade + scale)
4. Quest log dungeon نمایش داده می‌شود
5. هر quest مستقل از تسک‌های روزمره
```

### 10.4 ثبت معامله (Trade)
```
1. فرم با فیلدهای ضروری
2. محاسبه فوری SL/TP هنگام تایپ
3. هشدار زرد اگر از سقف ریسک رد شود
4. هشدار هم‌پوشانی اگر نماد تکراری باشد
5. ثبت → نمایش در لیست با انیمیشن
```

### 10.5 ناوبری
```
Bottom Nav:
- حداکثر ۱۲ آیتم (قابل اسکرول افقی)
- آیتم فعال: background panel-2 + رنگ iri-1
- آیتم غیرفعال: transparent + رنگ faint
- آیکون 18px + متن 10px
```

---

## 11. صفحات و جریان کاربر

### جریان اصلی
```
Login → Onboarding (6 steps) → First Quest → Dashboard
```

### صفحات
| صفحه | مسیر | توضیح |
|------|------|--------|
| ورود | `/login` | ایمیل + رمز (شخصی) |
| آنبوردینگ | `/onboarding` | ۶ مرحله wizard |
| اولین تسک | `/first-quest` | Aha moment |
| خانه | `/home` | داشبورد اصلی |
| پیلار | `/str` `/vit` ... | تسک‌های هر بخش |
| جایزه | `/rewards` | فروشگاه |
| دستاوردها | `/achievements` | مدال‌ها |
| گزارش | `/report` | آمار و تحلیل |
| هانتر | `/hunter` | وضعیت کلی + کلاس |
| ماجراجویی | `/dungeons` | Dungeon system |
| ترید | `/trade` | ۴ tab داخلی |

---

## 12. Responsive Design

### Breakpoints
```css
/* موبایل (پیش‌فرض) */
max-width: 100%;
padding: 16px;

/* تبلت */
@media (min-width: 768px) {
  max-width: 480px;
  margin: 0 auto;
}

/* دسکتاپ */
@media (min-width: 1040px) {
  /* LiveClock فعال می‌شود */
  /* پنل‌ها عریض‌تر */
}
```

### قوانین
1. اپ **mobile-first** طراحی شده
2. حداکثر عرض محتوا: **480px** (حتی در دسکتاپ)
3. Bottom nav همیشه ثابت
4. Header sticky
5. اسکرول عمودی طبیعی

---

## 13. دسترسی‌پذیری

### کنتراست
- متن اصلی (`#eaf0fa`) روی پس‌زمینه (`#050608`) → نسبت ~17:1 ✅
- متن dim (`#8993ac`) روی panel (`#121728`) → نسبت ~5:1 ✅
- هرگز متن faint (`#5b6480`) برای اطلاعات مهم استفاده نکن

### RTL
- `direction: rtl` روی body
- `text-align: right` پیش‌فرض
- آیکون‌های جهت‌دار (chevron) معکوس می‌شوند
- اعداد و متن انگلیسی LTR باقی می‌مانند

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### فوکوس
```css
:focus-visible {
  outline: 2px solid var(--iri-1);
  outline-offset: 2px;
}
```

---

## 📎 پیوست: چک‌لیست طراحی

### قبل از اضافه کردن هر المان جدید:
- [ ] آیا اطلاعات/function واقعی دارد؟ (نه صرفاً تزئینی)
- [ ] آیا با Design Tokens موجود همخوانی دارد؟
- [ ] آیا انیمیشن‌اش از easing صحیح استفاده می‌کند؟
- [ ] آیا در حالت RTL درست نمایش داده می‌شود؟
- [ ] آیا کنتراست کافی دارد؟
- [ ] آیا بازخورد تعاملی دارد؟
- [ ] آیا کاربر را سرزنش نمی‌کند؟
- [ ] آیا فرم بازی‌گونه ولی محتوای واقعی دارد؟

---

*نسخه ۱.۰ — مستندات طراحی سیستم هانتر*
*تمامی مقادیر دقیق و قابل کپی در CSS/React هستند*
