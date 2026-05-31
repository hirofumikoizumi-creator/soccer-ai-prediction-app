# API キーセットアップガイド

このファイルは、アプリを実行するために必要なAPIキーの設定方法を説明します。

## 🔑 必要なAPIキー

### 1. Google Gemini API キー

**取得方法:**
1. https://aistudio.google.com/app/apikey にアクセス
2. 「Create API Key」をクリック
3. 生成されたキーをコピー

**設定方法:**
```bash
export EXPO_PUBLIC_GEMINI_API_KEY="your_key_here"
```

---

### 2. Google AdMob IDs

**取得方法:**
1. https://admob.google.com にアクセス
2. 「広告ユニット」から新規作成
3. アプリIDと広告ユニットIDを取得

**設定方法:**
```bash
export EXPO_PUBLIC_ADMOB_APP_ID="your_app_id"
export EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID="your_ad_unit_id"
```

---

## 📋 本プロジェクトのAPIキー

### ✅ 既に取得済みのキー

#### Gemini API キー
```
AQ.Ab8RN6Lc3C0Xu96GsX2vNGUZpairrCq_nKE7gBITN-sB_wQBkw
```

#### AdMob App ID
```
ca-app-pub-5840457424714744-2343444534
```

#### AdMob インタースティシャル広告ユニット ID
```
ca-app-pub-5840457424714744/2994711458
```

---

## 🚀 開発環境での設定

### ステップ1: 環境変数を設定

```bash
cd /home/ubuntu/soccer-ai-prediction-app

export EXPO_PUBLIC_GEMINI_API_KEY="AQ.Ab8RN6Lc3C0Xu96GsX2vNGUZpairrCq_nKE7gBITN-sB_wQBkw"
export EXPO_PUBLIC_ADMOB_APP_ID="ca-app-pub-5840457424714744-2343444534"
export EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID="ca-app-pub-5840457424714744/2994711458"
```

### ステップ2: Expoサーバーを起動

```bash
npm start
```

### ステップ3: Expo Goでテスト

QRコードをスキャンしてアプリをプレビュー

---

## 🏢 本番環境での設定

### App Store提出時

EAS Buildで以下の環境変数を設定：

```bash
eas build --platform ios \
  --env EXPO_PUBLIC_GEMINI_API_KEY="your_key" \
  --env EXPO_PUBLIC_ADMOB_APP_ID="your_app_id" \
  --env EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID="your_ad_unit_id"
```

または、`eas.json`で設定：

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GEMINI_API_KEY": "your_key",
        "EXPO_PUBLIC_ADMOB_APP_ID": "your_app_id",
        "EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID": "your_ad_unit_id"
      }
    }
  }
}
```

---

## ⚠️ セキュリティ注意事項

### ❌ してはいけないこと

- ✗ APIキーをGitHubにコミットしない
- ✗ APIキーをコードに直接記述しない
- ✗ APIキーをスクリーンショットに写さない
- ✗ APIキーを他人と共有しない

### ✅ すべきこと

- ✓ 環境変数で管理する
- ✓ `.gitignore`に`.env`を追加
- ✓ 本番環境では別のキーを使用
- ✓ 定期的にキーをローテーション

---

## 🔄 キーのローテーション

APIキーが漏洩した場合：

1. **AdMob Console**で古いキーを削除
2. **新しいキーを生成**
3. **環境変数を更新**
4. **アプリを再ビルド**

---

## 📞 トラブルシューティング

### エラー: "Request failed with status code 400"

**原因**: APIキーが無効または設定されていない

**解決方法**:
1. APIキーが正しくコピーされているか確認
2. 環境変数が正しく設定されているか確認
3. Expoサーバーを再起動

```bash
# 環境変数の確認
echo $EXPO_PUBLIC_GEMINI_API_KEY

# サーバーの再起動
npm start -- --clear
```

### エラー: "AdMob not initialized"

**原因**: AdMob IDが設定されていない

**解決方法**:
1. AdMob IDが正しくコピーされているか確認
2. 環境変数を再設定
3. アプリをリロード

---

## 📚 参考リンク

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Google AdMob Documentation](https://admob.google.com/home)
- [Expo Environment Variables](https://docs.expo.dev/build-reference/variables/)

---

**最終更新**: 2026年5月31日
