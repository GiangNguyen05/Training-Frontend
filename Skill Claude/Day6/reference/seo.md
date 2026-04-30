# SEO & Performance

## Contents

- Essential meta tags
- Open Graph / Twitter Card
- Structured data (JSON-LD)
- Performance checklist
- Core Web Vitals tips

---

## Essential meta tags

Place inside `<head>` before any scripts.

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta
  name="description"
  content="One sentence. 150–160 chars. Primary keyword near the start."
/>
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://example.com/" />
<title>Primary Keyword – Brand Name</title>
```

Title formula: `[Primary keyword] – [Brand]` (50–60 chars max).

---

## Open Graph / Twitter Card

Required for good social previews. Use a 1200 × 630px image.

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/" />
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Same as meta description." />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Same as meta description." />
<meta name="twitter:image" content="https://example.com/og-image.jpg" />
```

---

## Structured data (JSON-LD)

Add in a `<script type="application/ld+json">` block in `<head>`.

### SaaS / Software product

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Product Name",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Short description matching meta description.",
  "url": "https://example.com"
}
```

### Organisation / startup

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/handle",
    "https://linkedin.com/company/handle"
  ]
}
```

---

## Performance checklist

Apply these in the HTML/CSS output:

- [ ] Fonts loaded with `rel="preconnect"` and `display=swap`
- [ ] Hero image uses `<img loading="eager" fetchpriority="high" />`; all below-fold images use `loading="lazy"`
- [ ] No render-blocking scripts — all `<script>` tags before `</body>` or with `defer`
- [ ] CSS inlined in `<style>` (no external stylesheet round-trip)
- [ ] Unused CSS removed (no utility class frameworks unless user requests)
- [ ] `will-change: transform` only on elements that are actively animating

---

## Core Web Vitals tips

| Metric                          | Target   | Common fix                                                  |
| ------------------------------- | -------- | ----------------------------------------------------------- |
| LCP (Largest Contentful Paint)  | < 2.5 s  | Preload hero image; inline critical CSS                     |
| CLS (Cumulative Layout Shift)   | < 0.1    | Set explicit `width`/`height` on all images and videos      |
| INP (Interaction to Next Paint) | < 200 ms | Avoid long tasks in `click` handlers; defer non-critical JS |

For the single-file output format, LCP and CLS are the most impactful:

```html
<!-- Preload hero image -->
<link rel="preload" as="image" href="hero.webp" />

<!-- Always set explicit dimensions -->
<img
  src="hero.webp"
  width="600"
  height="400"
  alt="Hero visual"
  loading="eager"
  fetchpriority="high"
/>
```
