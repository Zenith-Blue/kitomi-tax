(() => {
  const sliders = document.querySelectorAll("[data-slider]");
  if (sliders.length === 0) return;

  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const items = slider.querySelectorAll("[data-slider-item]");
    const prevBtn = slider.querySelector("[data-slider-prev]");
    const nextBtn = slider.querySelector("[data-slider-next]");
    const dots = slider.querySelectorAll("[data-slider-dot]");

    if (!track || items.length === 0) return;

    const total = items.length;
    let current = 0;

    // data-slider-max: その幅以下のみスライダー動作（超えるとグリッド表示）
    const maxAttr = slider.getAttribute("data-slider-max");
    const isActive = () =>
      !maxAttr || window.matchMedia(`(max-width: ${maxAttr}px)`).matches;

    // 表示枚数に応じた最大インデックス（端で余白が出ないように）
    const maxIndex = () => {
      const viewW = slider.getBoundingClientRect().width;
      const itemW = items[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const per = Math.max(1, Math.round((viewW + gap) / (itemW + gap)));
      return Math.max(0, total - per);
    };

    const update = () => {
      if (!isActive()) {
        // スライダー無効時は transform をリセット（グリッドを崩さない）
        track.style.transform = "";
        current = 0;
        return;
      }
      if (current > maxIndex()) current = maxIndex();
      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 30;
      const offset = current * (itemWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
      });
    };

    const next = () => {
      if (!isActive()) return;
      if (current >= maxIndex()) return;
      current++;
      update();
    };
    const prev = () => {
      if (!isActive()) return;
      if (current <= 0) return;
      current--;
      update();
    };

    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        current = Math.min(i, maxIndex());
        update();
      });
    });

    // Swipe / drag navigation
    const SWIPE_THRESHOLD = 50;
    const DRAG_THRESHOLD = 6;
    let startX = 0;
    let startY = 0;
    let active = false;
    let dragged = false;

    const begin = (x, y) => {
      startX = x;
      startY = y;
      active = true;
      dragged = false;
    };

    const move = (x, y) => {
      if (!active) return;
      if (Math.abs(x - startX) > DRAG_THRESHOLD) dragged = true;
    };

    const end = (x, y) => {
      if (!active) return;
      active = false;
      const dx = x - startX;
      const dy = y - startY;
      if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        // 右スワイプ＝前へ / 左スワイプ＝次へ（自然な方向）
        if (dx > 0) prev();
        else next();
      }
    };

    track.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      begin(t.clientX, t.clientY);
    }, { passive: true });
    track.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      move(t.clientX, t.clientY);
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const t = e.changedTouches[0];
      end(t.clientX, t.clientY);
    });

    track.addEventListener("mousedown", (e) => {
      begin(e.clientX, e.clientY);
    });
    track.addEventListener("mousemove", (e) => {
      move(e.clientX, e.clientY);
    });
    document.addEventListener("mouseup", (e) => {
      end(e.clientX, e.clientY);
    });

    // Prevent child click (e.g. popup-open) if user actually dragged
    track.addEventListener("click", (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    }, true);

    // Horizontal wheel (trackpad/mouse horizontal scroll) → advance slide
    let wheelLock = false;
    track.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheelLock) return;
      if (Math.abs(e.deltaX) < 10) return;
      wheelLock = true;
      if (e.deltaX > 0) next();
      else prev();
      setTimeout(() => { wheelLock = false; }, 500);
    }, { passive: false });

    window.addEventListener("resize", update);
    update();
  });
})();
