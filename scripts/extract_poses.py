#!/usr/bin/env python3
"""
レッサーパンダのポーズ集画像から個別のポーズを切り出すスクリプト
透過情報を正しく保持するように改良
"""

from PIL import Image
import os
import numpy as np

# 入力画像のパス（修正: .png.png -> .png）
input_path = '/Users/hikaru/redpanda/my-app/public/mascot/レッサーパンダ_ポーズ集.png'
output_dir = '/Users/hikaru/redpanda/my-app/public/poses'

# 出力ディレクトリの作成
os.makedirs(output_dir, exist_ok=True)

# 画像を読み込む
img = Image.open(input_path)
print(f"画像サイズ: {img.size}")
print(f"画像モード: {img.mode}")

# RGBAに変換（既にRGBAでも、念のため）
if img.mode != 'RGBA':
    img = img.convert('RGBA')
    print("RGBA モードに変換しました")

# 画像全体を3x4のグリッドに分けて主要なポーズを抽出
width, height = img.size
grid_rows = 3
grid_cols = 4
cell_width = width // grid_cols
cell_height = height // grid_rows

poses_extracted = []

print("\nポーズを切り出し中...")

for row in range(grid_rows):
    for col in range(grid_cols):
        x = col * cell_width
        y = row * cell_height

        # セルを切り出す
        box = (x, y, x + cell_width, y + cell_height)
        pose_img = img.crop(box)

        # 必ずRGBAで処理
        if pose_img.mode != 'RGBA':
            pose_img = pose_img.convert('RGBA')

        # アルファチャンネルを使って、実際のコンテンツがある部分を検出
        # アルファ値が一定以上（128以上）のピクセルを「不透明」とみなす
        alpha_array = np.array(pose_img.getchannel('A'))
        threshold = 128  # アルファ値の閾値

        # 不透明なピクセルの位置を検出
        rows_with_content = np.where(np.any(alpha_array >= threshold, axis=1))[0]
        cols_with_content = np.where(np.any(alpha_array >= threshold, axis=0))[0]

        if len(rows_with_content) > 0 and len(cols_with_content) > 0:
            # バウンディングボックスを計算
            # 境界の半透明ピクセルを除外するため、内側にシュリンクする
            shrink = 3  # 境界から3px内側に切り詰める
            min_row = min(alpha_array.shape[0] - 1, rows_with_content[0] + shrink)
            max_row = max(min_row + 1, rows_with_content[-1] + 1 - shrink)
            min_col = min(alpha_array.shape[1] - 1, cols_with_content[0] + shrink)
            max_col = max(min_col + 1, cols_with_content[-1] + 1 - shrink)

            # 実際のコンテンツがある部分だけに切り出し
            bbox = (min_col, min_row, max_col, max_row)
            pose_img = pose_img.crop(bbox)

            # 四隅と周辺の半透明ピクセルを完全透明にする後処理
            pose_array = np.array(pose_img)
            h, w = pose_array.shape[:2]

            # 境界10pxの範囲で、完全不透明(255)でないピクセルを完全透明(0)にする
            border = 10
            alpha_channel = pose_array[:, :, 3]

            # 上下左右の境界領域で、255未満のアルファ値を0にする
            alpha_channel[:border, :] = np.where(alpha_channel[:border, :] < 255, 0, alpha_channel[:border, :])
            alpha_channel[-border:, :] = np.where(alpha_channel[-border:, :] < 255, 0, alpha_channel[-border:, :])
            alpha_channel[:, :border] = np.where(alpha_channel[:, :border] < 255, 0, alpha_channel[:, :border])
            alpha_channel[:, -border:] = np.where(alpha_channel[:, -border:] < 255, 0, alpha_channel[:, -border:])

            pose_array[:, :, 3] = alpha_channel
            pose_img = Image.fromarray(pose_array, 'RGBA')

            # ファイル名を生成
            filename = f'pose_{row}_{col}.png'
            output_path = os.path.join(output_dir, filename)

            # PNG形式で保存（RGBAモードを保持）
            pose_img.save(output_path, 'PNG')
            poses_extracted.append(filename)

            # 四隅の透明度を確認
            w, h = pose_img.size
            corners = [
                pose_img.getpixel((0, 0)),
                pose_img.getpixel((w-1, 0)),
                pose_img.getpixel((0, h-1)),
                pose_img.getpixel((w-1, h-1))
            ]
            alphas = [c[3] for c in corners]

            print(f"✓ {filename} を保存 (サイズ: {pose_img.size}, 四隅α: {alphas})")

print(f"\n合計 {len(poses_extracted)} 個のポーズを抽出しました")

# 最終確認: すべての画像の四隅が透明かチェック
print("\n透明度の最終チェック:")
all_transparent = True
for pose in poses_extracted:
    img_check = Image.open(os.path.join(output_dir, pose))
    w, h = img_check.size
    corners = [
        img_check.getpixel((0, 0))[3],
        img_check.getpixel((w-1, 0))[3],
        img_check.getpixel((0, h-1))[3],
        img_check.getpixel((w-1, h-1))[3]
    ]
    max_alpha = max(corners)
    if max_alpha > 10:  # 10以下なら実質透明とみなす
        print(f"  ⚠ {pose}: 四隅の最大α値 = {max_alpha} (透明でない可能性)")
        all_transparent = False
    else:
        print(f"  ✓ {pose}: 四隅すべて透明")

if all_transparent:
    print("\n✅ すべてのポーズ画像の四隅が透明です！")
else:
    print("\n⚠️ 一部の画像に不透明な四隅があります。閾値や範囲を調整してください。")
