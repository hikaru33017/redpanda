import { getAllPandas, calculateGeneration } from '../lib/familyTree.js';

const allPandas = getAllPandas();

// 世代ごとにグループ化
const generationMap = new Map();
allPandas.forEach(panda => {
  const gen = calculateGeneration(panda.id, allPandas);
  if (!generationMap.has(gen)) {
    generationMap.set(gen, []);
  }
  generationMap.get(gen).push(panda);
});

const maxGen = Math.max(...Array.from(generationMap.keys()));

console.log('=== パートナー関係の調査 ===\n');

let totalPairs = 0;
let sameGenPairs = 0;
let crossGenPairs = 0;

for (let gen = 0; gen <= maxGen; gen++) {
  const genPandas = generationMap.get(gen) || [];

  // この世代でpartnerIdsを持つ個体
  const pandasWithPartners = genPandas.filter(p => p.partnerIds && p.partnerIds.length > 0);

  if (pandasWithPartners.length === 0) continue;

  console.log(`\n第${gen + 1}世代 (generation ${gen}): ${genPandas.length}頭`);
  console.log(`  パートナー情報あり: ${pandasWithPartners.length}頭`);

  // ペアを数える（重複排除）
  const counted = new Set();
  let sameGen = 0;
  let crossGen = 0;

  pandasWithPartners.forEach(panda => {
    panda.partnerIds.forEach(partnerId => {
      // 既にカウント済みのペアはスキップ
      const pairKey = [panda.id, partnerId].sort().join('-');
      if (counted.has(pairKey)) return;
      counted.add(pairKey);

      const partner = allPandas.find(p => p.id === partnerId);
      if (!partner) {
        console.log(`  ⚠️  ${panda.name}のパートナー${partnerId}が見つかりません`);
        return;
      }

      const partnerGen = calculateGeneration(partnerId, allPandas);

      if (partnerGen === gen) {
        sameGen++;
        console.log(`  ✅ ${panda.name} ❤️ ${partner.name} (同世代)`);
      } else {
        crossGen++;
        console.log(`  ⚠️  ${panda.name} (gen ${gen}) ❤️ ${partner.name} (gen ${partnerGen}) (世代差: ${Math.abs(gen - partnerGen)})`);
      }
    });
  });

  totalPairs += sameGen + crossGen;
  sameGenPairs += sameGen;
  crossGenPairs += crossGen;

  console.log(`  → 同世代ペア: ${sameGen}組（ハート表示される）`);
  console.log(`  → 異世代ペア: ${crossGen}組（ハート表示されない）`);
}

console.log('\n=== 集計結果 ===');
console.log(`全パートナー関係: ${totalPairs}組`);
console.log(`  同世代ペア: ${sameGenPairs}組 (ハートマーク表示✅)`);
console.log(`  異世代ペア: ${crossGenPairs}組 (ハートマーク未表示⚠️)`);
console.log(`\n問題: ${crossGenPairs}組のパートナー関係がハートマークで表示されていません`);
