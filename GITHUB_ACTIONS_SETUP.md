# GitHub Actions セットアップガイド

このガイドは、GitHub Actionsを使用してEAS Buildでビルド・提出するための手順を説明します。

---

## 🔑 必要なシークレット設定

GitHub Actionsでビルドするには、以下のシークレットを設定する必要があります。

### ステップ1: GitHub リポジトリ設定を開く

1. https://github.com/hirofumikoizumi-creator/soccer-ai-prediction-app
2. **Settings** をクリック
3. **Secrets and variables** → **Actions** をクリック

### ステップ2: シークレットを追加

以下の4つのシークレットを追加してください：

#### 1. EXPO_TOKEN

**取得方法**:
1. https://expo.dev/settings/tokens にアクセス
2. **Create Token** をクリック
3. **Token name**: `github-actions`
4. **Expiration**: 90 days
5. トークンをコピー

**設定方法**:
1. GitHub Settings → Secrets → New repository secret
2. **Name**: `EXPO_TOKEN`
3. **Value**: [コピーしたトークン]
4. **Add secret** をクリック

#### 2. GEMINI_API_KEY

**設定方法**:
1. GitHub Settings → Secrets → New repository secret
2. **Name**: `GEMINI_API_KEY`
3. **Value**: `AQ.Ab8RN6Lc3C0Xu96GsX2vNGUZpairrCq_nKE7gBITN-sB_wQBkw`
4. **Add secret** をクリック

#### 3. ADMOB_APP_ID

**設定方法**:
1. GitHub Settings → Secrets → New repository secret
2. **Name**: `ADMOB_APP_ID`
3. **Value**: `ca-app-pub-5840457424714744-2343444534`
4. **Add secret** をクリック

#### 4. ADMOB_INTERSTITIAL_AD_UNIT_ID

**設定方法**:
1. GitHub Settings → Secrets → New repository secret
2. **Name**: `ADMOB_INTERSTITIAL_AD_UNIT_ID`
3. **Value**: `ca-app-pub-5840457424714744/2994711458`
4. **Add secret** をクリック

---

## 🚀 ビルド実行方法

### 方法1: 手動トリガー（推奨）

1. GitHub リポジトリを開く
2. **Actions** タブをクリック
3. **EAS Build and Submit to App Store** を選択
4. **Run workflow** をクリック
5. **Branch**: `master` を選択
6. **submit**: `true` を選択
7. **Run workflow** をクリック

### 方法2: 自動トリガー

以下の場合に自動的にビルドが実行されます：

- `master` ブランチに `src/` ファイルをプッシュ
- `app.json` または `eas.json` を更新
- `.github/workflows/eas-build.yml` を更新

### 方法3: コマンドラインから

```bash
# ローカルマシンから手動トリガー
gh workflow run eas-build.yml -f submit=true
```

---

## 📊 ビルド進行状況の確認

### GitHub Actions ダッシュボード

1. GitHub リポジトリを開く
2. **Actions** タブをクリック
3. **EAS Build and Submit to App Store** ワークフローを確認
4. 実行中のジョブをクリックして詳細を表示

### ビルド時間

- **初回ビルド**: 30〜45分
- **2回目以降**: 20〜30分

### ビルド完了後

- ✅ App Store Connect に自動提出
- 📧 Expoから通知メール
- 📱 App Store Connect でビルドを確認

---

## ⚠️ トラブルシューティング

### エラー: "EXPO_TOKEN is not set"

**原因**: `EXPO_TOKEN` シークレットが設定されていない

**解決**:
1. GitHub Settings → Secrets
2. `EXPO_TOKEN` を追加

### エラー: "Build failed"

**原因**: 複数の可能性

**確認項目**:
1. **ログを確認** - Actions ダッシュボードでエラーメッセージを確認
2. **依存関係** - `npm install` が成功しているか確認
3. **環境変数** - すべてのシークレットが設定されているか確認
4. **ビルド設定** - `app.json` と `eas.json` が正しいか確認

### エラー: "App Store Connect submission failed"

**原因**: Apple Developer Account の設定が不完全

**確認項目**:
1. **App ID** - `eas.json` の `ascAppId` が正しいか確認
2. **Bundle ID** - `app.json` の `bundleIdentifier` が正しいか確認
3. **Provisioning Profile** - Apple Developer Account で確認

---

## 📝 ワークフロー詳細

### ファイル: `.github/workflows/eas-build.yml`

**トリガー**:
- `workflow_dispatch` - 手動トリガー
- `push` - master ブランチへのプッシュ

**ステップ**:
1. リポジトリをチェックアウト
2. Node.js 20をセットアップ
3. 依存関係をインストール
4. Expoをセットアップ
5. iOSビルドを実行
6. App Store Connect に自動提出
7. 成功/失敗を通知

---

## ✅ チェックリスト

提出前に確認：

- [ ] `EXPO_TOKEN` シークレットを設定
- [ ] `GEMINI_API_KEY` シークレットを設定
- [ ] `ADMOB_APP_ID` シークレットを設定
- [ ] `ADMOB_INTERSTITIAL_AD_UNIT_ID` シークレットを設定
- [ ] GitHub Actions ワークフローが表示されている
- [ ] `app.json` の Bundle ID が正しい
- [ ] `eas.json` の App ID が正しい

---

## 🎯 次のステップ

1. **シークレットを設定**
2. **ワークフローを実行** - Actions タブから手動トリガー
3. **ビルド完了を待つ** - 30〜45分
4. **App Store Connect で確認** - ビルドが表示されているか確認
5. **審査に提出** - App Store Connect で「Submit for Review」をクリック

---

**最終更新**: 2026年5月31日
