function initAfterPartials() {
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

  // 【ルール】アニメーションは原則「スクロールして要素に到達してから」開始する。
  // そのため IntersectionObserver の rootMargin 下端をマイナスにし、要素がビュー
  // ポートの下から十分に入ってから（＝実際にスクロールで到達してから）発火させる。
  const REVEAL_ROOT_MARGIN = "0px 0px -12% 0px";

  // スクロール時のふわっと表示: 指定セクションが画面に入ったら is-revealed を付ける
  const revealTargets = [
    { section: ".message", blobs: ".message__blob" },
    { section: ".about", blobs: null },
    { section: ".environment", blobs: null },
    { section: ".environment__pickup", blobs: null },
    { section: ".interview", blobs: null },
    { section: ".recruit", blobs: null },
    // about.html
    { section: ".about-lead", blobs: null },
    { section: ".greeting", blobs: null },
    { section: ".strength", blobs: null },
    { section: ".strength-item--01", blobs: null },
    { section: ".strength-item--02", blobs: null },
    { section: ".outlook", blobs: null },
    { section: ".io-card--input", blobs: null },
    { section: ".io-card--output", blobs: null },
    { section: ".summary", blobs: null },
    { section: ".company__block", blobs: null },
    // environment.html
    { section: ".advantage", blobs: null },
    { section: ".adv-item", blobs: null },
    { section: ".benefit", blobs: null },
    { section: ".evaluation", blobs: null },
    { section: ".eval-wide", blobs: null },
    { section: ".eval-card", blobs: null },
    // requirements.html
    { section: ".req-lead", blobs: null },
    { section: ".recruit-anchor", blobs: null },
    { section: ".job-card", blobs: null },
    // entry.html
    { section: ".entry", blobs: null },
    // privacy.html
    { section: ".policy", blobs: null },
  ];

  if ("IntersectionObserver" in window) {
    revealTargets.forEach(({ section, blobs }) => {
      const secs = document.querySelectorAll(section);
      if (!secs.length) return;
      const blobEls = blobs ? document.querySelectorAll(blobs) : null;
      secs.forEach((sec) => {
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
          { threshold: 0.1, rootMargin: REVEAL_ROOT_MARGIN }
        );
        io.observe(sec);
      });
    });
  } else {
    revealTargets.forEach(({ section, blobs }) => {
      document.querySelectorAll(section).forEach((sec) => sec.classList.add("is-revealed"));
      if (blobs) document.querySelectorAll(blobs).forEach((b) => b.classList.add("is-revealed"));
    });
  }

  // サイト全体: すべての .blob（きとみの丸）をスクロール到達でふわっと表示。
  // 同時に画面へ入った丸は、上にあるものから順番に（段階ディレイで）表示する。
  const allBlobs = document.querySelectorAll(".blob");
  if ("IntersectionObserver" in window) {
    const blobIO = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting);
        if (!shown.length) return;
        shown.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        shown.forEach((entry, i) => {
          entry.target.style.transitionDelay = (0.4 + i * 0.15).toFixed(2) + "s";
          entry.target.classList.add("is-revealed");
          blobIO.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: REVEAL_ROOT_MARGIN }
    );
    allBlobs.forEach((b) => blobIO.observe(b));
  } else {
    allBlobs.forEach((b) => b.classList.add("is-revealed"));
  }
}

// partials:loaded が main.js のリスナー登録より先に発火していても確実に初期化する
if (window.__partialsLoaded) {
  initAfterPartials();
} else {
  document.addEventListener("partials:loaded", initAfterPartials);
}
