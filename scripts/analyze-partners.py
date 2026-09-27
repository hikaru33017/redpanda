#!/usr/bin/env python3
import re
import json

# ancestorPandaData.tsを読み込み
with open('lib/ancestorPandaData.ts', 'r') as f:
    ancestor_content = f.read()

# pandaData.tsを読み込み
with open('lib/pandaData.ts', 'r') as f:
    panda_content = f.read()

# 個体データを抽出
pandas = []

# ancestorPandaData.tsからパース
pattern = r"id:\s*'([^']+)'.*?name:\s*'([^']+)'.*?parentIds:\s*\[(.*?)\].*?partnerIds:\s*\[(.*?)\]"
for match in re.finditer(pattern, ancestor_content, re.DOTALL):
    panda_id = match.group(1)
    name = match.group(2)
    parent_ids_str = match.group(3)
    partner_ids_str = match.group(4)

    parent_ids = []
    if parent_ids_str.strip():
        parent_ids = [p.strip().strip('"').strip("'") for p in parent_ids_str.split(',')]

    partner_ids = []
    if partner_ids_str.strip():
        partner_ids = [p.strip().strip('"').strip("'") for p in partner_ids_str.split(',')]

    pandas.append({
        'id': panda_id,
        'name': name,
        'parentIds': parent_ids,
        'partnerIds': partner_ids,
        'source': 'ancestor'
    })

# pandaData.tsからパース（重複をスキップ）
existing_ids = {p['id'] for p in pandas}
for match in re.finditer(pattern, panda_content, re.DOTALL):
    panda_id = match.group(1)
    if panda_id in existing_ids:
        continue

    name = match.group(2)
    parent_ids_str = match.group(3)
    partner_ids_str = match.group(4)

    parent_ids = []
    if parent_ids_str.strip():
        parent_ids = [p.strip().strip('"').strip("'") for p in parent_ids_str.split(',')]

    partner_ids = []
    if partner_ids_str.strip():
        partner_ids = [p.strip().strip('"').strip("'") for p in partner_ids_str.split(',')]

    pandas.append({
        'id': panda_id,
        'name': name,
        'parentIds': parent_ids,
        'partnerIds': partner_ids,
        'source': 'current'
    })

pandas_dict = {p['id']: p for p in pandas}

# 世代計算
def calculate_generation(panda_id, pandas_dict):
    if panda_id not in pandas_dict:
        return 0
    panda = pandas_dict[panda_id]
    if not panda['parentIds']:
        return 0
    parent_gens = [calculate_generation(pid, pandas_dict) for pid in panda['parentIds']]
    return max(parent_gens) + 1

# 世代ごとにグループ化
generation_map = {}
for panda in pandas:
    gen = calculate_generation(panda['id'], pandas_dict)
    if gen not in generation_map:
        generation_map[gen] = []
    generation_map[gen].append(panda)

max_gen = max(generation_map.keys())

print('=== パートナー関係の調査 ===\n')

total_pairs = 0
same_gen_pairs = 0
cross_gen_pairs = 0

for gen in sorted(generation_map.keys()):
    gen_pandas = generation_map[gen]

    # この世代でpartnerIdsを持つ個体
    pandas_with_partners = [p for p in gen_pandas if p['partnerIds']]

    if not pandas_with_partners:
        continue

    print(f"\n第{gen + 1}世代 (generation {gen}): {len(gen_pandas)}頭")
    print(f"  パートナー情報あり: {len(pandas_with_partners)}頭")

    # ペアを数える（重複排除）
    counted = set()
    same_gen = 0
    cross_gen = 0

    for panda in pandas_with_partners:
        for partner_id in panda['partnerIds']:
            # 既にカウント済みのペアはスキップ
            pair_key = '-'.join(sorted([panda['id'], partner_id]))
            if pair_key in counted:
                continue
            counted.add(pair_key)

            if partner_id not in pandas_dict:
                print(f"  ⚠️  {panda['name']}のパートナー{partner_id}が見つかりません")
                continue

            partner = pandas_dict[partner_id]
            partner_gen = calculate_generation(partner_id, pandas_dict)

            if partner_gen == gen:
                same_gen += 1
                print(f"  ✅ {panda['name']} ❤️ {partner['name']} (同世代)")
            else:
                cross_gen += 1
                print(f"  ⚠️  {panda['name']} (gen {gen}) ❤️ {partner['name']} (gen {partner_gen}) (世代差: {abs(gen - partner_gen)})")

    total_pairs += same_gen + cross_gen
    same_gen_pairs += same_gen
    cross_gen_pairs += cross_gen

    print(f"  → 同世代ペア: {same_gen}組（ハート表示される）")
    print(f"  → 異世代ペア: {cross_gen}組（ハート表示されない）")

print('\n=== 集計結果 ===')
print(f'全パートナー関係: {total_pairs}組')
print(f'  同世代ペア: {same_gen_pairs}組 (ハートマーク表示✅)')
print(f'  異世代ペア: {cross_gen_pairs}組 (ハートマーク未表示⚠️)')
print(f'\n問題: {cross_gen_pairs}組のパートナー関係がハートマークで表示されていません')
