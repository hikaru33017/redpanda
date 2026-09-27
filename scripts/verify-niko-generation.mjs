import { getAllPandas, calculateGeneration } from '../lib/familyTree.js';

const allPandas = getAllPandas();

// ニーコ、まつば、モッチーを探す
const niko = allPandas.find(p => p.id === 'niko');
const matsuba = allPandas.find(p => p.id === 'matsuba');
const mocchi = allPandas.find(p => p.id === 'mocchi');

console.log('=== まつば・モッチー・ニーコの世代計算 ===\n');

if (matsuba) {
  const gen = calculateGeneration('matsuba', allPandas);
  console.log(`まつば: generation ${gen}, parentIds: ${JSON.stringify(matsuba.parentIds)}, birthDate: ${matsuba.birthDate}`);
}

if (mocchi) {
  const gen = calculateGeneration('mocchi', allPandas);
  console.log(`モッチー: generation ${gen}, parentIds: ${JSON.stringify(mocchi.parentIds)}, birthDate: ${mocchi.birthDate}`);
}

if (niko) {
  const gen = calculateGeneration('niko', allPandas);
  console.log(`ニーコ: generation ${gen}, parentIds: ${JSON.stringify(niko.parentIds)}, birthDate: ${niko.birthDate}`);
}

console.log('\n=== 期待される結果 ===');
console.log('公式資料: ニーコは第8世代（generation 7）');
console.log('したがって: まつば・モッチーは第7世代（generation 6）であるべき');

// まつばの親チェーンを辿る
console.log('\n=== まつばの親チェーン ===');
if (matsuba && matsuba.parentIds.length > 0) {
  let currentIds = matsuba.parentIds;
  let depth = 0;
  console.log(`第0世代（本人）: まつば`);

  while (currentIds.length > 0 && depth < 10) {
    depth++;
    console.log(`第${depth}世代上の親: ${currentIds.join(', ')}`);

    const nextIds = [];
    for (const parentId of currentIds) {
      const parent = allPandas.find(p => p.id === parentId);
      if (parent && parent.parentIds.length > 0) {
        nextIds.push(...parent.parentIds);
      }
    }
    currentIds = nextIds;
  }
  console.log(`まつばから${depth}世代遡った`);
}

// モッチーの親チェーンを辿る
console.log('\n=== モッチーの親チェーン ===');
if (mocchi && mocchi.parentIds.length > 0) {
  let currentIds = mocchi.parentIds;
  let depth = 0;
  console.log(`第0世代（本人）: モッチー`);

  while (currentIds.length > 0 && depth < 10) {
    depth++;
    console.log(`第${depth}世代上の親: ${currentIds.join(', ')}`);

    const nextIds = [];
    for (const parentId of currentIds) {
      const parent = allPandas.find(p => p.id === parentId);
      if (parent && parent.parentIds.length > 0) {
        nextIds.push(...parent.parentIds);
      }
    }
    currentIds = nextIds;
  }
  console.log(`モッチーから${depth}世代遡った`);
}
