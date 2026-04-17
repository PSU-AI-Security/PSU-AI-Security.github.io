(function () {
  const toggle = document.getElementById("site-nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const iconOpen = toggle.querySelector(".site-nav-icon-open");
  const iconClose = toggle.querySelector(".site-nav-icon-close");

  function isDesktop() {
    return window.matchMedia("(min-width: 768px)").matches;
  }

  function setMenuOpen(open) {
    if (open) {
      nav.classList.remove("hidden");
      nav.classList.add("flex");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      iconOpen?.classList.add("hidden");
      iconClose?.classList.remove("hidden");
    } else {
      nav.classList.add("hidden");
      nav.classList.remove("flex");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      iconOpen?.classList.remove("hidden");
      iconClose?.classList.add("hidden");
    }
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setMenuOpen(open);
  });

  document.addEventListener("click", function (e) {
    if (isDesktop()) return;
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    const el = e.target;
    if (nav.contains(el) || toggle.contains(el)) return;
    setMenuOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenuOpen(false);
  });

  window.addEventListener("resize", function () {
    if (isDesktop()) setMenuOpen(false);
  });
})();
