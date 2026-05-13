# kitomi-tax

きとみ税理士法人の採用サイトのソースコードリポジトリです。

## 概要

- **サイト名**: きとみ税理士法人 採用サイト
- **目的**: 税理士有資格者および会計スタッフの採用強化
- **対象**: 税理士資格保有者を中心とした求職者
- **デザイン**: [Figma](https://www.figma.com/design/UDUB99WpRvTsVylYgvhc55/260511_Kitomi?m=dev)
- **公開URL**: 未定

## 技術スタック

| カテゴリ | 採用技術 |
| :-- | :-- |
| マークアップ | HTML5 |
| スタイル | CSS3（Sassは使わない・プレーンCSS） |
| スクリプト | Vanilla JavaScript（ES6+） |
| ビルドツール | なし（プレーンファイルのみ） |
| 共通パーツ | JSによる動的読み込み（fetch + innerHTML） |
| 応募フォーム | WordPress 併用（別途構築） |
| デプロイ | 未定 |

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
