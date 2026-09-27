import { getAllPandas, calculateGeneration } from '../lib/familyTree.js';

const allPandas = getAllPandas();

// generation 0 の個体を全てリストアップ
const gen0Pandas = allPandas.filter(p => calculateGeneration(p.id, allPandas) === 0);

console.log('=== generation 0 の全個体（' + gen0Pandas.length + '頭） ===\n');

gen0Pandas.forEach(p => {
  const year = new Date(p.birthDate).getFullYear();
  const source = p.isCurrentResident ? 'pandaData.ts' : 'ancestorPandaData.ts';
  console.log(`${p.id.padEnd(20)} ${p.name.padEnd(25)} ${year}年生 parentIds: ${JSON.stringify(p.parentIds).padEnd(30)} (${source})`);
});

console.log('\n✅ 正解: 第1世代は慶慶・秀秀・胖胖の3頭のみであるべき');
console.log('❌ 問題: ' + (gen0Pandas.length - 3) + '頭が余分に generation 0 になっている');

console.log('\n=== 余分な個体の詳細 ===');
const extraPandas = gen0Pandas.filter(p => !['keikei', 'shushu', 'panpan'].includes(p.id));
extraPandas.forEach(p => {
  console.log(`\n【${p.name}】`);
  console.log(`  ID: ${p.id}`);
  console.log(`  生年: ${p.birthDate}`);
  console.log(`  birthPlace: ${p.birthPlace || 'なし'}`);
  console.log(`  parentIds: ${JSON.stringify(p.parentIds)}`);
  console.log(`  isCurrentResident: ${p.isCurrentResident}`);
  console.log(`  データソース: ${p.isCurrentResident ? 'pandaData.ts' : 'ancestorPandaData.ts'}`);
});
