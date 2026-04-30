# JavaScript Patterns

## Contents

- Required interactions (always include)
- Animated counter
- FAQ accordion (JS fallback)
- Form handling
- Analytics event hooks
- Scroll-triggered entrance animations

---

## Required interactions (always include)

Paste this block at the bottom of every landing page `<script>` tag.

```js
// ── Smooth scroll ──────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── Sticky nav + active section highlight ─────────────────────────────────
const nav = document.querySelector("nav");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const link = document.querySelector(
          `nav a[href="#${entry.target.id}"]`,
        );
        if (link) link.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((s) => observer.observe(s));

window.addEventListener(
  "scroll",
  () => {
    nav?.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

// ── Mobile hamburger ───────────────────────────────────────────────────────
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".nav-links");

hamburger?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});
```

Required CSS companions:

```css
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  transition:
    background var(--transition),
    box-shadow var(--transition);
}
nav.scrolled {
  background: var(--surface);
  box-shadow: var(--elevation-2);
}
nav a.active {
  color: var(--primary);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface);
    padding: 1rem;
    flex-direction: column;
  }
  .nav-links.open {
    display: flex;
  }
}
```

---

## Animated counter

Triggers once when the stat section enters the viewport.

```js
const counters = document.querySelectorAll(".stat-number");

const countUp = (el, target, duration = 1800) => {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        countUp(el, parseInt(el.dataset.target, 10));
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

counters.forEach((c) => statsObserver.observe(c));
```

Required HTML attribute: `data-target="10000"` on `.stat-number` elements.

---

## FAQ accordion (JS fallback)

Only use this when `<details>` is insufficient (e.g., animated height).
The CSS-only `<details>` approach in `sections.md` is preferred.

```js
document.querySelectorAll(".faq-item").forEach((item) => {
  const summary = item.querySelector(".faq-summary");
  const body = item.querySelector(".faq-body");

  summary?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    body.style.maxHeight = isOpen ? body.scrollHeight + "px" : "0";
    summary.setAttribute("aria-expanded", isOpen);
  });
});
```

```css
.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.faq-item.open .faq-summary::after {
  content: "−";
}
```

---

## Form handling

### Email capture (newsletter / waitlist)

```html
<form class="email-form" id="waitlistForm" novalidate>
  <input
    type="email"
    name="email"
    placeholder="Enter your email"
    required
    aria-label="Email address"
  />
  <button type="submit" class="btn btn-primary">Join waitlist</button>
  <p class="form-message" aria-live="polite"></p>
</form>
```

```js
const form = document.getElementById("waitlistForm");
const message = form?.querySelector(".form-message");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRe.test(email)) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "#FF6584";
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Joining…";

  try {
    // Replace with real endpoint or service
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    message.textContent = "🎉 You're on the list! We'll be in touch.";
    message.style.color = "#6C63FF";
    form.reset();
  } catch {
    message.textContent = "Something went wrong. Please try again.";
    message.style.color = "#FF6584";
  } finally {
    btn.disabled = false;
    btn.textContent = "Join waitlist";
  }
});
```

If the user has no backend, replace the `fetch` block with a redirect to a
Typeform / Tally / Mailchimp embed URL.

---

## Analytics event hooks

Attach to CTA clicks for easy Google Analytics / Plausible tracking.

```js
// Google Analytics 4 (gtag)
const trackCTA = (label) => {
  if (typeof gtag !== "undefined") {
    gtag("event", "cta_click", { event_label: label });
  }
  // Plausible
  if (typeof plausible !== "undefined") {
    plausible("CTA Click", { props: { label } });
  }
};

document.querySelectorAll("[data-track]").forEach((el) => {
  el.addEventListener("click", () => trackCTA(el.dataset.track));
});
```

Usage: add `data-track="hero-cta"` to any button or link.

---

## Scroll-triggered entrance animations

CSS-only — no JS library needed.

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}
```

```js
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
```

Add `class="reveal"` to any section, card, or element to animate it in.
Stagger siblings with `transition-delay: calc(var(--i, 0) * 80ms)` and
set `--i` via inline style on each child.
