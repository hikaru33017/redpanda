#!/usr/bin/env python3
# ancestorPandaData.tsから実際のデータを読み取って世代計算を実行

import re
import json

# ancestorPandaData.tsを読み込み
with open('lib/ancestorPandaData.ts', 'r') as f:
    content = f.read()

# 個体データを抽出（簡易パース）
pandas = []
pattern = r"id:\s*'([^']+)'.*?name:\s*'([^']+)'.*?parentIds:\s*\[(.*?)\]"

for match in re.finditer(pattern, content, re.DOTALL):
    panda_id = match.group(1)
    name = match.group(2)
    parent_ids_str = match.group(3)

    # parentIdsを解析
    parent_ids = []
    if parent_ids_str.strip():
        parent_ids = [p.strip().strip('"').strip("'") for p in parent_ids_str.split(',')]

    pandas.append({
        'id': panda_id,
        'name': name,
        'parentIds': parent_ids
    })

print(f'読み込んだ個体数: {len(pandas)}頭\n')

# 世代計算
def calculate_generation(panda_id, pandas_dict):
    if panda_id not in pandas_dict:
        return 0  # 見つからない場合は0

    panda = pandas_dict[panda_id]
    if not panda['parentIds']:
        return 0

    parent_gens = [calculate_generation(pid, pandas_dict) for pid in panda['parentIds']]
    return max(parent_gens) + 1

# 辞書化
pandas_dict = {p['id']: p for p in pandas}

# 確認対象
targets = [
    ('keikei', '慶慶'),
    ('shushu', '秀秀'),
    ('panpan', '胖胖'),
    ('matsuba', 'まつば'),
    ('mocchi', 'モッチー'),
    ('niko', 'ニーコ'),
    ('kanoko', 'かのこ'),
]

print('=== 家系図デバッグ（実際のデータ） ===\n')
print('=== 第1世代（創設メンバー） ===')
for panda_id, name in targets[:3]:
    if panda_id in pandas_dict:
        gen = calculate_generation(panda_id, pandas_dict)
        parent_ids = pandas_dict[panda_id]['parentIds']
        print(f'{name}: generation {gen}, parentIds: {parent_ids}')

print('\n=== 現在の個体 ===')
for panda_id, name in targets[3:]:
    if panda_id in pandas_dict:
        gen = calculate_generation(panda_id, pandas_dict)
        parent_ids = pandas_dict[panda_id]['parentIds']
        print(f'{name}: generation {gen}, parentIds: {parent_ids}')

# generation 0の個体を全てリスト
print('\n=== generation 0 の全個体 ===')
gen0 = [(p['id'], p['name']) for p in pandas if calculate_generation(p['id'], pandas_dict) == 0]
print(f'合計: {len(gen0)}頭')
for pid, name in gen0[:20]:  # 最初の20頭
    print(f'  {pid:20s} {name}')
if len(gen0) > 20:
    print(f'  ... 他{len(gen0) - 20}頭')
