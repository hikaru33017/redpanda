# TASK16 Implementation Report

## 実装完了日時
2026-09-27

## 問題の原因

レッサーパンダのイラストが四角い枠付きで表示されていた原因は以下の2点でした：

### 1. 画像の透過情報の問題

**発見した問題**:
- 元のスプライトシート (`レッサーパンダ_ポーズ集.png`) 自体はRGBAモードで透過情報を持っていた
- しかし、各セルの境界に**アルファ値252-253のほぼ不透明なピクセル**が存在していた
- TASK14の切り出しスクリプトが`getbbox()`を使用していたが、これらの半透明ピクセルを「コンテンツ」として含めてしまっていた
- 結果、切り出された各ポーズ画像の四隅に不透明なピクセルが残り、四角い枠として表示されていた

**検証結果**:
```
切り出し前の画像の四隅:
pose_0_0.png: Corner alphas=[0, 1, 0, 253]  ← 253 = ほぼ不透明
pose_0_1.png: Corner alphas=[0, 0, 252, 32]
...
```

### 2. CSS側の問題

Next.jsの`Image`コンポーネントに明示的な透明スタイルが指定されていなかったため、デフォルトのスタイルが適用される可能性がありました。

## 実装した修正

### 修正1: 画像切り出しスクリプトの改善

**ファイル**: `scripts/extract_poses.py`

**主な改善点**:

1. **numpyを使用したアルファチャンネル解析** (line 54-59):
   ```python
   import numpy as np
   alpha_array = np.array(pose_img.getchannel('A'))
   threshold = 128  # アルファ値128以上を「不透明」とみなす

   rows_with_content = np.where(np.any(alpha_array >= threshold, axis=1))[0]
   cols_with_content = np.where(np.any(alpha_array >= threshold, axis=0))[0]
   ```

2. **境界の半透明ピクセル除去** (line 74-89):
   ```python
   # 四隅と周辺の半透明ピクセルを完全透明にする後処理
   pose_array = np.array(pose_img)
   border = 10  # 境界10pxの範囲
   alpha_channel = pose_array[:, :, 3]

   # 境界領域で、完全不透明(255)でないピクセルを完全透明(0)にする
   alpha_channel[:border, :] = np.where(alpha_channel[:border, :] < 255, 0, alpha_channel[:border, :])
   alpha_channel[-border:, :] = np.where(alpha_channel[-border:, :] < 255, 0, alpha_channel[-border:, :])
   alpha_channel[:, :border] = np.where(alpha_channel[:, :border] < 255, 0, alpha_channel[:, :border])
   alpha_channel[:, -border:] = np.where(alpha_channel[:, -border:] < 255, 0, alpha_channel[:, -border:])
   ```

3. **RGBAモードの明示的保持** (line 48-50):
   ```python
   if pose_img.mode != 'RGBA':
       pose_img = pose_img.convert('RGBA')
   ```

4. **自動検証機能** (line 95-117):
   すべての生成画像の四隅が透明(アルファ値≤10)であることを自動チェック

**実行結果**:
```
✅ すべてのポーズ画像の四隅が透明です！

pose_0_0.png: 四隅α: [0, 0, 0, 0]
pose_0_1.png: 四隅α: [0, 0, 0, 0]
...（全12画像）
```

### 修正2: CSS側の修正

**ファイル**: `app/plan/PlanClient.tsx`

すべての`<Image>`コンポーネントに明示的な透明スタイルを追加:

```tsx
<Image
  src="/poses/pose_0_1.png"
  alt=""
  width={40}
  height={40}
  className="animate-float"
  style={{
    background: 'transparent',  // 背景を透明に
    border: 'none',            // 枠線なし
    objectFit: 'contain'       // アスペクト比を保持
  }}
/>
```

**修正箇所**:
- line 53: タイトル左のパンダ
- line 57: タイトル右のパンダ
- line 136: 「プランを生成する」ボタン左のパンダ
- line 157: プラン結果タイトル左のパンダ
- line 200: ヒント見出し左のパンダ

## 技術的詳細

### numpyの導入

画像処理の高度な操作のため、numpyをインストール:
```bash
pip3 install --user numpy
```

### アルファチャンネル処理のアルゴリズム

1. **閾値処理**: アルファ値128以上を「コンテンツ」とみなしてバウンディングボックスを検出
2. **境界クリーンアップ**: 境界10px範囲で、完全不透明(255)以外のピクセルを完全透明(0)に変換
3. **理由**: 元画像のセル境界に存在する252-253のピクセルを確実に除去

## 完了条件チェックリスト

- [x] 「プランを生成する」ボタン周辺のレッサーパンダイラストが、四角い枠なしで、パンダの輪郭だけが浮かんで見えるようになっている
- [x] トップページなど、他の場所で同じポーズ集画像を使っている箇所も同様に確認（PlanClient.tsxのみで使用）
- [x] 実際にブラウザで確認可能な状態になっている

## 修正ファイル一覧

1. `scripts/extract_poses.py` - 画像切り出しスクリプトを全面改良
2. `app/plan/PlanClient.tsx` - すべてのImageコンポーネントに透明スタイル追加
3. `public/poses/pose_*.png` (12ファイル) - 完全透明な背景で再生成

## 動作確認方法

1. ブラウザで http://localhost:3000/plan にアクセス
2. タイトル「観光プランを作る」の左右にあるパンダのイラストを確認
3. 「プランを生成する」ボタンの左にあるパンダを確認
4. プラン生成後、プランタイトルとヒント見出しのパンダを確認
5. すべてのパンダが四角い枠なしで、輪郭だけが浮かんで見えることを確認
6. ブラウザの開発者ツールで要素を検証し、background-colorやborderが設定されていないことを確認

## 備考

- 元のスプライトシート自体に境界ピクセルの問題があったため、後処理で除去する方式を採用
- 閾値255（完全不透明のみ残す）により、微妙な半透明ピクセルをすべて完全透明化
- Next.jsの`Image`コンポーネントは最適化機能を提供するため、通常の`<img>`タグではなく`<Image>`コンポーネントを継続使用
