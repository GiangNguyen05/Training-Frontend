# 🎵 Music Landing Page — Design System & UI Documentation

> **v2.0 · Senior Frontend Reference · Production Ready**
> Synthwave · Dark · Responsive · Accessible · Performant

| Resource     | URL                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| Figma Design | [Template-MusicWeb](https://www.figma.com/design/cDHO3ya1mLZmpvKCluUomp/Template-MusicWeb?node-id=0-1) |
| Live Deploy  | [giangnguyen05.github.io](https://giangnguyen05.github.io/Training-Frontend/HTMLCSS/DemoMusicWeb/)     |

---

## Mục lục

1. [Breakpoint System](#1-breakpoint-system)
2. [Layout Blocks — Responsive Behavior](#2-layout-blocks--responsive-behavior)
3. [Design Tokens](#3-design-tokens)
4. [Typography System](#4-typography-system)
5. [Components](#5-components)
6. [Animation System](#6-animation-system)
7. [Layout Primitives](#7-layout-primitives)
8. [Accessibility (WCAG 2.1 AA)](#8-accessibility-wcag-21-aa)
9. [Performance Optimization](#9-performance-optimization)
10. [SEO & Meta Tags](#10-seo--meta-tags)
11. [Theme System (Dark / Light)](#11-theme-system-dark--light)
12. [Error & Empty States](#12-error--empty-states)
13. [QA Testing Checklist](#13-qa-testing-checklist)
14. [File Structure](#14-recommended-file-structure)
15. [Do's & Don'ts](#15-dos--donts--senior-code-standards)

---

## 1. Breakpoint System

Chỉ **2 breakpoints**. Mobile-first (base = mobile). Không dùng `max-width` queries.

| Breakpoint    | Range        | Container  | Padding | Body Font |
| ------------- | ------------ | ---------- | ------- | --------- |
| Mobile (base) | < 768px      | 100%       | 20px    | 15px      |
| Tablet        | 768 – 1023px | 100%       | 32px    | 16px      |
| Desktop       | ≥ 1024px     | max 1280px | 32px    | 17px      |

```css
/* Breakpoint cascade — mobile-first */
/* base = mobile (360–767px) */
@media (min-width: 768px) {
  /* tablet upgrades */
}
@media (min-width: 1024px) {
  /* desktop upgrades */
}
```

> ⚠️ **Không dùng `max-width` queries** — gây ra specificity hell khi maintain về sau.

---

## 2. Layout Blocks — Responsive Behavior

### 2.1 Mobile (Base)

| #   | Block     | Layout CSS                                        | Ghi chú                                 |
| --- | --------- | ------------------------------------------------- | --------------------------------------- |
| 1   | Header    | `flex; justify-content: space-between`            | Logo trái · Hamburger phải · Nav hidden |
| 2   | Hero      | `flex-direction: column; gap: 32px`               | Stack: Copy → Player → Stats            |
| 3   | Playlists | `overflow-x: auto; scroll-snap-type: x mandatory` | 1.3 card lộ → gợi swipe                 |
| 4   | Genres    | `grid; repeat(2, 1fr); gap: 12px`                 | 2 cột pill                              |
| 5   | Features  | `grid; 1fr; gap: 20px`                            | 4 card stack dọc                        |
| 6   | Pricing   | `grid; 1fr; gap: 20px`                            | 3 tier stack · featured không scale     |
| 7   | Footer    | `flex-direction: column; gap: 32px`               | Brand → 3 cột link xếp dọc              |

### 2.2 Tablet (≥ 768px)

| Block     | Mobile → Tablet                       | CSS change                              |
| --------- | ------------------------------------- | --------------------------------------- |
| Header    | Hamburger ẩn → Nav ngang + CTA button | `display: flex`                         |
| Hero      | Stack → 2 cột row                     | `flex-direction: row; 1.2fr / 1fr`      |
| Playlists | Rail → Grid                           | `grid-template-columns: repeat(3, 1fr)` |
| Genres    | 2 → 4 cột                             | `repeat(4, 1fr)`                        |
| Features  | 1 → 2×2                               | `repeat(2, 1fr)`                        |
| Pricing   | 1 → 3 cột                             | `repeat(3, 1fr)` · featured flat        |
| Footer    | Stack → Row                           | `flex-direction: row` · brand 40%       |

### 2.3 Desktop (≥ 1024px)

| Block     | Tablet → Desktop                               | Lý do                                |
| --------- | ---------------------------------------------- | ------------------------------------ |
| Header    | gap 28px → 36px · hover neon underline         | Có chuột → cần hover affordance      |
| Hero      | gap 32px → 64px · sun 480px · player max 380px | Khai thác 1280px, tăng visual weight |
| Playlists | 3 → 4 cột                                      | Container 1280px đủ rộng             |
| Genres    | 4 → 6 cột                                      | 12 pills gọn trong 2 hàng            |
| Features  | 2×2 → 4×1 row                                  | Scan ngang nhanh hơn                 |
| Pricing   | Flat → featured `scale(1.05)` + glow           | WOW effect · mobile tránh overflow   |
| Footer    | Row → `grid 2fr 1fr 1fr 1fr`                   | Brand block nổi bật                  |

---

## 3. Design Tokens

> Tất cả giá trị đều dùng qua `var(--token)`. **Không hardcode** color/size trong component CSS.

### 3.1 Color Tokens

| Token            | Hex                         | Dùng ở                                          |
| ---------------- | --------------------------- | ----------------------------------------------- |
| `--bg`           | `#07021A`                   | body base                                       |
| `--surface`      | `#14072E`                   | card: playlist · feature · price                |
| `--surface-2`    | `#1E0A42`                   | hover state của card, dropdown bg               |
| `--text`         | `#F5E9FF`                   | body, headings chính                            |
| `--muted`        | `#A99DC8`                   | description, meta, footer links                 |
| `--pink`         | `#FF2BD6`                   | primary brand, CTA chính, featured border       |
| `--cyan`         | `#00E5FF`                   | eyebrow, link-arrow, feature accent, focus ring |
| `--purple`       | `#7B2FBE`                   | secondary accent, icon fills                    |
| `--grad-primary` | `pink → purple → cyan 135°` | logo, btn-primary, `.grad` text                 |
| `--shadow-glow`  | dual neon (pink + purple)   | btn hover, featured card, player                |
| `--overlay`      | `rgba(7,2,26,0.8)`          | modal backdrop, mobile drawer                   |

### 3.2 Spacing & Layout Tokens

| Token                  | Giá trị                           | Dùng ở                    |
| ---------------------- | --------------------------------- | ------------------------- |
| `--radius`             | `16px`                            | card border-radius        |
| `--radius-sm`          | `10px`                            | pill, chip, badge         |
| `--radius-xs`          | `6px`                             | input, small button       |
| `--container`          | `1280px`                          | max-width desktop         |
| `--section-py-mobile`  | `64px`                            | section padding-y mobile  |
| `--section-py-tablet`  | `80px`                            | section padding-y tablet  |
| `--section-py-desktop` | `112px`                           | section padding-y desktop |
| `--transition`         | `0.25s cubic-bezier(0.4,0,0.2,1)` | tất cả transitions        |
| `--transition-slow`    | `0.5s cubic-bezier(0.4,0,0.2,1)`  | page-level animations     |

### 3.3 Typography Scale

| Token       | `clamp()` value                    | Dùng ở                    |
| ----------- | ---------------------------------- | ------------------------- |
| `--fs-hero` | `clamp(2rem, 8vw, 5rem)`           | H1 hero                   |
| `--fs-h2`   | `clamp(1.5rem, 4vw, 2.5rem)`       | section headings          |
| `--fs-h3`   | `clamp(1.1rem, 2.5vw, 1.5rem)`     | card titles               |
| `--fs-body` | `clamp(0.9375rem, 1vw, 1.0625rem)` | body text                 |
| `--fs-sm`   | `0.875rem`                         | meta, caption, badge text |
| `--fs-xs`   | `0.75rem`                          | legal, helper text        |

> 💡 **Dùng `clamp()` thay fixed size** — fluid typography, không cần override ở từng breakpoint.

---

## 4. Typography System

### 4.1 Font Stack

| Font         | Weights               | Fallback                | Vai trò                                                  |
| ------------ | --------------------- | ----------------------- | -------------------------------------------------------- |
| **Orbitron** | 600 / 800 / 900       | `monospace`             | H1–H4, logo, eyebrow, stats, badge → synthwave/tech feel |
| **Inter**    | 400 / 500 / 600 / 700 | `system-ui, sans-serif` | Body, paragraph, button, nav, link                       |

```html
<!-- Đặt trong <head> — preconnect trước khi load font -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### 4.2 Text Utility Classes

| Class         | Effect                                                     | Dùng ở                          |
| ------------- | ---------------------------------------------------------- | ------------------------------- |
| `.eyebrow`    | Uppercase · cyan · `letter-spacing: 3px` · Orbitron        | mọi section header, hero        |
| `.grad`       | `background-clip: text` · gradient fill · drop-shadow neon | keyword nổi bật trong H1/H2     |
| `.link-arrow` | Cyan link "Xem tất cả →" · hover glow                      | section-head right side         |
| `.text-muted` | `color: var(--muted)`                                      | description, meta, footer links |
| `.text-pink`  | `color: var(--pink)`                                       | accent labels                   |
| `.text-cyan`  | `color: var(--cyan)`                                       | secondary accent text           |

```css
.grad {
  background: var(--grad-primary);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 16px rgba(255, 43, 214, 0.4));
}
```

---

## 5. Components

### 5.1 Button System

| Variant        | Style                           | States: hover / focus / active / disabled                                                                 | Use case                      |
| -------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `.btn-primary` | Gradient + neon glow shadow     | hover: `translateY(-2px)` + glow · focus: cyan ring 3px · active: `scale(0.97)` · disabled: `opacity 0.4` | Hero CTA, header CTA, premium |
| `.btn-outline` | Border pink, 50% transparent bg | hover: `bg rgba(pink,0.1)` + border solid · focus: cyan ring · active: `scale(0.97)`                      | Free tier, secondary actions  |
| `.btn-ghost`   | Transparent, hover pink color   | hover: `color pink` · focus: underline cyan · active: `opacity 0.8`                                       | Nav Sign in, tertiary         |
| `.btn-icon`    | Square, icon only, no label     | hover: `bg surface-2` + rotate icon · focus: ring                                                         | Player controls, social icons |

```css
/* Base button — tất cả variant kế thừa */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  font:
    600 var(--fs-sm) / 1 Inter,
    sans-serif;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 3px;
}

.btn:active {
  transform: scale(0.97);
}
.btn[disabled] {
  opacity: 0.4;
  pointer-events: none;
}
```

> ⚠️ Luôn có `:focus-visible` ring để đảm bảo keyboard accessibility. **WCAG 2.1 Level AA required.**

Modifier classes:

| Modifier     | Padding       | Font size |
| ------------ | ------------- | --------- |
| `.btn-lg`    | `14px 26px`   | `15px`    |
| `.btn-sm`    | `7px 14px`    | `13px`    |
| `.btn-block` | `width: 100%` | —         |

### 5.2 Card Component

```
┌─────────────────────────────┐
│ background: var(--surface)  │
│ border: 1px solid (theme)   │
│ border-radius: var(--radius)│
│ padding: 14–28px            │
│                             │
│ [icon/cover/badge optional] │
│ <h3> title                  │
│ <p> description (muted)     │
│ [CTA optional]              │
└─────────────────────────────┘
```

**Hover chung:** `transform: translateY(-4px)` + border accent + glow shadow.

| Prop          | Playlist Card                  | Feature Card                   | Pricing Card                                    |
| ------------- | ------------------------------ | ------------------------------ | ----------------------------------------------- |
| Border accent | pink                           | cyan                           | pink (featured) / subtle (others)               |
| Hover         | `translateY(-4px)` + pink glow | `translateY(-4px)` + cyan glow | `translateY(-4px)` + `scale(1.05)` desktop only |
| Image / Icon  | Cover art 16:9 aspect          | SVG icon 48×48                 | Tier badge + icon                               |
| Actions       | Play button overlay            | None                           | `btn-primary` hoặc `btn-outline` (full width)   |
| Skeleton      | Gradient shimmer anim          | Gradient shimmer anim          | Gradient shimmer anim                           |

### 5.3 Player Card

| Element      | Spec                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| Layout       | Glass card: `backdrop-filter: blur(20px)` · `border: 1px solid rgba(255,255,255,0.1)` |
| Cover art    | 80×80px thumbnail · `border-radius: 8px` · `object-fit: cover`                        |
| Progress bar | Custom `<input type="range">` · thumb styled pink · track fill gradient               |
| Controls     | 5 icons: shuffle · prev · play/pause · next · repeat                                  |
| Volume       | Inline slider + mute toggle                                                           |
| Mobile       | Full-width, bottom-sticky option cho mobile player                                    |

### 5.4 Navigation

| State           | Behavior                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| Mobile closed   | Logo left · Hamburger right · Nav hidden (`height: 0; overflow: hidden`)             |
| Mobile open     | Drawer: `translateY(0)` · backdrop overlay · **focus trap** inside · Escape to close |
| Tablet/Desktop  | Inline nav flex row · CTA button right · Hamburger gone                              |
| Scroll behavior | Sticky top · `backdrop-filter: blur(16px)` · `border-bottom: rgba(white, 0.05)`      |
| Active link     | Color cyan · `::after` pseudo underline gradient                                     |
| Hover link      | Color white · `::after` scale(1) from scale(0)                                       |

> 🚫 **CRITICAL:** Mobile drawer phải có **focus trap**. Tab không được thoát khỏi menu khi drawer đang mở.

### 5.5 Form Elements

| Element          | Default                                  | Focus                           | Error                        | Disabled                               |
| ---------------- | ---------------------------------------- | ------------------------------- | ---------------------------- | -------------------------------------- |
| Input / Textarea | `bg: surface` · border muted · radius-xs | border cyan · ring 3px cyan 30% | border red · helper text red | `opacity: 0.5` · `cursor: not-allowed` |
| Select           | Custom arrow SVG · same as input         | Same + dropdown shadow          | Same error style             | Same                                   |
| Checkbox / Radio | Custom styled, NOT native                | Ring cyan                       | Red border                   | Opacity 0.5                            |
| Toggle           | Off: `bg muted` · On: `bg pink gradient` | Ring cyan                       | N/A                          | Opacity 0.5                            |

---

## 6. Animation System

Hệ thống animation được chia làm **3 tầng**: Page load → Scroll reveal → Micro-interactions.

### 6.1 Page Load Sequence

```css
/* Staggered reveal — dùng animation-delay */
.hero-copy {
  animation: fadeUp 0.6s ease both;
}
.hero-copy h1 {
  animation-delay: 0.1s;
}
.hero-copy p {
  animation-delay: 0.25s;
}
.hero-copy .btn {
  animation-delay: 0.4s;
}
.hero-player {
  animation: fadeIn 0.8s 0.3s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### 6.2 Scroll Reveal (IntersectionObserver)

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting) {
        el.target.classList.add("visible");
        observer.unobserve(el.target); // fire once
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll("[data-reveal]")
  .forEach((el) => observer.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

[data-reveal].visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger cards trong grid */
[data-reveal]:nth-child(2) {
  transition-delay: 0.1s;
}
[data-reveal]:nth-child(3) {
  transition-delay: 0.2s;
}
[data-reveal]:nth-child(4) {
  transition-delay: 0.3s;
}
```

> ⚠️ Luôn check `prefers-reduced-motion`. **Tắt animation nếu user set giảm chuyển động.**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.3 Micro-interactions

| Element            | Trigger | Effect                                             | Duration |
| ------------------ | ------- | -------------------------------------------------- | -------- |
| Button primary     | hover   | `translateY(-2px)` · glow shadow +20% opacity      | 0.25s    |
| Playlist card      | hover   | `translateY(-4px)` · pink border · play btn fadeIn | 0.25s    |
| Featured card      | hover   | `scale(1.05)` desktop · glow pulse                 | 0.3s     |
| Nav link           | hover   | `::after` underline slide in from left             | 0.3s     |
| Hamburger          | click   | 3 bars → X morph (CSS transform)                   | 0.3s     |
| Play/Pause btn     | click   | Icon swap + ripple                                 | 0.2s     |
| Progress bar thumb | drag    | `scale(1.5)` + glow                                | 0.15s    |
| Pricing toggle     | click   | Slide + fade price text                            | 0.35s    |

### 6.4 Neon Glow Effect

```css
/* Dùng cho featured card, btn-primary hover */
.neon-glow {
  box-shadow:
    0 0 8px rgba(255, 43, 214, 0.4),
    0 0 24px rgba(255, 43, 214, 0.2),
    0 0 48px rgba(123, 47, 190, 0.15);
}

/* Animated pulse — dùng cho live indicator */
@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(255, 43, 214, 0.4);
  }
  50% {
    box-shadow: 0 0 24px rgba(255, 43, 214, 0.8);
  }
}

.glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}
```

---

## 7. Layout Primitives

### 7.1 `.container`

```css
.container {
  width: 100%;
  max-width: var(--container); /* 1280px */
  margin: 0 auto;
  padding: 0 20px; /* mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 0 32px;
  }
}
```

### 7.2 `.section`

```css
.section {
  padding: var(--section-py-mobile) 0;
}

@media (min-width: 768px) {
  .section {
    padding: var(--section-py-tablet) 0;
  }
}
@media (min-width: 1024px) {
  .section {
    padding: var(--section-py-desktop) 0;
  }
}
```

### 7.3 `.section-head`

```html
<header class="section-head">
  <div>
    <span class="eyebrow">— Featured</span>
    <h2>Title <span class="grad">highlight</span></h2>
    <p class="section-sub">subtitle (optional)</p>
  </div>
  <a class="link-arrow">Xem tất cả →</a>
</header>
```

```css
/* Mobile: stack · Tablet+: row space-between */
.section-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .section-head {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

/* Modifier .center — dùng cho Features + Pricing */
.section-head.center {
  align-items: center;
  text-align: center;
  flex-direction: column;
}
```

### 7.4 Responsive Grid Pattern

```css
.x-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

@media (min-width: 768px) {
  .x-grid {
    grid-template-columns: repeat(N, 1fr);
  }
}

@media (min-width: 1024px) {
  .x-grid {
    grid-template-columns: repeat(M, 1fr);
  }
}
```

| Block        | Mobile           | Tablet (N)        | Desktop (M)                  |
| ------------ | ---------------- | ----------------- | ---------------------------- |
| Playlists    | scroll-snap rail | 3                 | 4                            |
| Genres       | 2                | 4                 | 6                            |
| Features     | 1                | 2                 | 4                            |
| Footer links | 1                | `2fr 1fr 1fr 1fr` | `2fr 1fr 1fr 1fr` (gap 64px) |

### 7.5 Mobile Scroll-Snap Rail

```css
.scroll-rail {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* iOS momentum */
  scrollbar-width: none; /* Firefox */
  margin: 0 -20px;
  padding: 0 20px 16px;
}

.scroll-rail::-webkit-scrollbar {
  display: none;
}

.scroll-rail > * {
  flex: 0 0 75%;
  scroll-snap-align: start;
}

/* Upgrade to grid ở tablet+ */
@media (min-width: 768px) {
  .scroll-rail {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow: visible;
    margin: 0;
    padding: 0;
  }

  .scroll-rail > * {
    flex: none;
  }
}
```

---

## 8. Accessibility (WCAG 2.1 AA)

> Đây là **yêu cầu bắt buộc**, không phải optional. Senior FE phải đảm bảo toàn bộ trang dùng được bằng keyboard và screen reader.

### 8.1 Checklist tổng quan

| Hạng mục         | Yêu cầu                                                                | Tool kiểm tra                          |
| ---------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| Color contrast   | Text ≥ 4.5:1 · Large text ≥ 3:1 · UI component ≥ 3:1                   | Colour Contrast Analyser, axe DevTools |
| Focus management | `:focus-visible` ring rõ ràng · focus trap trong modal/drawer          | Tab key manual test                    |
| Keyboard nav     | Mọi interactive element dùng được bằng Tab/Enter/Space/Esc             | Keyboard-only session                  |
| Semantic HTML    | Đúng heading hierarchy (h1→h2→h3) · `<nav>` `<main>` `<footer>`        | HTML validator, axe                    |
| Alt text         | `img` phải có `alt` · Decorative: `alt=""` · Icon button: `aria-label` | axe DevTools                           |
| ARIA roles       | `role=dialog`, `aria-modal`, `aria-label`, `aria-expanded` đúng nơi    | Screen reader test                     |
| Reduced motion   | `prefers-reduced-motion: reduce` → tắt animation                       | OS setting test                        |
| Touch targets    | Minimum **44×44px** cho mọi button trên mobile                         | Chrome DevTools device mode            |

### 8.2 ARIA Patterns quan trọng

```html
<!-- Mobile hamburger menu -->
<button
  class="hamburger"
  aria-label="Mở menu"
  aria-expanded="false"
  aria-controls="mobile-nav"
>
  <span class="sr-only">Menu</span>
</button>

<nav id="mobile-nav" aria-hidden="true">...</nav>

<!-- Player controls -->
<button aria-label="Phát nhạc">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>

<!-- Live region cho thông báo động -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- JS inject: "Đang phát: Tên bài hát" -->
</div>
```

```css
/* Screen-reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 8.3 Color Contrast — Kiểm tra palette hiện tại

| Cặp màu                                        | Tỉ lệ   | Đạt chuẩn |
| ---------------------------------------------- | ------- | --------- |
| `--text` (#F5E9FF) trên `--bg` (#07021A)       | ~15:1   | ✅ AAA    |
| `--pink` (#FF2BD6) trên `--bg` (#07021A)       | ~4.7:1  | ✅ AA     |
| `--cyan` (#00E5FF) trên `--bg` (#07021A)       | ~10.5:1 | ✅ AAA    |
| `--muted` (#A99DC8) trên `--bg` (#07021A)      | ~5.8:1  | ✅ AA     |
| `--muted` (#A99DC8) trên `--surface` (#14072E) | ~5.2:1  | ✅ AA     |
| White text trên `--pink` (#FF2BD6)             | ~1.6:1  | ❌ FAIL   |

> 🚫 **Không dùng text trắng lên background màu `--pink`.** Dùng `--bg` hoặc màu tối thay thế.

---

## 9. Performance Optimization

### 9.1 Core Web Vitals Targets

| Metric                         | Target  | Chiến lược                                                               |
| ------------------------------ | ------- | ------------------------------------------------------------------------ |
| LCP (Largest Contentful Paint) | < 2.5s  | Preload hero image · Inline critical CSS · `font-display: swap`          |
| FID / INP (Interaction)        | < 100ms | Không block main thread · debounce scroll handlers                       |
| CLS (Layout Shift)             | < 0.1   | Explicit `width`/`height` trên `img` · `font-display: optional` fallback |

### 9.2 Font Loading

```html
<!-- Critical: preconnect trước khi load font -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

```css
/* font-display: swap — tránh FOIT (invisible text) */
@font-face {
  font-family: "Orbitron";
  font-display: swap;
  src: url("orbitron.woff2") format("woff2");
}
```

### 9.3 Image Strategy

| Loại ảnh              | Format               | Technique                                                                        |
| --------------------- | -------------------- | -------------------------------------------------------------------------------- |
| Hero / Cover art      | WebP + JPEG fallback | `<picture>` srcset · sizes attribute · `loading="eager"` (hero), `"lazy"` (rest) |
| Playlist thumbnails   | WebP                 | lazy loading · `object-fit: cover` · explicit w/h                                |
| Icons                 | Inline SVG           | Sprite hoặc inline trực tiếp · `aria-hidden="true"`                              |
| Background decorative | CSS gradient / SVG   | Không dùng ảnh raster cho bg synthwave                                           |

```html
<picture>
  <source srcset="hero.webp" type="image/webp" />
  <img
    src="hero.jpg"
    alt="Hero visual"
    width="800"
    height="600"
    loading="eager"
    fetchpriority="high"
  />
</picture>
```

### 9.4 CSS Performance

- Không dùng `@import` trong CSS — dùng `<link>` thay thế
- Không dùng `*` selector trừ CSS reset
- Contain layout cho card nặng: `contain: layout style`
- `will-change: transform` — CHỈ dùng cho element đang animate, remove sau khi xong
- Vendor prefix: dùng PostCSS autoprefixer, không viết tay

### 9.5 JavaScript Strategy

| Feature               | Pattern                                                    |
| --------------------- | ---------------------------------------------------------- |
| Scroll handler        | `debounce(fn, 16)` — không fire mỗi pixel                  |
| IntersectionObserver  | Dùng thay scroll listener cho reveal animation             |
| Event delegation      | 1 listener trên container thay vì N listeners trên N cards |
| Dynamic import        | Pricing toggle, modal — chỉ load JS khi cần                |
| requestAnimationFrame | Wrap DOM write trong `rAF` nếu tính toán phức tạp          |

```js
// Event delegation thay vì gắn listener từng card
document.querySelector(".playlist-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".playlist-card");
  if (!card) return;
  playTrack(card.dataset.id);
});
```

---

## 10. SEO & Meta Tags

### 10.1 `<head>` Template

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MusicApp — Stream Your World | Synthwave Vibes</title>
  <meta
    name="description"
    content="Nghe nhạc không giới hạn. Playlist tuyển chọn, chất lượng lossless."
  />

  <!-- Open Graph / Social sharing -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="MusicApp — Stream Your World" />
  <meta
    property="og:description"
    content="Nghe nhạc không giới hạn. Playlist tuyển chọn, chất lượng lossless."
  />
  <meta property="og:image" content="/og-cover.jpg" />
  <!-- 1200×630px -->
  <meta property="og:url" content="https://yoursite.com" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="/og-cover.jpg" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Canonical -->
  <link rel="canonical" href="https://yoursite.com" />

  <!-- Preconnect fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

### 10.2 Structured Data (JSON-LD)

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MusicApp",
    "url": "https://yoursite.com",
    "description": "Music streaming platform",
    "applicationCategory": "MusicApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
</script>
```

### 10.3 Heading Hierarchy

| Level | Dùng ở                                            | Số lượng               |
| ----- | ------------------------------------------------- | ---------------------- |
| H1    | Hero section — tagline chính                      | **1 duy nhất / trang** |
| H2    | Mỗi section: Playlists, Genres, Features, Pricing | 1 / section            |
| H3    | Card title, feature title, pricing tier name      | Nhiều                  |
| H4    | Subsection nếu cần (tránh nếu không cần thiết)    | Ít                     |

> ⚠️ **Không skip heading level** (h1 → h3 bỏ qua h2). Screen reader dùng headings để navigate.

---

## 11. Theme System (Dark / Light)

### 11.1 Chiến lược

Mặc định là **Dark**. Light theme là override qua `[data-theme="light"]` hoặc `prefers-color-scheme`.

```css
:root {
  /* Dark defaults */
  --bg: #07021a;
  --surface: #14072e;
  --text: #f5e9ff;
  --muted: #a99dc8;
  /* Accent giữ nguyên cả 2 theme */
  --pink: #ff2bd6;
  --cyan: #00e5ff;
}

[data-theme="light"] {
  --bg: #f8f4ff;
  --surface: #ffffff;
  --text: #1a0050;
  --muted: #5b4a7a;
  /* --pink, --cyan, --grad-primary giữ nguyên */
}

/* Auto dark nếu không có JS */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    --bg: #f8f4ff;
    --surface: #ffffff;
    --text: #1a0050;
    --muted: #5b4a7a;
  }
}
```

### 11.2 Toggle Implementation

```js
// Restore theme trước khi render — đặt INLINE trong <head> để tránh FOUC
(function () {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
})();

// Toggle handler
const toggle = document.getElementById("theme-toggle");
const root = document.documentElement;

toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  toggle.setAttribute(
    "aria-label",
    `Chuyển sang ${next === "dark" ? "dark" : "light"} mode`,
  );
});
```

> ⚠️ Script restore theme **PHẢI chạy inline trong `<head>`** để tránh Flash of Unstyled Content (FOUC).

---

## 12. Error & Empty States

### 12.1 Các trường hợp cần xử lý

| State             | Trigger               | UI pattern                                        |
| ----------------- | --------------------- | ------------------------------------------------- |
| Loading skeleton  | Fetch đang pending    | Gradient shimmer animation thay card content      |
| Empty playlists   | User chưa có playlist | Illustration + "Tạo playlist đầu tiên" CTA        |
| Network error     | Fetch thất bại        | Toast notification · retry button · error icon    |
| 404 Not Found     | URL sai               | Full-page 404 có thiết kế synthwave + back button |
| No search results | Search trả về rỗng    | "Không tìm thấy" + suggestion tags                |
| Player error      | File không play được  | Inline error trong player card + skip button      |

### 12.2 Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface) 25%,
    rgba(255, 255, 255, 0.05) 50%,
    var(--surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

```html
<!-- Wrapper cho screen reader -->
<div role="status" aria-label="Đang tải danh sách phát...">
  <div class="skeleton" style="height: 200px;"></div>
  <div
    class="skeleton"
    style="height: 20px; margin-top: 12px; width: 60%;"
  ></div>
</div>
```

### 12.3 Toast Notification

```js
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.textContent = message;

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 4000);
}
```

---

## 13. QA Testing Checklist

### 13.1 Visual / UI

- [ ] Pixel-perfect so với Figma ở cả 3 breakpoints (360 · 768 · 1280px)
- [ ] Dark mode: tất cả element đọc được, contrast đạt
- [ ] Light mode: không có element nào vô hình (trắng trên trắng)
- [ ] Animation smooth 60fps — không jank khi scroll
- [ ] Hover, focus, active, disabled states đều có style

### 13.2 Functionality

- [ ] Hamburger open/close + Escape key close
- [ ] Nav active link theo current route
- [ ] Player: play/pause, seek, volume
- [ ] Pricing toggle (Monthly/Annual) swap price
- [ ] Playlist scroll-snap mobile
- [ ] Theme toggle + persist qua refresh

### 13.3 Accessibility

- [ ] Tab qua toàn trang không bị stuck
- [ ] Focus trap hoạt động trong mobile drawer
- [ ] axe DevTools — **0 critical violations**
- [ ] Lighthouse Accessibility score **≥ 95**
- [ ] Dùng thử VoiceOver (macOS) hoặc NVDA (Windows)

### 13.4 Performance

- [ ] Lighthouse Performance **≥ 90** (mobile)
- [ ] LCP **< 2.5s** trên 4G throttle
- [ ] Không có layout shift khi font load
- [ ] Total JS **< 100KB gzip** (landing page không cần framework nặng)
- [ ] Tất cả image có `width`/`height` attribute

### 13.5 Cross-Browser

| Browser          | Version  | Priority                |
| ---------------- | -------- | ----------------------- |
| Chrome           | Latest 2 | P0                      |
| Firefox          | Latest 2 | P0                      |
| Safari           | Latest 2 | P0                      |
| iOS Safari       | 15+      | P0 (majority mobile VN) |
| Samsung Internet | Latest   | P1                      |
| Edge             | Latest 2 | P1                      |

---

## 14. Recommended File Structure

```
music-landing/
├── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css        # Design tokens (:root vars)
│   │   ├── base.css          # Reset, typography, utilities
│   │   ├── layout.css        # Container, section, grid
│   │   ├── components.css    # Button, card, nav, player, form
│   │   └── animations.css    # Keyframes, reveal, shimmer
│   ├── js/
│   │   ├── main.js           # Init, theme toggle, nav
│   │   ├── player.js         # Audio player logic
│   │   └── reveal.js         # IntersectionObserver scroll reveal
│   ├── images/
│   │   ├── hero/             # WebP + JPEG fallback
│   │   ├── covers/           # Playlist cover art
│   │   └── og-cover.jpg      # 1200×630 social preview
│   └── icons/
│       └── sprite.svg        # All SVG icons in one sprite
└── README.md
```

> 💡 Không bundle CSS thành 1 file lớn cho landing page đơn giản — HTTP/2 multiplexing xử lý tốt hơn.

---

## 15. Do's & Don'ts — Senior Code Standards

### ✅ DO

- Dùng CSS custom properties cho tất cả color/spacing/radius
- Mobile-first: base styles → tablet override → desktop override
- Dùng `:focus-visible` thay `:focus` để tránh outline khi click
- Lazy load tất cả ảnh dưới fold: `loading="lazy"`
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Test bằng keyboard-only trước khi ship
- Commit design token trước khi viết component
- **Animate `transform`/`opacity`** — KHÔNG animate `width`/`height`/`top`/`left`
- Dùng `rem` cho `font-size` — `px` phá vỡ user font size setting

### ❌ DON'T

- Hardcode color hex trong component CSS
- Dùng `!important` trừ khi override third-party styles
- Dùng `style=""` inline trong HTML cho spacing/color
- Quên `alt` text trên `img`
- Animation không có `prefers-reduced-motion` fallback
- Dùng `position: absolute` để layout — dùng Flexbox/Grid
- Skip heading levels (h1 → h3)
- Dùng `px` cho `font-size` gốc — block user accessibility zoom

---

_Music Landing Page Design System v2.0 · Senior Frontend Reference_
