(() => {
  const body = document.body;
  let lastFocused = null;

  const openPopup = (popup) => {
    if (!popup) return;
    lastFocused = document.activeElement;
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    body.classList.add("is-popup-open");
    const closeBtn = popup.querySelector("[data-popup-close]");
    closeBtn?.focus();
  };

  const closePopup = (popup) => {
    if (!popup) return;
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    body.classList.remove("is-popup-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-popup-open]");
    if (opener) {
      e.preventDefault();
      const id = opener.getAttribute("data-popup-open");
      openPopup(document.getElementById(id));
      return;
    }

    const closer = e.target.closest("[data-popup-close]");
    if (closer) {
      e.preventDefault();
      closePopup(closer.closest(".interview-popup"));
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".interview-popup.is-open")
        .forEach((p) => closePopup(p));
    }
  });
})();
