(function () {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // Smooth scroll for internal anchors
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
  
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
  
      const target = document.querySelector(href);
      if (!target) return;
  
      e.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const alignEl =
        target.classList && target.classList.contains("section")
          ? target.querySelector(".section-head") || target
          : target.querySelector(".section-head") ||
            target.querySelector("h1") ||
            target.querySelector("h2") ||
            target.querySelector("h3") ||
            target;

      const targetTop =
        alignEl.getBoundingClientRect().top + window.scrollY - headerHeight + 10;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
      history.replaceState(null, "", href);
    });
  
    // Dark mode toggle (localStorage)
    const darkBtn = document.getElementById("darkModeBtn");
    const root = document.documentElement;
  
    function setTheme(theme) {
      if (theme === "light") root.setAttribute("data-theme", "light");
      else root.removeAttribute("data-theme");
      try {
        localStorage.setItem("theme", theme);
      } catch (_) {}
    }
  
    function getPreferredTheme() {
      try {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
      } catch (_) {}
  
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    }
  
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
  
    if (darkBtn) {
      darkBtn.addEventListener("click", () => {
        const isLight = root.getAttribute("data-theme") === "light";
        setTheme(isLight ? "dark" : "light");
      });
    }
  
    // FAQ accordion
    const faq = document.querySelector("[data-accordion]");
    if (faq) {
      faq.addEventListener("click", (e) => {
        const q = e.target.closest(".faq-q");
        if (!q) return;
  
        const item = q.closest(".faq-item");
        const a = item.querySelector(".faq-a");
        const expanded = q.getAttribute("aria-expanded") === "true";
  
        // Close other items (optional UX)
        faq.querySelectorAll(".faq-q").forEach((btn) => {
          if (btn !== q) btn.setAttribute("aria-expanded", "false");
        });
        faq.querySelectorAll(".faq-a").forEach((panel) => {
          if (panel !== a) panel.hidden = true;
        });
  
        q.setAttribute("aria-expanded", String(!expanded));
        a.hidden = expanded;
  
        const icon = q.querySelector(".faq-icon");
        if (icon) icon.textContent = expanded ? "+" : "−";
      });
    }
  
    // Lead form (demo validation)
    const form = document.getElementById("leadForm");
    const note = document.getElementById("formNote");
  
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = form.elements.email.value.trim();
  
        if (!email) {
          note.textContent = "Vui lòng nhập email.";
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          note.textContent = "Email chưa đúng định dạng.";
          return;
        }
  
        note.textContent =
          "Cảm ơn! (Demo) Bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm.";
        form.reset();
      });
    }
  })();
  