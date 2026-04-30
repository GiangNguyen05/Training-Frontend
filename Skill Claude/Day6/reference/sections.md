# Section Templates

## Contents

- Pricing section
- FAQ accordion
- Comparison table
- Testimonial carousel
- Stats / social proof bar
- Video embed hero

---

## Pricing section

Use a 3-column card layout. Highlight the recommended plan with
`transform: scale(1.04)` and a `--primary` border.

```html
<section id="pricing" class="pricing">
  <div class="container">
    <h2>Simple, transparent pricing</h2>
    <div class="pricing-grid">
      <!-- Starter -->
      <div class="pricing-card">
        <h3>Starter</h3>
        <p class="price">$0<span>/mo</span></p>
        <ul class="features-list">
          <li>✓ Feature one</li>
          <li>✓ Feature two</li>
          <li>✗ Feature three</li>
        </ul>
        <a href="#" class="btn btn-outline">Get started</a>
      </div>

      <!-- Pro — recommended -->
      <div class="pricing-card pricing-card--featured">
        <span class="badge">Most popular</span>
        <h3>Pro</h3>
        <p class="price">$29<span>/mo</span></p>
        <ul class="features-list">
          <li>✓ Everything in Starter</li>
          <li>✓ Feature three</li>
          <li>✓ Feature four</li>
        </ul>
        <a href="#" class="btn btn-primary">Start free trial</a>
      </div>

      <!-- Enterprise -->
      <div class="pricing-card">
        <h3>Enterprise</h3>
        <p class="price">Custom</p>
        <ul class="features-list">
          <li>✓ Everything in Pro</li>
          <li>✓ SLA & dedicated support</li>
          <li>✓ Custom integrations</li>
        </ul>
        <a href="#" class="btn btn-outline">Contact sales</a>
      </div>
    </div>
  </div>
</section>
```

CSS notes:

```css
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.pricing-card--featured {
  transform: scale(1.04);
  border: 2px solid var(--primary);
}
@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## FAQ accordion

CSS-only approach using `<details>` / `<summary>` — no JS required.

```html
<section id="faq" class="faq">
  <div class="container">
    <h2>Frequently asked questions</h2>
    <div class="faq-list">
      <details class="faq-item">
        <summary>Question one?</summary>
        <p>Answer text goes here.</p>
      </details>
      <details class="faq-item">
        <summary>Question two?</summary>
        <p>Answer text goes here.</p>
      </details>
    </div>
  </div>
</section>
```

```css
.faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 0;
}
.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}
.faq-item summary::after {
  content: "+";
  float: right;
}
.faq-item[open] summary::after {
  content: "−";
}
.faq-item p {
  margin-top: 0.75rem;
  color: var(--text-muted);
}
```

---

## Comparison table

Use `<table>` with a sticky first column for long tables.

```html
<section class="comparison">
  <div class="container">
    <h2>How we compare</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th class="us">Our product</th>
            <th>Competitor A</th>
            <th>Competitor B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Feature name</td>
            <td class="us">✓</td>
            <td>✓</td>
            <td>✗</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

```css
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.875rem 1.25rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
td:first-child {
  text-align: left;
  font-weight: 500;
}
th.us,
td.us {
  background: rgba(108, 99, 255, 0.12);
  color: var(--primary);
}
```

---

## Testimonial carousel

Use CSS scroll-snap for a smooth carousel with no JS dependencies.

```html
<section class="testimonials">
  <div class="container">
    <h2>What our customers say</h2>
    <div class="carousel" role="list">
      <div class="testimonial-card" role="listitem">
        <p>"Quote text goes here. Keep it under 200 characters."</p>
        <footer>
          <img src="avatar.jpg" alt="Customer name" width="40" height="40" />
          <div>
            <strong>Customer Name</strong>
            <span>Title, Company</span>
          </div>
        </footer>
      </div>
      <!-- repeat cards -->
    </div>
  </div>
</section>
```

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1.5rem;
  padding-bottom: 1rem;
  scrollbar-width: none;
}
.carousel::-webkit-scrollbar {
  display: none;
}
.testimonial-card {
  min-width: 320px;
  scroll-snap-align: start;
  background: var(--surface-2);
  border-radius: var(--radius);
  padding: 1.5rem;
}
.testimonial-card footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}
.testimonial-card footer img {
  border-radius: 50%;
}
```

---

## Stats / social proof bar

Full-width band of animated counters.

```html
<section class="stats">
  <div class="container stats-grid">
    <div class="stat">
      <span class="stat-number" data-target="10000">0</span><span>+</span>
      <p>Users</p>
    </div>
    <div class="stat">
      <span class="stat-number" data-target="99">0</span><span>%</span>
      <p>Uptime</p>
    </div>
    <div class="stat">
      <span class="stat-number" data-target="48">0</span><span>h</span>
      <p>Setup time</p>
    </div>
  </div>
</section>
```

JS animation: see [javascript.md](javascript.md) — "Animated counter" section.

---

## Video embed hero

Replace a static image with a muted autoplay background video.

```html
<div class="hero-media">
  <video autoplay muted loop playsinline poster="poster.jpg">
    <source src="hero.mp4" type="video/mp4" />
  </video>
</div>
```

```css
.hero-media {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
}
.hero-media video {
  width: 100%;
  display: block;
}
```

Always include a `poster` image — it shows before the video loads and on
devices where autoplay is blocked.
