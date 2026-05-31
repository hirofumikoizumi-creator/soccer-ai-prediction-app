# App Store Connect セットアップガイド

このガイドは、「サッカーAI予想シミュレーション」をApp Store Connectに提出するための手順を説明します。

---

## 📋 App Store Connect情報

| 項目 | 値 |
|------|-----|
| **アプリ名** | サッカーAI予想シミュレーション |
| **Bundle ID** | com.gsw.socceraiyosou |
| **SKU** | gsw.socceraiyosou |
| **App ID** | 6775214179 |

---

## 🚀 提出手順

### ステップ1: EAS CLIをインストール

```bash
npm install -g eas-cli
```

### ステップ2: Expoにログイン

```bash
eas login
```

Expoアカウントの認証情報を入力してください。

### ステップ3: 環境変数を設定

```bash
export EXPO_PUBLIC_GEMINI_API_KEY="AQ.Ab8RN6Lc3C0Xu96GsX2vNGUZpairrCq_nKE7gBITN-sB_wQBkw"
export EXPO_PUBLIC_ADMOB_APP_ID="ca-app-pub-5840457424714744-2343444534"
export EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID="ca-app-pub-5840457424714744/2994711458"
```

### ステップ4: iOSビルドを実行

```bash
cd /home/ubuntu/soccer-ai-prediction-app
eas build --platform ios --auto-submit
```

**オプション**:
- `--auto-submit` - ビルド完了後、自動的にApp Store Connectに提出
- 手動提出の場合は、このフラグを外してください

### ステップ5: ビルド完了を待つ

- ビルドには**15〜30分**かかります
- ビルド状況は以下で確認：
  ```bash
  eas build:list
  ```

### ステップ6: App Store Connectで確認

1. [App Store Connect](https://appstoreconnect.apple.com)にログイン
2. **My Apps** → **サッカーAI予想シミュレーション**
3. **ビルド**セクションで新しいビルドを確認
4. **テスト情報**と**リリース情報**を入力
5. **審査に提出**をクリック

---

## 📝 App Store Connect入力項目

### 基本情報

**アプリ名**: サッカーAI予想シミュレーション

**サブタイトル**: AI搭載のサッカー試合予想ツール

**説明**:
```
サッカーのスタメン画像からAIが試合展開を予測するシミュレーションアプリです。

【主な機能】
- 📸 カメラまたはライブラリから画像を選択
- 🤖 Google Gemini AIがフォーメーション・選手名を自動認識
- ⚽ 試合展開を詳細に分析
- 📊 勝率・予想スコア・試合展開予想を表示
- 🎯 1日3回まで分析可能（無料）

【使い方】
1. ホームチームの画像を選択
2. アウェイチームの画像を選択
3. 「試合分析を開始」をタップ
4. AIが分析結果を表示

【対応OS】
iOS 14.0以上

【注意事項】
- インターネット接続が必要です
- カメラ・フォトライブラリへのアクセス許可が必要です
- 分析は1日3回までです
```

**キーワード**: サッカー,AI,予想,シミュレーション,フォーメーション

### スクリーンショット

App Store Connectで以下のスクリーンショットをアップロード：
- ホーム画面
- 認識結果確認画面
- 結果表示画面

**推奨サイズ**: 1242 x 2208 px（iPhone 14 Pro Max）

### プレビュー動画

オプション：30秒以内の使用デモ動画

### サポートURL

プライバシーポリシーへのリンク：
```
https://your-domain.com/privacy-policy
```

### プライバシーポリシー

`PRIVACY_POLICY.md`を参照

---

## 🔐 App Store Connect設定

### 1. 価格と配布

- **価格**: 無料
- **配布地域**: 全世界

### 2. 年齢制限

- **暴力**: なし
- **性的コンテンツ**: なし
- **アルコール**: なし
- その他すべて: なし

### 3. 審査情報

**ログイン情報**:
- テストアカウント情報（必要な場合）

**説明**:
```
このアプリはGoogle Gemini APIを使用してAI解析を行います。
カメラとフォトライブラリへのアクセスが必要です。
インターネット接続が必須です。
```

---

## ⚠️ よくあるエラーと解決方法

### エラー: "Bundle ID mismatch"

**原因**: app.jsonのBundle IDが異なる

**解決**:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.gsw.socceraiyosou"
    }
  }
}
```

### エラー: "Invalid App ID"

**原因**: App Store ConnectのApp IDが間違っている

**確認**: eas.json内の`ascAppId`が正しいか確認

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6775214179"
      }
    }
  }
}
```

### エラー: "Provisioning profile not found"

**原因**: Apple Developer Accountの設定が不完全

**解決**:
1. Apple Developer Accountにログイン
2. Certificates, Identifiers & Profiles を確認
3. Provisioning Profileを再生成

---

## 📞 サポート

問題が発生した場合：

1. **EAS ドキュメント**: https://docs.expo.dev/eas/
2. **App Store Connect ヘルプ**: https://help.apple.com/app-store-connect/
3. **Expo コミュニティ**: https://forums.expo.dev/

---

## ✅ チェックリスト

提出前に確認：

- [ ] Bundle ID: `com.gsw.socceraiyosou`
- [ ] App ID: `6775214179`
- [ ] 環境変数設定完了
- [ ] app.json更新完了
- [ ] eas.json更新完了
- [ ] プライバシーポリシー準備完了
- [ ] スクリーンショット準備完了
- [ ] テスト完了

---

**最終更新**: 2026年5月31日
