(async () => {
  const loadPartial = async (id, path) => {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  };

  await Promise.all([
    loadPartial("header-placeholder", "partials/header.html"),
    loadPartial("footer-placeholder", "partials/footer.html"),
  ]);

  document.dispatchEvent(new Event("partials:loaded"));
})();
