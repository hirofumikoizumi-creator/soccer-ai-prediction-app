# App Store Connect 提出チェックリスト

## ✅ 開発完了項目

### 1. アプリ機能実装
- [x] 画像取得（カメラ・ライブラリ）
- [x] AI画像解析（Gemini API）
- [x] 認識結果確認画面
- [x] 試合分析・結果表示
- [x] AdMob広告統合
- [x] エラーハンドリング

### 2. 設定ファイル
- [x] app.json（iOS設定）
- [x] eas.json（EAS Build設定）
- [x] tsconfig.json（TypeScript設定）
- [x] package.json（依存パッケージ）

### 3. ドキュメント
- [x] README.md
- [x] APP_STORE_METADATA.md
- [x] プライバシーポリシー
- [x] サポートページ

### 4. デザイン
- [x] SAMURAI BLUEテーマ適用
- [x] カラースキーム定義
- [x] UI/UXデザイン

---

## 📋 App Store Connect提出前の準備

### 1. Apple Developer Accountの設定
- [ ] Apple Developer Programに登録
- [ ] 開発者契約に同意
- [ ] Team ID を確認

### 2. App Store Connectでのアプリ登録
- [ ] アプリ名: 「サッカーAI予想」
- [ ] バンドルID: `com.example.soccerAIPrediction`（変更可能）
- [ ] SKU: 任意の識別子
- [ ] プライマリカテゴリ: スポーツ
- [ ] セカンダリカテゴリ: ユーティリティ

### 3. ビルド前の設定

#### app.jsonの更新
```json
{
  "expo": {
    "name": "サッカーAI予想",
    "slug": "soccer-ai-prediction",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.example.soccerAIPrediction",
      "buildNumber": "1"
    }
  }
}
```

#### 環境変数の設定
```bash
export EXPO_PUBLIC_GEMINI_API_KEY="your_key"
export EXPO_PUBLIC_ADMOB_APP_ID="your_app_id"
export EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID="your_ad_unit_id"
```

### 4. ビルド実行

#### EAS Buildでのビルド
```bash
# ログイン
eas login

# iOS用ビルド
eas build --platform ios --auto-submit

# または手動で
eas build --platform ios
```

#### ビルド完了後
- ビルドファイル（.ipa）をダウンロード
- App Store Connectにアップロード

### 5. App Store Connect での設定

#### 基本情報
- [x] アプリ名
- [x] サブタイトル
- [x] 説明文
- [x] キーワード
- [x] サポートURL
- [x] プライバシーポリシーURL

#### スクリーンショット
- [ ] iPhone 6.7インチ: 5枚
- [ ] iPhone 5.5インチ: 5枚
- [ ] iPad Pro 12.9インチ: 5枚（オプション）

#### プレビュー動画
- [ ] 最大30秒の動画（オプション）

#### アプリアイコン
- [ ] 1024x1024px PNG

#### 年齢レーティング
- [x] 4才以上
- [x] 暴力: なし
- [x] 性的表現: なし
- [x] 言語: なし

#### 価格と配布
- [x] 無料
- [x] 利用可能な地域: 全て

#### App Privacy
- [x] プライバシーポリシーURL
- [x] データ収集: 最小限

### 6. テスト

#### 内部テスト
```bash
# TestFlightで内部テスター向けにビルドを配布
eas build --platform ios --profile preview
```

#### 外部テスト
- [ ] 最大100人のテスターに招待
- [ ] フィードバック収集
- [ ] バグ修正

### 7. 審査提出

#### 審査情報
- [x] 審査ノート記入
- [x] 連絡先情報
- [x] デモアカウント（不要）
- [x] 審査ガイドライン確認

#### 提出前チェック
- [ ] すべての必須項目を入力
- [ ] スクリーンショットが正確
- [ ] プライバシーポリシーが完全
- [ ] 年齢レーティングが正確
- [ ] ビルドが選択されている

---

## 🔧 ビルド手順（詳細）

### ステップ1: Expoアカウント作成
```bash
expo register
# または
expo login
```

### ステップ2: EAS CLIインストール
```bash
npm install -g eas-cli
```

### ステップ3: プロジェクト初期化
```bash
cd soccer-ai-prediction-app
eas build:configure
```

### ステップ4: ビルド実行
```bash
# iOS用ビルド（App Store用）
eas build --platform ios --auto-submit

# または段階的に
eas build --platform ios
# ビルド完了後、App Store Connectで手動提出
```

### ステップ5: App Store Connect提出
```bash
# ビルドをダウンロード後、App Store Connectで提出
eas submit --platform ios --latest
```

---

## 📱 テスト項目

### 機能テスト
- [ ] ホーム画面表示
- [ ] カメラ撮影機能
- [ ] フォトライブラリ選択
- [ ] AI画像解析
- [ ] 認識結果編集
- [ ] 試合分析実行
- [ ] 結果表示
- [ ] 広告表示

### パフォーマンステスト
- [ ] 起動時間（3秒以内）
- [ ] 画像処理時間（10秒以内）
- [ ] AI解析時間（15秒以内）
- [ ] メモリ使用量（150MB以下）

### 互換性テスト
- [ ] iOS 14.0以上で動作
- [ ] iPhone全サイズで表示確認
- [ ] 縦向き・横向き対応

### セキュリティテスト
- [ ] APIキー保護
- [ ] 画像データ処理
- [ ] ネットワーク通信暗号化

---

## 🚀 リリース後の対応

### 監視項目
- [ ] App Store での評価・レビュー確認
- [ ] クラッシュレポート監視
- [ ] ユーザーフィードバック収集

### アップデート計画
- [ ] バグ修正リリース
- [ ] 機能改善リリース
- [ ] パフォーマンス最適化

---

## 📞 サポート情報

### 連絡先
- メール: support@example.com
- Webサイト: https://example.com
- Twitter: @SoccerAIPrediction

### よくある質問
- Q: 画像はどこに保存されますか？
  A: 解析後、サーバーから削除されます。

- Q: 予想の精度は？
  A: AIベースの予想のため、実際と異なる場合があります。

- Q: オフライン使用可能？
  A: インターネット接続が必須です。

---

## ⚠️ 注意事項

1. **APIキー管理**
   - 本番環境では環境変数で管理
   - GitHubにコミットしない

2. **プライバシー**
   - ユーザー画像は解析後削除
   - プライバシーポリシーに明記

3. **コンテンツ**
   - ギャンブル目的ではないことを明記
   - 日本代表ロゴ・エンブレムは使用しない

4. **審査ガイドライン**
   - Apple App Store Review Guidelines確認
   - 不適切なコンテンツなし
   - 安定動作確認

---

**最終確認日**: 2026年5月31日  
**提出予定日**: 2026年6月  
**バージョン**: 1.0.0
