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

    const update = () => {
      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 30;
      const offset = current * (itemWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
      });
    };

    prevBtn?.addEventListener("click", () => {
      current = (current - 1 + total) % total;
      update();
    });

    nextBtn?.addEventListener("click", () => {
      current = (current + 1) % total;
      update();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        current = i;
        update();
      });
    });

    window.addEventListener("resize", update);
    update();
  });
})();
