---
name: building-landing-pages
description: >
  Builds high-converting, production-ready landing pages using HTML, CSS, and
  vanilla JavaScript. Use when the user asks to create a landing page, hero
  section, product page, waitlist page, SaaS homepage, or any single-page
  marketing website. Also triggers when the user mentions conversion
  optimization, CTA sections, above-the-fold design, or responsive web layout
  for marketing purposes.
---

# Building Landing Pages

## Quick start

Always produce a single self-contained `.html` file unless the user explicitly
requests separate files.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <style>/* CSS here */</style>
</head>
<body>
  <!-- Sections here -->
  <script>/* JS here */</script>
</body>
</html>
```

## Section anatomy

Every landing page MUST include these sections in this order:

1. **Nav** — logo + CTA button (sticky on scroll)
2. **Hero** — headline, sub-headline, primary CTA, hero visual
3. **Social proof** — logos, testimonials, or stats
4. **Features / Benefits** — 3-column grid, icon + title + description
5. **CTA block** — full-width contrast section with one action
6. **Footer** — links, copyright

For advanced layouts (pricing, FAQ, comparison table) see
[reference/sections.md](reference/sections.md).

## Design system

| Token | Value |
|-------|-------|
| `--primary` | `#6C63FF` |
| `--primary-dark` | `#4B44CC` |
| `--surface` | `#0F0F1A` |
| `--surface-2` | `#1A1A2E` |
| `--text` | `#F0F0FF` |
| `--text-muted` | `#9090B0` |
| `--radius` | `12px` |
| `--shadow` | `0 4px 24px rgba(108,99,255,0.15)` |

Always declare these as CSS custom properties on `:root`. Never hardcode hex
values inline — use the token names.

For light-mode variants and brand colour overrides see
[reference/design-tokens.md](reference/design-tokens.md).

## CSS rules

- Mobile-first: write base styles for `< 768px`, override at `@media (min-width: 768px)` and `(min-width: 1200px)`
- Use CSS Grid for two-column layouts, Flexbox for one-axis alignment
- Default container: `max-width: 1140px; margin: 0 auto; padding: 0 1.5rem`
- No external CSS frameworks unless user asks. No `@import` from CDNs

## JavaScript rules

- Vanilla JS only — no jQuery, no Vue, no React in the output file
- All scripts go in a single `<script>` tag before `</body>`
- Required interactions (always include):
  - Smooth scroll for anchor links
  - Active nav highlight on scroll (IntersectionObserver)
  - Mobile hamburger toggle
- Optional (include only when the section exists):
  - Animated counter on stat numbers (IntersectionObserver + `requestAnimationFrame`)
  - FAQ accordion
  - Testimonial carousel (CSS-only preferred; JS only if > 3 items)

For form handling, analytics hooks, and animation patterns see
[reference/javascript.md](reference/javascript.md).

## Workflow

Copy this checklist and mark items as you build:

```
Landing Page Build:
- [ ] 1. Clarify: brand name, primary CTA verb, sections needed
- [ ] 2. Write HTML skeleton (all sections, semantic tags)
- [ ] 3. Apply design tokens to :root
- [ ] 4. Style sections (mobile-first)
- [ ] 5. Add responsive breakpoints
- [ ] 6. Add required JS interactions
- [ ] 7. Self-review checklist (below)
- [ ] 8. Deliver single .html file
```

## Self-review before delivery

Run through this before outputting the final file:

- [ ] `<title>` and `<meta name="description">` are set
- [ ] All images use descriptive `alt` text (or `alt=""` if decorative)
- [ ] Primary CTA appears in both nav and hero
- [ ] No hardcoded hex values — only CSS custom properties
- [ ] Page renders without horizontal scroll at 375px viewport
- [ ] No external dependencies that could 404

## Output format

Always deliver as a file attachment (not a code block in chat) unless the
user says otherwise. File name: `landing-page.html` or `{brand-slug}-landing.html`.

---

**Reference files** (read only when relevant):

| File | When to read |
|------|-------------|
| [reference/sections.md](reference/sections.md) | Pricing, FAQ, comparison, or testimonial sections |
| [reference/design-tokens.md](reference/design-tokens.md) | Light mode, custom brand palette, typography scale |
| [reference/javascript.md](reference/javascript.md) | Forms, analytics, advanced animations |
| [reference/seo.md](reference/seo.md) | OG tags, structured data, performance tips |
