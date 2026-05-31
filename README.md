# サッカーAI予想 (Soccer AI Prediction)

スタメン画像からAIが試合展開を予測するiPhoneアプリです。サッカーファンが試合前に試合展開を予想して楽しむためのアプリです。

## 🎯 機能

- **画像取得**: カメラまたはフォトライブラリからスタメン画像を選択
- **AI画像解析**: Google Gemini APIを使用してフォーメーション・選手名を自動抽出
- **認識結果確認**: AI認識結果を確認・編集可能
- **試合分析**: 勝率、予想スコア、試合展開を予測
- **広告表示**: Google AdMobのインタースティシャル広告

## 🛠️ 技術スタック

- **フレームワーク**: Expo + React Native
- **言語**: TypeScript
- **AI**: Google Gemini 2.5 Flash API
- **広告**: Google AdMob
- **ビルド**: EAS Build

## 📋 セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn
- Expo CLI

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd soccer-ai-prediction-app

# 依存パッケージをインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定
```

### 環境変数設定

`.env`ファイルに以下の値を設定してください：

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_ADMOB_APP_ID=your_admob_app_id
EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID=your_interstitial_ad_unit_id
```

## 🚀 開発

### ローカル実行

```bash
# Expoアプリで実行
npm start

# iOS Simulatorで実行
npm run ios

# Androidエミュレータで実行
npm run android

# Webブラウザで実行
npm run web
```

### プロジェクト構造

```
src/
├── app/                 # ルーターとスクリーン
│   ├── _layout.tsx     # ルートレイアウト
│   ├── index.tsx       # ホームリダイレクト
│   ├── home.tsx        # ホーム画面（画像選択）
│   ├── confirmation.tsx # 認識結果確認画面
│   └── result.tsx      # 分析結果画面
├── services/           # ビジネスロジック
│   ├── geminiService.ts # Gemini API連携
│   └── imageService.ts  # 画像選択・カメラ処理
├── constants/          # 定数
│   ├── colors.ts       # カラーテーマ（SAMURAI BLUE）
│   └── theme.ts        # テーマ設定
├── types/              # TypeScript型定義
│   └── index.ts
└── components/         # 再利用可能なコンポーネント
```

## 🎨 デザイン

### カラーテーマ: SAMURAI BLUE

- **プライマリ**: 濃いブルー (#003DA5)
- **アクセント**: レッド (#E60012)
- **ニュートラル**: ホワイト・グレースケール

日本代表ユニフォームをイメージした洗練されたデザインです。

## 📱 ユーザーフロー

1. **ホーム画面**: ホームチーム・アウェイチームの画像をアップロード
2. **AI解析**: Gemini APIでフォーメーション・選手名を抽出
3. **認識結果確認**: 抽出結果を確認・手入力で修正
4. **分析開始**: 広告表示後、試合分析を実行
5. **結果表示**: 勝率・予想スコア・試合展開を表示

## 🔐 セキュリティ

- APIキーは環境変数で管理
- `.env`ファイルはGitに含めない（`.gitignore`に追加）

## 📦 ビルド・デプロイ

### iOS ビルド

```bash
# EAS Buildを使用してiOSアプリをビルド
eas build --platform ios

# App Store Connect に提出
eas submit --platform ios
```

### ビルド前の準備

1. Apple Developer Accountを作成
2. App Store Connectでアプリを登録
3. `app.json`の`bundleIdentifier`を設定
4. `eas.json`の`ascAppId`を設定

## 📝 App Store提出用資材

以下のファイルを準備してください：

- **アプリアイコン**: 1024x1024px (PNG)
- **スクリーンショット**: 各デバイスサイズ
- **説明文**: 日本語・英語
- **キーワード**: 関連キーワード
- **プライバシーポリシー**: URL
- **サポートページ**: URL

## 🐛 トラブルシューティング

### APIキーエラー

```
Error: EXPO_PUBLIC_GEMINI_API_KEY is not set
```

→ `.env`ファイルを確認し、Gemini APIキーが正しく設定されているか確認してください。

### 画像認識失敗

```
Error: Failed to parse formation data from response
```

→ 画像がスタメン/フォーメーション情報を含んでいるか確認してください。より鮮明な画像を試してください。

### ビルドエラー

```
Error: EAS Build failed
```

→ `eas build --platform ios --verbose`で詳細ログを確認してください。

## 📄 ライセンス

MIT License

## 👥 サポート

問題が発生した場合は、GitHubのIssueを作成してください。

## 🔄 今後の拡張機能（MVP外）

- SNS共有
- コミュニティ機能
- ランキング表示
- ユーザーログイン
- 月額課金
- リアルタイムチャット
- 戦術ボード
- AI監督モード
- プッシュ通知
- 試合履歴機能

---

**開発者**: Soccer AI Prediction Team  
**最終更新**: 2026年5月31日
