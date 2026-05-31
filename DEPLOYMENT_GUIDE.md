# デプロイメントガイド

このガイドは、「サッカーAI予想」をApp Store Connectに提出し、App Storeでリリースするための手順を説明します。

## 前提条件

- macOS 12.0以上（iOS ビルドの場合）
- Xcode 14.0以上
- Apple Developer Account
- Node.js 18以上
- npm または yarn

## ステップ1: Apple Developer Accountの準備

### 1.1 Apple Developer Programに登録
1. [Apple Developer](https://developer.apple.com/programs/) にアクセス
2. 「Enroll」をクリック
3. Apple IDでサインイン
4. 開発者契約に同意
5. 支払い情報を入力（年間99ドル）

### 1.2 チーム情報の確認
1. [App Store Connect](https://appstoreconnect.apple.com/) にログイン
2. 「Users and Access」 → 「Team ID」を確認
3. Team IDをメモ（後で必要）

## ステップ2: 環境変数の設定

### 2.1 .envファイルの作成
```bash
cd soccer-ai-prediction-app
cp .env.example .env
```

### 2.2 .envファイルの編集
```bash
# .env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_ADMOB_APP_ID=your_admob_app_id
EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID=your_ad_unit_id
```

**注意**: `.env`ファイルをGitにコミットしないでください。

## ステップ3: app.jsonの設定

### 3.1 バンドルIDの設定
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

### 3.2 バンドルIDの命名規則
- 形式: `com.company.appname`
- 例: `com.example.soccerAIPrediction`
- App Store Connectで登録したバンドルIDと一致させる

## ステップ4: EAS Buildの設定

### 4.1 Expoアカウント作成
```bash
expo register
```

### 4.2 EAS CLIのインストール
```bash
npm install -g eas-cli
```

### 4.3 EAS Buildの初期化
```bash
cd soccer-ai-prediction-app
eas build:configure
```

### 4.4 eas.jsonの確認
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "ios": {
        "node": "20.11.0",
        "npm": "10.2.4"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "1234567890"
      }
    }
  }
}
```

## ステップ5: App Store Connectでのアプリ登録

### 5.1 新規アプリの作成
1. [App Store Connect](https://appstoreconnect.apple.com/) にログイン
2. 「My Apps」をクリック
3. 「+」ボタンをクリック
4. 「New App」を選択

### 5.2 アプリ情報の入力
- **Platform**: iOS
- **Name**: サッカーAI予想
- **Primary Language**: Japanese
- **Bundle ID**: com.example.soccerAIPrediction
- **SKU**: soccer-ai-prediction-001

### 5.3 アプリ情報の設定
1. 「App Information」セクションで以下を入力：
   - Subtitle: スタメン画像から試合展開を予測
   - Category: Sports
   - Privacy Policy URL: https://example.com/privacy-policy

## ステップ6: ビルド実行

### 6.1 Expoにログイン
```bash
eas login
```

### 6.2 iOS用ビルド実行
```bash
# 自動提出なし
eas build --platform ios

# または自動提出あり
eas build --platform ios --auto-submit
```

### 6.3 ビルド進行状況の確認
```bash
eas build:list
```

### 6.4 ビルド完了
- ビルド完了後、メールで通知されます
- [Expo Dashboard](https://expo.dev/builds) でステータス確認

## ステップ7: App Store Connect での設定

### 7.1 TestFlightテスト（オプション）

#### 内部テスト
```bash
eas build --platform ios --profile preview
```

#### テスターの追加
1. App Store Connect → 「TestFlight」
2. 「Internal Testers」→ 「+」
3. テスターのメールアドレスを入力

### 7.2 メタデータの入力

#### 説明文
1. 「App Store」 → 「App Information」
2. 「Description」に説明文を入力
3. 「What's New in This Version」に更新内容を入力

#### スクリーンショット
1. 「App Store」 → 「Screenshots」
2. 各デバイスサイズのスクリーンショットをアップロード
   - iPhone 6.7インチ: 5枚
   - iPhone 5.5インチ: 5枚

#### プレビュー
1. 「App Store」 → 「Preview」
2. 最大30秒の動画をアップロード（オプション）

#### キーワード
1. 「App Store」 → 「Keywords」
2. 関連キーワードを入力（最大100文字）
   - 例: サッカー, AI, 予想, フォーメーション, スタメン

### 7.3 年齢レーティング
1. 「App Store」 → 「Age Rating」
2. 質問に回答
3. レーティングが自動決定

### 7.4 App Privacy
1. 「App Store」 → 「App Privacy」
2. 「Edit」をクリック
3. データ収集項目を入力
4. プライバシーポリシーURLを入力

## ステップ8: ビルドの提出

### 8.1 ビルドの選択
1. App Store Connect → 「Builds」
2. ビルドを選択
3. 「Submit for Review」をクリック

### 8.2 審査情報の入力
1. 「Version Release」で「Manually Release」を選択
2. 「Compliance」で必要な情報を入力
3. 「Contact Information」を確認

### 8.3 提出
1. すべての必須項目を確認
2. 「Submit for Review」をクリック
3. 提出完了

## ステップ9: 審査待機

### 9.1 審査期間
- 通常: 1〜3営業日
- 複雑な場合: 最大1週間

### 9.2 審査状況の確認
1. App Store Connect → 「Activity」
2. 審査状況を確認

### 9.3 審査結果
- **承認**: App Storeで公開
- **却下**: 修正が必要
- **情報要求**: 追加情報が必要

## ステップ10: リリース

### 10.1 自動リリース
- 「Version Release」で「Automatically release this version」を選択した場合、承認後に自動公開

### 10.2 手動リリース
1. 承認後、App Store Connect にログイン
2. 「Releases」 → 「iOS」
3. 「Release」をクリック
4. 「Release」ボタンをクリック

### 10.3 リリース完了
- App Storeで公開
- ユーザーがダウンロード可能

## トラブルシューティング

### ビルドエラー

#### エラー: "Pod install failed"
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
eas build --platform ios --clean
```

#### エラー: "Provisioning profile not found"
1. Apple Developer Accountで証明書を確認
2. Expoダッシュボードで認証情報をリセット
3. ビルドを再実行

### 審査却下

#### 一般的な却下理由
- クラッシュ
- 不完全な機能
- プライバシーポリシーなし
- 不適切なコンテンツ

#### 対応方法
1. 却下理由を確認
2. コードを修正
3. 新しいビルドを提出

## ベストプラクティス

### 1. バージョン管理
- 最初のリリース: 1.0.0
- バグ修正: 1.0.1, 1.0.2
- 機能追加: 1.1.0
- 大規模更新: 2.0.0

### 2. ビルド番号
- 毎回のビルドで増加
- 例: 1, 2, 3...

### 3. リリースノート
- 明確で簡潔
- ユーザーにとって有用な情報
- 日本語で記述

### 4. テスト
- TestFlightで十分なテスト
- 複数のデバイスで確認
- パフォーマンステスト

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

**最終更新**: 2026年5月31日  
**バージョン**: 1.0.0

このガイドに従うことで、「サッカーAI予想」をApp Storeで正常にリリースできます。
