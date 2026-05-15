document.addEventListener("partials:loaded", () => {
  const pagetop = document.querySelector(".footer__pagetop");
  if (pagetop) {
    pagetop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const sideNav = document.querySelector(".side-nav");
  const overlay = document.querySelector(".side-nav__overlay");
  const body = document.body;

  const closeMenu = () => {
    hamburger?.classList.remove("is-open");
    sideNav?.classList.remove("is-open");
    overlay?.classList.remove("is-open");
    body.classList.remove("is-menu-open");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "メニューを開く");
  };

  const openMenu = () => {
    hamburger?.classList.add("is-open");
    sideNav?.classList.add("is-open");
    overlay?.classList.add("is-open");
    body.classList.add("is-menu-open");
    hamburger?.setAttribute("aria-expanded", "true");
    hamburger?.setAttribute("aria-label", "メニューを閉じる");
  };

  hamburger?.addEventListener("click", () => {
    if (hamburger.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay?.addEventListener("click", closeMenu);

  // Close menu when clicking on a nav link
  sideNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger?.classList.contains("is-open")) {
      closeMenu();
    }
  });

  // Close menu when resizing to PC
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024 && hamburger?.classList.contains("is-open")) {
        closeMenu();
      }
    }, 100);
  });
});
