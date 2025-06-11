# TOEIC英単語診断テスト

無料のTOEIC英単語診断テストWebアプリケーション。30問の英単語問題であなたの語彙力を診断し、TOEICスコアを予測します。

## 機能

- 📝 30問の英単語診断テスト
- 📊 TOEICスコア換算 (10-990点)
- 📈 詳細な分析結果とグラフ表示
- 📱 レスポンシブデザイン (PC・スマホ対応)
- 🔗 SNSシェア機能 (Twitter, Facebook, LINE)
- 📊 Firebase Analytics (GA4) 対応
- 🔍 SEO最適化済み

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **ビルドツール**: Vite
- **アナリティクス**: Firebase Analytics (GA4)
- **ホスティング**: Firebase Hosting
- **グラフ**: Chart.js
- **デザイン**: レスポンシブCSS

## セットアップ

### 前提条件

- Node.js (v14以上)
- npm または yarn
- Firebase CLI

### インストール

1. プロジェクトをクローン
```bash
git clone <repository-url>
cd toeic-vocabulary-test
```

2. 依存関係をインストール
```bash
npm install
```

3. Firebase プロジェクトの設定
```bash
# Firebase CLIをインストール (まだの場合)
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# Firebaseプロジェクトを作成
firebase init

# プロジェクトIDを.firebasercファイルに設定
# "your-project-id"を実際のプロジェクトIDに変更
```

4. Firebase設定の更新
`app.js` ファイル内の Firebase 設定を更新:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 開発

開発サーバーを起動:
```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

### ビルド

本番用にビルド:
```bash
npm run build
```

### デプロイ

Firebase Hostingにデプロイ:
```bash
npm run deploy
```

または:
```bash
firebase deploy
```

## プロジェクト構造

```
toeic-vocabulary-test/
├── index.html              # メインHTMLファイル
├── app.js                   # メインJavaScriptファイル
├── vocabulary-data.js       # 英単語データベース
├── style.css               # スタイルシート
├── package.json            # パッケージ設定
├── vite.config.js          # Vite設定
├── firebase.json           # Firebase設定
├── .firebaserc             # Firebaseプロジェクト設定
└── README.md               # プロジェクト説明
```

## 英単語データベース

4つの難易度レベルに分類された英単語問題:

- **基礎レベル** (TOEIC 300-450): 10問
- **中級レベル** (TOEIC 450-650): 10問  
- **上級レベル** (TOEIC 650-850): 10問
- **専門レベル** (TOEIC 850+): 10問

## スコア計算方式

- 基礎レベル正解: 20点
- 中級レベル正解: 25点
- 上級レベル正解: 35点
- 専門レベル正解: 45点

最終スコア = (獲得点数 × 1.2) + レベル別ボーナス

## SEO対策

- メタタグ最適化
- Open Graph対応
- Twitter Card対応
- 構造化データ (JSON-LD)
- 日本語キーワード最適化

## アナリティクス

Firebase Analytics (GA4) で以下のイベントを追跡:

- `page_view`: ページビュー
- `test_started`: テスト開始
- `test_completed`: テスト完了
- `share`: SNSシェア
- `test_restarted`: テスト再開始

## カスタマイズ

### 英単語の追加

`vocabulary-data.js` ファイルの各レベル配列に新しい問題を追加:

```javascript
{
  word: "新しい英単語",
  meaning: "日本語の意味",
  choices: ["正解", "選択肢2", "選択肢3", "選択肢4"],
  correct: 0  // 正解のインデックス
}
```

### スタイルの変更

`style.css` ファイルでデザインをカスタマイズ。CSS変数を使用して色テーマを変更可能。

### アナリティクス設定

`app.js` ファイルの `firebaseConfig` オブジェクトを更新して、独自のFirebaseプロジェクトに接続。

## ライセンス

MIT License

## 貢献

プルリクエストやイシュー報告を歓迎します。

## サポート

質問やサポートが必要な場合は、Issues ページでお知らせください。