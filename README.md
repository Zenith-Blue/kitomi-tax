# kitomi-tax

きとみ税理士法人の採用サイトのソースコードリポジトリです。

## 概要

- **サイト名**: きとみ税理士法人 採用サイト
- **目的**: 税理士有資格者および会計スタッフの採用強化
- **対象**: 税理士資格保有者を中心とした求職者
- **デザイン**: [Figma](https://www.figma.com/design/UDUB99WpRvTsVylYgvhc55/260511_Kitomi?m=dev)
- **公開URL**: <https://recruit.kitomi-tax.com/>

## 技術スタック

| カテゴリ | 採用技術 |
| :-- | :-- |
| マークアップ | HTML5 |
| スタイル | CSS3（Sassは使わない・プレーンCSS） |
| スクリプト | Vanilla JavaScript（ES6+） |
| ビルドツール | なし（プレーンファイルのみ） |
| 共通パーツ | JSによる動的読み込み（fetch + innerHTML） |
| 応募フォーム | WordPress 併用（別途構築） |
| デプロイ | Xserver（GitHub Actions で `main` push 時に rsync 自動デプロイ） |

## ドメイン構成

| ドメイン | 役割 |
| :-- | :-- |
| `recruit.kitomi-tax.com` | **採用サイト（このリポジトリ）** |
| `kitomi-tax.com` | コーポレートサイト未制作のため、**一旦 採用サイトへ 301 リダイレクト** |

### デプロイ

`main` に push すると `.github/workflows/deploy.yml` が rsync over SSH で Xserver へ自動デプロイします。

- サーバー: Xserver（ユーザー `xs966178` / SSHポート `10022`）
- デプロイ先: `/home/xs966178/kitomi-tax.com/public_html/recruit.kitomi-tax.com/`
- Secrets: `SSH_PRIVATE_KEY` / `SSH_HOST` / `SSH_USER` / `SSH_TARGET`

> **⚠️ 注意**
> 採用サイトの docroot は、メインドメインの docroot（`public_html/`）の **内側** にあります。
> `SSH_TARGET` を `public_html/` にすると `--delete` でメインドメイン側のリダイレクトを消してしまうため、
> 必ず `recruit.kitomi-tax.com/` まで含めてください。

### メインドメイン（kitomi-tax.com）のリダイレクトについて

リダイレクトはサーバー上の `public_html/.htaccess` で直接管理しています（**専用リポジトリは持ちません**）。
中身は以下のみです。

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^ https://recruit.kitomi-tax.com/ [R=301,L]
</IfModule>
```

将来コーポレートサイトを公開するときは、このブロックを削除してサイト本体を `public_html/` に配置します
（その際、採用サイトの `recruit.kitomi-tax.com/` ディレクトリを消さないよう注意）。

## セットアップ

### 必要環境

- 任意のテキストエディタ（VSCodeなど）
- 任意のブラウザ（Chrome / Safari / Firefox など）
- ローカルでHTMLを表示する際、JSによる共通パーツ読み込みのために**ローカルサーバー**が必要（`file://` で開くとCORSで読み込めない）

### 初回セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/<your-account>/kitomi-tax.git
cd kitomi-tax
```

### ローカル開発（ローカルサーバーの起動）

以下のいずれかの方法でローカルサーバーを起動します。

**方法1: VSCode の Live Server 拡張**

1. VSCode拡張機能 "Live Server" をインストール
2. `index.html` を右クリック → "Open with Live Server"
3. ブラウザが自動で開く

**方法2: Python の組み込みサーバー**

```bash
# Python 3 の場合
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開く。

**方法3: Node.js の serve コマンド**

```bash
npx serve
```

## ディレクトリ構成

```
kitomi-tax/
├── index.html              # トップ
├── about.html              # 事業所案内
├── environment.html        # 働く環境
├── requirements.html       # 募集要項+FAQ
├── entry.html              # 応募フォーム
├── privacy.html            # プライバシーポリシー
├── partials/
│   ├── header.html         # 共通ヘッダー（JSで読み込み）
│   └── footer.html         # 共通フッター（JSで読み込み）
├── css/
│   ├── reset.css           # リセットCSS
│   ├── variables.css       # CSS変数（色・フォント・余白）
│   ├── common.css          # 全ページ共通スタイル
│   └── pages/              # ページ別の追加スタイル
│       ├── home.css
│       ├── about.css
│       ├── environment.css
│       ├── requirements.css
│       ├── entry.css
│       └── privacy.css
├── js/
│   ├── include.js          # ヘッダー・フッターの動的読み込み
│   ├── main.js             # 共通機能（ハンバーガーメニューなど）
│   ├── accordion.js        # FAQアコーディオン
│   └── form.js             # 応募フォーム（WordPress送信）
├── images/                 # 画像ファイル
│   ├── common/             # 全ページ共通画像（ロゴなど）
│   └── pages/              # ページ別画像
├── CLAUDE.md               # 開発ルール（Claude Code用）
├── REQUIREMENTS.md         # 要件定義書
├── README.md               # このファイル
└── .gitignore
```

## ページ構成（全6ページ）

| # | ページ | パス | Figmaフレーム |
| :-: | :-- | :-- | :-- |
| 1 | トップ | `/index.html` | `01_Home_PC` |
| 2 | 事業所案内 | `/about.html` | `02_About` |
| 3 | 働く環境 | `/environment.html` | `03_Environment` |
| 4 | 募集要項（税理士・会計スタッフ・FAQ含む） | `/requirements.html` | `04_Requirements` |
| 5 | 応募フォーム | `/entry.html` | `05-1_Entry` |
| 6 | プライバシーポリシー | `/privacy.html` | `05-2_Policy` |

詳細・各ページの内容は [REQUIREMENTS.md](./REQUIREMENTS.md) を参照してください。

## 編集ガイド（どこを直せば何が変わるか）

「よく変更する値」をどのファイルで直すかの早見表です。**ビルドツールを使わない素のHTML/CSS/JS** のため、本文テキストは各HTMLに直接書かれています。

### 1. 本文テキストを変えたい

そのページのHTMLを直接編集します。

| 変えたい場所 | 編集ファイル |
| :-- | :-- |
| トップの各セクション文言 | `index.html` |
| 事務所案内（代表挨拶・強みなど） | `about.html` |
| 働く環境 | `environment.html` |
| 募集要項・FAQ | `requirements.html` |
| 応募フォームの項目ラベル等 | `entry.html` |
| プライバシーポリシー本文 | `privacy.html` |
| 全ページ共通のヘッダー | `partials/header.html` |
| 全ページ共通のフッター | `partials/footer.html` |

### 2. 画像を差し替えたい

- 各ページの画像：`images/pages/<ページ名>/` に同名で上書き、またはHTMLの `src` / `srcset` を変更
- ロゴなど共通画像：`images/common/`
- **SP/PCで画像を出し分けている箇所**は `<picture>` 内に2つ指定があります。両方（PC用 `srcset` と SP用 `src`/`source`）を確認して差し替えてください。
- 画像は JPEG（写真は200KB目安）/ PNG・SVG（ロゴ・アイコン・装飾）。`width`/`height` 属性は残す（レイアウトずれ防止）。

### 3. リンク先・メニューを変えたい

| 変えたい場所 | 編集ファイル |
| :-- | :-- |
| グローバルナビ（ホーム/事業所案内/働く環境/募集要項/エントリー） | `partials/header.html` |
| フッターのリンク・プライバシーポリシーリンク | `partials/footer.html` |
| 応募フォーム内のプライバシーポリシーリンク | `entry.html` |

### 4. 色・余白・フォントサイズを一括で変えたい

**`css/variables.css`** に集約しています。ここを変えると全ページに反映されます。

- 色：`--color-orange` `--color-red` `--color-text` など
- 余白：`--space-*`
- 角丸：`--radius-*`
- 影：`--shadow-cta`
- グラデーション（CTAボタン）：`--gradient-cta`

各ページCSSはこの変数を参照しています。新しいスタイルを足すときも、直接 `#色コード` や固定pxを書かず、できるだけ変数を使ってください。

### 5. 事業者情報（電話番号・住所・事務所名）を変えたい ⚠️ 複数箇所

同じ情報が複数ファイルに出てきます。更新時は**下記すべて**を直してください（静的サイトのため自動同期されません）。

| 項目 | 出現ファイル |
| :-- | :-- |
| 電話番号 `049-277-5541` | `partials/footer.html` / `partials/header.html` / `about.html` / `privacy.html` / `js/form.js`（送信失敗時メッセージ） |
| 住所・郵便番号 `〒350-0041 …六軒町…` | `partials/footer.html` / `about.html` / `privacy.html` / `requirements.html` |
| 事務所名・代表者名 | 各HTML（`partials/footer.html`、`about.html`、`privacy.html` ほか） |

※ヘッダー・フッターは `partials/` の1ファイルで全ページ共通管理（ここを直せば全ページに反映）。

### 6. 応募フォームの送信設定（EmailJS）

`js/form.js` 冒頭の定数を編集します。

- `PUBLIC_KEY` / `SERVICE_ID` / `TEMPLATE_ID`：EmailJSダッシュボードの値
- 送信先メールアドレスは**コードに書かず、EmailJSテンプレートの To Email / 自動返信側**で設定します。

### 7. スクロールアニメーションの対象・速度を変えたい

- 表示対象セクションの登録：`js/main.js` の `revealTargets` 配列
- 「スクロール到達後に開始」する閾値：`js/main.js` の `REVEAL_ROOT_MARGIN`
- 各要素の出る速さ・間隔：各ページCSSの `transition` / `transition-delay`

### 8. 共通部品（コピペを避ける仕組み）

- **ヘッダー・フッター**：`partials/header.html` / `partials/footer.html` を全ページがJSで読み込み（単一管理）
- **見出し**：`.section-title`（`section-title__en` / `section-title__jp`）を全ページで共通利用
- **ボタン**：`.button`（`button--orange` など）を共通利用
- **レスポンシブの定番パターン**：[RESPONSIVE.md](./RESPONSIVE.md) の「15. 実装済みレスポンシブパターン」を参照

## 開発の進め方

### 全体フロー

1. **Figma MCP でデザインを読み取り**（該当フレームの構造・テキスト・色情報を取得）
2. **画像・アイコンを一括ダウンロード**（Figma からエクスポートし、`images/` 配下に配置）
3. ローカルサーバーを起動して実装作業
4. 変更を `feature/<内容>` ブランチで commit
5. GitHub に push
6. プルリクエストを作成
7. `main` にマージ
8. （デプロイ先決定後）本番反映

### Figma MCP の活用方針

- **デザイン情報の取得**: フレーム構造・テキスト・色・余白などを直接読み取り、目視より正確に実装
- **画像アセットの取得**: 写真・ロゴ・装飾アイコンなどを一括エクスポートし、プロジェクトに配置
- **アセット配置**:
  - 写真: `images/pages/<ページ名>/`
  - 共通（ロゴ・アイコン）: `images/common/`
  - ファイル名は英小文字+ハイフン（例: `hero-main.jpg`）
- Figma URL の直リンクや外部CDN参照は禁止。必ずリポジトリにコミット

詳細は [CLAUDE.md](./CLAUDE.md) のセクション8「Figmaからの実装フロー」を参照。

## 開発ルール

コーディング規約・ディレクトリ配置ルール・コミットルールなどは [CLAUDE.md](./CLAUDE.md) を参照してください。

## ライセンス・著作権

本リポジトリのコード・デザイン・コンテンツの著作権は きとみ税理士法人 に帰属します。無断複製・転載を禁じます。
