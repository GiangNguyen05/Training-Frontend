# Design Tokens

## Contents

- Default dark palette (canonical)
- Light mode variant
- Custom brand overrides
- Typography scale
- Spacing scale
- Elevation / shadow levels

---

## Default dark palette (canonical)

Declared on `:root` — always start here.

```css
:root {
  /* Brand */
  --primary: #6c63ff;
  --primary-dark: #4b44cc;
  --primary-light: #8f89ff;
  --accent: #ff6584;

  /* Surfaces */
  --surface: #0f0f1a;
  --surface-2: #1a1a2e;
  --surface-3: #22223d;
  --border: rgba(255, 255, 255, 0.07);

  /* Text */
  --text: #f0f0ff;
  --text-muted: #9090b0;
  --text-dim: #6060a0;

  /* Utility */
  --radius: 12px;
  --radius-sm: 6px;
  --radius-lg: 20px;
  --shadow: 0 4px 24px rgba(108, 99, 255, 0.15);
  --shadow-lg: 0 12px 48px rgba(108, 99, 255, 0.25);
  --transition: 0.2s ease;
}
```

---

## Light mode variant

Add inside a `@media (prefers-color-scheme: light)` block OR via a
`.light` class on `<body>` when the user asks for a light-mode toggle.

```css
@media (prefers-color-scheme: light) {
  :root {
    --surface: #ffffff;
    --surface-2: #f4f4fd;
    --surface-3: #e8e8f5;
    --border: rgba(0, 0, 0, 0.08);
    --text: #1a1a2e;
    --text-muted: #5a5a80;
    --text-dim: #9090b0;
    --shadow: 0 4px 24px rgba(108, 99, 255, 0.1);
  }
}
```

---

## Custom brand colour overrides

When the user provides a hex colour, derive the full palette:

| User provides | Replace token | Derive `--primary-dark`                     |
| ------------- | ------------- | ------------------------------------------- |
| `#RRGGBB`     | `--primary`   | darken 15% (use `color-mix` or manual calc) |

Quick derivation formula (manual):

- `--primary-dark`: reduce each RGB channel by ~15%
- `--primary-light`: increase lightness ~10% (HSL)

Example override for a teal brand (`#00B4D8`):

```css
:root {
  --primary: #00b4d8;
  --primary-dark: #0090ad;
  --primary-light: #33c7e5;
  --shadow: 0 4px 24px rgba(0, 180, 216, 0.18);
}
```

---

## Typography scale

Use a fluid type scale. Do NOT set a fixed pixel size on `body` — set `font-size: 100%` and use `rem` everywhere.

```css
:root {
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 2rem; /* 32px */
  --text-4xl: 2.5rem; /* 40px */
  --text-5xl: 3.5rem; /* 56px */
  --text-hero: clamp(2.5rem, 6vw, 4.5rem); /* responsive hero heading */
}

body {
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 100%;
  line-height: 1.6;
  color: var(--text);
  background: var(--surface);
}

h1 {
  font-size: var(--text-hero);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
}
h2 {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.01em;
}
h3 {
  font-size: var(--text-xl);
  font-weight: 600;
}
p {
  font-size: var(--text-lg);
  color: var(--text-muted);
}
```

Font loading (use `<link>` in `<head>`, not `@import`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

---

## Spacing scale

```css
:root {
  --space-1: 0.25rem; /* 4px  */
  --space-2: 0.5rem; /* 8px  */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-24: 6rem; /* 96px */
  --space-32: 8rem; /* 128px */
}
```

Section vertical padding convention:

- **Mobile:** `padding: var(--space-16) 0`
- **Desktop:** `padding: var(--space-24) 0`

---

## Elevation / shadow levels

```css
:root {
  --elevation-1: 0 1px 4px rgba(0, 0, 0, 0.12);
  --elevation-2: 0 4px 16px rgba(0, 0, 0, 0.16);
  --elevation-3: var(--shadow); /* branded, medium */
  --elevation-4: var(--shadow-lg); /* branded, large */
}
```

Use `--elevation-1` for cards at rest, `--elevation-3` on hover.
