const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", link.getAttribute("href"));
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeId = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === activeId);
      });
    });
  },
  {
    rootMargin: "-35% 0px -50% 0px",
    threshold: 0.1
  }
);

sections.forEach((section) => observer.observe(section));

const introduction = document.querySelector(".introduction");
const introCopy = document.querySelector(".intro-copy");

if (introduction && introCopy) {
  const setIntroShift = (clientY) => {
    const rect = introduction.getBoundingClientRect();
    const relativeY = (clientY - rect.top) / rect.height;
    const clampedY = Math.max(0, Math.min(1, relativeY));
    const shift = (clampedY - 0.5) * 18;
    introCopy.style.setProperty("--intro-shift", `${shift}px`);
  };

  const resetIntroShift = () => {
    introCopy.style.setProperty("--intro-shift", "0px");
  };

  introduction.addEventListener("pointermove", (event) => {
    setIntroShift(event.clientY);
  });

  introduction.addEventListener("pointerleave", resetIntroShift);

  introduction.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      setIntroShift(touch.clientY);
    },
    { passive: true }
  );

  introduction.addEventListener("touchend", resetIntroShift, { passive: true });
}
