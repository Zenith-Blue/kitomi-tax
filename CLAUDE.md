# CLAUDE.md — きとみ税理士法人 採用サイト 開発指示書

このファイルは、Claude Code がこのリポジトリで作業するときに最初に読み込む指示書です。このプロジェクトに関わるすべての開発作業は、このファイルの内容に従ってください。

## 1. プロジェクト概要

| 項目 | 内容 |
| :-- | :-- |
| プロジェクト名 | kitomi-tax（きとみ税理士法人 採用サイト） |
| クライアント | きとみ税理士法人 |
| サイトの目的 | 税理士有資格者および会計スタッフの採用強化 |
| ターゲット | 税理士資格保有者を中心とした求職者 |
| トーン | 信頼感・誠実さ・親しみやすさ。士業らしい落ち着きを保ちつつ堅すぎない |
| デザイン | Figma: <https://www.figma.com/design/UDUB99WpRvTsVylYgvhc55/260511_Kitomi?m=dev> |
| 公開先 | Xserver（`main` push で GitHub Actions が自動デプロイ） |
| 公開URL | <https://recruit.kitomi-tax.com/>（メインドメイン `kitomi-tax.com` は一旦ここへ301リダイレクト） |
| 開発体制 | 1名（自分）で作成・運用 |

## 2. 技術スタック

| 項目 | 採用技術 | 備考 |
| :-- | :-- | :-- |
| マークアップ | HTML5 | セマンティックHTMLを徹底 |
| スタイル | CSS3 | プレーンCSS。Sass/PostCSSは使わない |
| スクリプト | Vanilla JavaScript (ES6+) | フレームワーク・ライブラリは原則使わない |
| ビルドツール | なし | プレーンファイルのみ。npm/yarnは原則不要 |
| 共通パーツ | JSによる動的読み込み | header.html / footer.html を fetch で読み込み |
| 応募フォーム | WordPress 併用 | 別ドメインまたはサブディレクトリのWordPressで送受信 |
| デプロイ | Xserver（rsync over SSH） | `main` push で GitHub Actions が自動実行。詳細は [README.md](./README.md) の「ドメイン構成」を参照 |

## 3. ディレクトリ構成ルール

```
kitomi-tax/
├── *.html                  # 各ページのHTML（ルート直下）
├── partials/
│   ├── header.html         # 共通ヘッダー
│   └── footer.html         # 共通フッター
├── css/
│   ├── reset.css           # リセットCSS
│   ├── variables.css       # CSS変数（色・フォント・余白）
│   ├── common.css          # 全ページ共通スタイル
│   └── pages/              # ページ別CSS
├── js/
│   ├── include.js          # 共通パーツの動的読み込み
│   ├── main.js             # 共通機能
│   ├── accordion.js        # FAQアコーディオン
│   └── form.js             # 応募フォーム
├── images/
│   ├── common/             # 全ページ共通画像
│   └── pages/              # ページ別画像
```

**配置ルール**

- HTMLファイルはすべてルート直下に配置（サブディレクトリは作らない）
- 1ページでしか使わないCSSは `css/pages/<ページ名>.css` に置く
- 複数ページで使うスタイルは `css/common.css` にまとめる
- 画像は `images/pages/<ページ名>/` 配下に整理、ロゴなど共通は `images/common/`
- Figmaのフレーム名とCSSクラス・ID名はできる限り対応させる

## 4. 各ページHTMLの基本テンプレート

すべてのページは以下の構造に従う。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ページ名 | きとみ税理士法人 採用サイト</title>
  <meta name="description" content="ページごとの説明文">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/pages/ページ名.css">
</head>
<body>
  <!-- 共通ヘッダー（JSで挿入） -->
  <div id="header-placeholder"></div>

  <main>
    <!-- ページ固有のコンテンツ -->
  </main>

  <!-- 共通フッター（JSで挿入） -->
  <div id="footer-placeholder"></div>

  <script src="js/include.js"></script>
  <script src="js/main.js"></script>
  <!-- ページ固有のJS（必要に応じて） -->
</body>
</html>
```

## 5. コーディング規約

### HTML

- セマンティックHTML を徹底する（`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>` 等を適切に使う）
- 見出しは階層順に（`<h1>` は各ページ1つ、`<h2>` → `<h3>` の順）
- すべての画像に `alt` 属性（装飾は `alt=""`）
- リンクの種類で `<a>` と `<button>` を使い分ける（遷移は `<a>`、動作は `<button>`）
- 外部リンクは `target="_blank" rel="noopener noreferrer"`
- フォームの `<label>` と `<input>` を `for` / `id` で必ず関連付ける
- インデント半角スペース2つ

### CSS

- **BEM 記法**でクラス名を命名（`block__element--modifier`）
  - 例: `.hero__title`, `.button--primary`, `.faq__item`
- ID セレクタはレイアウト目的では使わない（JSのフックのみ）
- 色・フォント・余白は **CSS変数** で定義し、`variables.css` に集約
- マジックナンバー（20px の直接指定）を避け、変数を参照
- メディアクエリは **モバイルファースト**（`min-width` で書く）
- `!important` は禁止（やむを得ない場合はコメントで理由を明記）
- ベンダープレフィックスは現代ブラウザのみ対応で十分

```css
/* variables.css 例 */
:root {
  --color-primary: #f29c2c;   /* オレンジ */
  --color-bg: #faf5ee;        /* ベージュ */
  --color-text: #1a1a1a;
  --font-jp: "Noto Sans JP", sans-serif;
  --space-md: 16px;
  --radius-md: 8px;
}
```

### JavaScript

- **Vanilla JS** で書く（jQuery、ライブラリは原則禁止）
- ES6+ 構文（`const` / `let`、アロー関数、`fetch`、テンプレートリテラル等）
- グローバル変数を作らない（`(() => { ... })();` で即時関数 or モジュール化）
- DOM 取得は `document.querySelector` / `querySelectorAll`
- イベント登録は `addEventListener`
- `var` は禁止
- 1つのファイルに1つの機能（`accordion.js` はアコーディオンだけ）

### アクセシビリティ

- 文字サイズはルートで指定、ユーザー側拡大に対応
- 色のコントラスト比 4.5:1 以上（本文）
- フォーム要素は `label` と `input` を関連付ける
- キーボード操作で全ての機能にアクセスできる
- FAQアコーディオンは `aria-expanded` / `aria-controls` で状態を伝える
- スマホでもタップ領域は44px以上を確保

## 6. やってはいけないこと

- HTMLに `style="..."` のインラインスタイルを書く（CSSファイルで管理）
- JSのライブラリ（jQuery, lodash等）を読み込む（プレーンJSで実装）
- `console.log` をコミットに残す
- `var` を使う
- ID で見た目のスタイルを当てる（クラスで当てる）
- 同じスタイル定義を複数ファイルに重複させる
- `node_modules` や `.DS_Store` を commit する（`.gitignore`に記載）
- 個人情報・本番のメール宛先・APIキーなどをコードに直書きする
- 推測でデザインを実装する（Figmaに不明点があれば必ず確認する）

## 7. 共通パーツ（ヘッダー・フッター）の仕組み

`partials/header.html` と `partials/footer.html` に共通パーツのHTMLを書き、各ページからJavaScriptで動的に読み込む。

### include.js の実装方針

```javascript
// js/include.js のイメージ
(async () => {
  const loadPartial = async (id, path) => {
    const el = document.getElementById(id);
    if (!el) return;
    const res = await fetch(path);
    el.innerHTML = await res.text();
  };
  await loadPartial("header-placeholder", "partials/header.html");
  await loadPartial("footer-placeholder", "partials/footer.html");
  // 読み込み完了後にイベントを発火（他のJSがフックできる）
  document.dispatchEvent(new Event("partials:loaded"));
})();
```

### 注意点

- ローカルで `file://` で開くと CORS で fetch できない → 必ずローカルサーバー経由で確認
- ヘッダー内のメニュー開閉などのJSは、`partials:loaded` イベント発火後に初期化する
- SEO上、ヘッダー/フッター内に重要なナビゲーションリンクがあるとクローラーが読みにくい場合がある → 必要に応じてHTML直書きに切り替えを検討

## 8. Figmaからの実装フロー

新しいページ・セクションを実装する時は、以下の順で進めること。**Figma MCP を活用してデザイン情報・画像・アイコンを直接取得する**のが基本方針。

1. **Figma MCP でデザイン読み取り**: 該当フレームを Figma MCP 経由で読み取り、構造・テキスト・レイアウト情報を取得
2. **画像・アイコンの一括ダウンロード**: Figma MCP の `get_screenshot` / `upload_assets` 等を使って、フレーム内のすべての画像・アイコンをエクスポート
3. **画像のプロジェクトへの配置**:
   - 写真など: `images/pages/<ページ名>/` に配置
   - ロゴ・共通アイコン: `images/common/` に配置
   - ファイル名は意味のある英小文字+ハイフン（例: `hero-main.jpg`, `icon-arrow.svg`）
   - 解像度は表示用途に合わせて最適化（SP/PCで分ける場合は `@2x` などで命名）
4. **デザイントークン抽出**: 色・タイポ・余白を Figma MCP の `get_variable_defs` 等で確認し、必要なら `css/variables.css` に追記
5. **HTML構造の設計**: セマンティックHTMLでマークアップ案を作る
6. **実装計画の提示**: 何のファイルを作成・編集するか先にユーザーに共有
7. **実装**: HTML → CSS → JS の順に組み立てる
8. **レスポンシブ確認**: モバイル（375px） / タブレット（768px） / デスクトップ（1280px）
9. **アクセシビリティチェック**: alt、label、コントラスト比、キーボード操作

### 画像取り扱いのルール

- すべての画像は **Figma からエクスポートしてプロジェクトにコミット**する（Figma URL 直リンクや外部CDN参照は禁止）
- 写真は JPEG、ロゴ・アイコン・装飾図形は SVG または PNG を選択
- 大きすぎるファイルはアップロード前に圧縮（目安: 写真は 200KB 以下、JPEGクオリティ 75〜85）
- `<img>` には必ず `width` / `height` 属性を付ける（レイアウトシフト防止）
- 装飾画像（意味を持たない blob 等）は `alt=""` でスクリーンリーダーから除外

## 9. コンテンツに関する注意事項

このサイトは**実在する税理士法人の採用サイト**です。以下を厳守してください。

- **架空の情報を生成しない**: 社員名・実績・数字・所在地などをClaudeが勝手に作らない
- **プレースホルダーは明示する**: 仮テキストには `[仮]`「サンプル」などの目印を必ず入れる
- **資格名・法令名は正確に**: 「税理士」「公認会計士」「日本税理士会連合会」などは正式名称を使う
- **法的・税務的な誤情報は致命的**: 業務内容の説明文を勝手に作らない。ユーザー提供原稿を使う
- **写真**: 仮画像は `images/placeholder/` に配置。本番写真は別途差し替え

## 10. Git運用

- ブランチ命名:
  - 機能追加: `feature/<内容>`（例: `feature/hero-section`）
  - 修正: `fix/<内容>`（例: `fix/header-mobile`）
  - その他: `chore/<内容>`（例: `chore/update-readme`）
- コミットメッセージは日本語可。簡潔に「何をしたか」を書く
- `main` への直接コミット禁止。必ず PR 経由
- マージ前にローカルで動作確認

## 11. Claudeへの依頼方針

このプロジェクトで Claude に作業を頼むときの基本方針。

- 新規ページ・新規セクションを作る前に、**実装計画を先に提示**してほしい
- 既存のCSS変数・共通クラスがあれば優先して使う
- Figmaのフレーム名・URLは添えるので、推測ではなくデザインに忠実に
- 不明点は実装前に質問する。勝手な解釈で進めない
- 1回のタスクで複数ページを一気に作らない。1ページずつ確認しながら進める
- コンテンツ（本文テキスト）はユーザーから提供されるまで仮テキスト `[仮]` を入れる
- jQuery等のライブラリは絶対に追加しない（プレーンJSで実装）

## 12. 関連ドキュメント

- [README.md](./README.md) — プロジェクト全体の概要・セットアップ手順
- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義書（ページ構成・各ページの内容）

## 13. 参考リンク

- Figmaデザイン: <https://www.figma.com/design/UDUB99WpRvTsVylYgvhc55/260511_Kitomi?m=dev>
- MDN Web Docs (HTML/CSS/JSリファレンス): <https://developer.mozilla.org/ja/>
- BEM 命名規則: <https://en.bem.info/methodology/>

（このCLAUDE.mdは適宜更新してください。プロジェクトの進行に合わせてルールが追加・変更されます）
