// エントリーフォーム: 生年月日のセレクトを生成する
(() => {
  const addOptions = (selectEl, values) => {
    if (!selectEl) return;
    const frag = document.createDocumentFragment();
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = String(v);
      opt.textContent = String(v);
      frag.appendChild(opt);
    });
    selectEl.appendChild(frag);
  };

  const range = (start, end, step) => {
    const arr = [];
    if (step > 0) {
      for (let i = start; i <= end; i += step) arr.push(i);
    } else {
      for (let i = start; i >= end; i += step) arr.push(i);
    }
    return arr;
  };

  const thisYear = new Date().getFullYear();
  // 年は新しい順（直近〜1950年）
  addOptions(document.querySelector("#birth-year"), range(thisYear, 1950, -1));
  addOptions(document.querySelector("#birth-month"), range(1, 12, 1));
  addOptions(document.querySelector("#birth-day"), range(1, 31, 1));
})();
