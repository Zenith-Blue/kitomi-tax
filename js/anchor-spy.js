(() => {
  const links = document.querySelectorAll(".recruit-anchor__link");
  if (links.length === 0) return;

  const sections = [];
  links.forEach((link) => {
    const id = link.getAttribute("href")?.replace(/^#/, "");
    if (!id) return;
    const target = document.getElementById(id);
    if (target) sections.push({ link, target });
  });

  if (sections.length === 0) return;

  const setActive = (activeLink) => {
    links.forEach((l) => l.classList.toggle("is-active", l === activeLink));
  };

  const ACTIVATE_OFFSET = 120;

  const updateActive = () => {
    let activeLink = sections[0].link;
    for (const { link, target } of sections) {
      if (target.getBoundingClientRect().top <= ACTIVATE_OFFSET) {
        activeLink = link;
      } else {
        break;
      }
    }
    setActive(activeLink);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
    ticking = true;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateActive();
})();
