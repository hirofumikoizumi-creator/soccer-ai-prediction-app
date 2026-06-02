# iOS アプリメモリ最適化ガイド

## 概要

このドキュメントは、Jetsam によるメモリ制限違反によるクラッシュを解決するための最適化ガイドです。

---

## 1. 実施した最適化

### 1.1 不要なライブラリの削除

**削除したライブラリ:**
- `expo-glass-effect` - 使用されていなかった
- `@react-native-camera-roll/camera-roll` - 使用されていなかった

**効果:**
- バイナリサイズ削減
- 起動時のモジュール読み込み削減

**実行コマンド:**
```bash
npm uninstall expo-glass-effect @react-native-camera-roll/camera-roll
```

### 1.2 遅延読み込み（Lazy Loading）の実装

**新しいファイル:**
- `src/utils/lazyImageLoader.ts` - 画像の遅延読み込みユーティリティ
- `src/services/appInitializationService.ts` - アプリ初期化サービス

**特徴:**
- 起動時に画像を読み込まない
- 必要な時点で画像をメモリに読み込む
- 画像キャッシング機能

**使用例:**
```typescript
import { useLazyImage } from '@/utils/lazyImageLoader';

const logoImage = useLazyImage('expo-logo', require('@/assets/images/expo-logo.png'));
```

### 1.3 起動処理の非同期化

**変更内容:**
- `src/app/_layout.tsx` で `scheduleDeferredInitialization()` を呼び出し
- 起動後 500ms で重要なリソースをプリロード
- 起動後 1500ms で補助的なリソースをプリロード

**効果:**
- アプリ起動時のメモリ使用量を削減
- UI の応答性を向上

### 1.4 EAS Build 設定の最適化

**変更内容:**
- `eas.json` に Node.js バージョンを明示
- 環境変数を明示的に指定
- iOS ビルドタイプを `archive` に設定

---

## 2. バイナリサイズ削減のための Xcode 設定

### 2.1 推奨される Build Settings

以下の設定は EAS Build で自動的に適用されます。ローカルビルドの場合は手動で設定してください。

| 設定項目 | 推奨値 | 効果 |
|---------|--------|------|
| **Optimization Level** | `-Os` (Optimize for Size) | バイナリサイズを最小化 |
| **Strip Linked Product** | YES | デバッグシンボルを削除 |
| **Dead Code Stripping** | YES | 未使用コードを削除 |
| **Link-Time Optimization** | YES | リンク時最適化を有効化 |
| **Generate Debug Symbols** | NO (Release) | デバッグシンボルを生成しない |

### 2.2 Xcode での設定方法

1. Xcode でプロジェクトを開く
2. **Build Settings** タブを選択
3. 検索バーで各設定項目を検索
4. 推奨値に変更

### 2.3 EAS Build での自動最適化

EAS Build は以下を自動的に実行します:
- Release ビルドの生成
- デバッグシンボルの削除
- 最適化フラグの適用

---

## 3. メモリ使用量の監視

### 3.1 Instruments での計測

1. Xcode で **Product** → **Profile** を選択
2. **Memory** インストルメントを選択
3. アプリを起動して メモリ使用量を監視

### 3.2 主要なメモリ使用ポイント

| ポイント | メモリ使用量 | 最適化方法 |
|---------|------------|---------|
| **アプリ起動時** | < 50MB | 遅延読み込み |
| **ホーム画面表示** | < 100MB | 画像の圧縮 |
| **画像処理** | < 200MB | バッチ処理 |

---

## 4. 画像最適化

### 4.1 現在の画像サイズ

| ファイル | サイズ | 推奨サイズ |
|---------|--------|----------|
| `icon.png` | 781KB | 256KB |
| `logo-glow.png` | 324KB | 100KB |
| `android-icon-foreground.png` | 77KB | 40KB |

### 4.2 画像圧縮ツール

```bash
# ImageMagick を使用した圧縮
convert icon.png -quality 85 icon-optimized.png

# または TinyPNG/TinyJPG を使用
```

### 4.3 推奨される画像フォーマット

- **PNG**: ロゴ、アイコン（透過が必要な場合）
- **JPEG**: 写真、複雑な画像
- **WebP**: Web 用（iOS では限定的）

---

## 5. ライブラリ最適化

### 5.1 使用中のライブラリ

| ライブラリ | 用途 | バイナリサイズ |
|-----------|------|-------------|
| `react-native-reanimated` | アニメーション | 大 |
| `react-native-google-mobile-ads` | 広告 | 中 |
| `expo-image-picker` | 画像選択 | 小 |

### 5.2 ライブラリ削減の検討

以下のライブラリは削除を検討してください:
- 使用されていないプラグイン
- 代替ライブラリで置き換え可能なもの

---

## 6. 起動処理の最適化

### 6.1 現在の起動フロー

```
1. アプリ起動
2. RootLayout (_layout.tsx) 初期化
3. scheduleDeferredInitialization() 呼び出し
4. ホーム画面表示
5. 500ms 後: 重要なリソースをプリロード
6. 1500ms 後: 補助的なリソースをプリロード
```

### 6.2 起動時に実行される処理

**起動時（同期）:**
- React Native の初期化
- ルーター設定
- テーマ設定

**遅延実行（非同期）:**
- 画像プリロード
- 分析サービス初期化
- キャッシュ準備

---

## 7. トラブルシューティング

### 7.1 アプリがまだクラッシュする場合

1. **Instruments で計測**
   - メモリ使用量を確認
   - メモリリークがないか確認

2. **ビルドログを確認**
   - EAS Build のログで警告を確認
   - リンクエラーがないか確認

3. **デバイスの再起動**
   - iOS デバイスを再起動
   - キャッシュをクリア

### 7.2 メモリリークの検出

```typescript
// React DevTools で計測
import { Profiler } from 'react';

<Profiler id="app" onRender={onRenderCallback}>
  <App />
</Profiler>
```

---

## 8. 次のステップ

### 8.1 推奨される改善

1. **画像の圧縮**
   - `icon.png` を 256KB に圧縮
   - `logo-glow.png` を 100KB に圧縮

2. **Code Splitting**
   - 大きなコンポーネントを分割
   - 動的インポートを活用

3. **バンドルサイズの分析**
   ```bash
   npm install -g source-map-explorer
   source-map-explorer 'dist/**/*.js'
   ```

### 8.2 監視と計測

- 定期的に Instruments で計測
- GitHub Actions で自動計測
- ユーザーフィードバックを収集

---

## 9. 参考資料

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Expo Optimization](https://docs.expo.dev/guides/optimizing-your-app/)
- [iOS Memory Management](https://developer.apple.com/documentation/os/memory_management)

---

## 10. チェックリスト

- [ ] 不要なライブラリを削除
- [ ] 遅延読み込みを実装
- [ ] 起動処理を非同期化
- [ ] 画像を圧縮
- [ ] EAS Build 設定を最適化
- [ ] Instruments で計測
- [ ] GitHub Actions で再ビルド
- [ ] TestFlight でテスト
- [ ] App Store に提出

---

**最終更新:** 2026-06-02
**バージョン:** 6
