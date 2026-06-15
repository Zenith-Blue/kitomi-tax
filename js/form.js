// 応募フォーム送信（EmailJS REST API / ライブラリ不要）
// 送信時に「応募者への自動返信」と「管理者2アドレスへの通知」を送る。
// ※宛先メールアドレスはコードに直書きせず、EmailJS のテンプレート側に設定する。
(() => {
  // ===== EmailJS 設定（ダッシュボードで取得した値に置き換える）=====
  // Public Key は公開して問題ない値（クライアント用）。
  const PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const SERVICE_ID = "YOUR_SERVICE_ID";
  // 管理者通知用テンプレート（To Email にカンマ区切りで管理者2アドレスを設定）
  const TEMPLATE_ADMIN = "YOUR_ADMIN_TEMPLATE_ID";
  // 応募者への自動返信用テンプレート（To Email に {{email}} を設定）
  const TEMPLATE_AUTOREPLY = "YOUR_AUTOREPLY_TEMPLATE_ID";
  // ============================================================

  const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

  const form = document.querySelector(".entry-form");
  if (!form) return;

  const submitBtn = form.querySelector(".entry-form__submit");
  const statusEl = form.querySelector(".entry-form__status");

  const showStatus = (message, type) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.type = type;
    statusEl.hidden = false;
  };

  const send = (templateId, params) =>
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: templateId,
        user_id: PUBLIC_KEY,
        template_params: params,
      }),
    }).then((res) => {
      if (!res.ok) throw new Error("EmailJS error: " + res.status);
      return res;
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // ネイティブの必須チェック（未入力・同意なしはここで止まる）
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const params = {
      name_kanji: data.get("name_kanji") || "",
      name_kana: data.get("name_kana") || "",
      gender: data.get("gender") || "",
      birthday:
        (data.get("birth_year") || "") +
        "年" +
        (data.get("birth_month") || "") +
        "月" +
        (data.get("birth_day") || "") +
        "日",
      email: data.get("email") || "",
      tel: data.get("tel") || "（未入力）",
      education: data.get("education") || "（未入力）",
      motivation: data.get("motivation") || "",
    };

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中...";
    showStatus("送信しています…", "loading");

    try {
      // 管理者2アドレスへ通知 → 応募者へ自動返信 の順で送信
      await send(TEMPLATE_ADMIN, params);
      await send(TEMPLATE_AUTOREPLY, params);
      form.reset();
      showStatus(
        "ご応募ありがとうございます。確認メールをお送りしました。担当者より近日中にご連絡いたします。",
        "success"
      );
    } catch (err) {
      showStatus(
        "送信中にエラーが発生しました。お手数ですがお電話（049-277-5541）でお問い合わせください。",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();
