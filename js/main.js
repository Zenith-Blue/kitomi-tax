document.addEventListener("partials:loaded", () => {
  const pagetop = document.querySelector(".footer__pagetop");
  if (pagetop) {
    pagetop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Side-nav indicator: 現在ページに対応する .side-nav__link に位置を合わせる
  const indicator = document.querySelector(".side-nav__indicator");
  const navLinks = document.querySelectorAll(".side-nav__link");
  if (indicator && navLinks.length > 0) {
    const path = location.pathname.split("/").pop() || "index.html";
    const currentPage = path === "" ? "index.html" : path;
    let activeLink = null;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentPage) activeLink = link;
    });

    if (!activeLink) {
      indicator.style.display = "none";
    } else {
      const positionIndicator = () => {
        const rect = activeLink.getBoundingClientRect();
        const top = rect.top + (rect.height - indicator.offsetHeight) / 2;
        indicator.style.top = `${top}px`;
        indicator.classList.add("is-ready");
      };
      positionIndicator();
      window.addEventListener("resize", positionIndicator);
    }
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

  // スクロール時のふわっと表示: 指定セクションが画面に入ったら is-revealed を付ける
  const revealTargets = [
    { section: ".message", blobs: ".message__blob" },
    { section: ".about", blobs: ".about__blob" },
    { section: ".environment", blobs: null },
  ];

  if ("IntersectionObserver" in window) {
    revealTargets.forEach(({ section, blobs }) => {
      const sec = document.querySelector(section);
      if (!sec) return;
      const blobEls = blobs ? document.querySelectorAll(blobs) : null;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              sec.classList.add("is-revealed");
              if (blobEls) blobEls.forEach((b) => b.classList.add("is-revealed"));
              io.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );
      io.observe(sec);
    });
  } else {
    revealTargets.forEach(({ section, blobs }) => {
      const sec = document.querySelector(section);
      if (sec) sec.classList.add("is-revealed");
      if (blobs) document.querySelectorAll(blobs).forEach((b) => b.classList.add("is-revealed"));
    });
  }
});
