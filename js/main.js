document.addEventListener("partials:loaded", () => {
  const pagetop = document.querySelector(".footer__pagetop");
  if (pagetop) {
    pagetop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
