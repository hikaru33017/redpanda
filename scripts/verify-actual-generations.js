// ブラウザコンソール出力を模擬するスクリプト

const ANCESTOR_PANDAS = [
  { id: 'keikei', name: '慶慶', parentIds: [] },
  { id: 'shushu', name: '秀秀', parentIds: [] },
  { id: 'panpan', name: '胖胖', parentIds: [] },
  // 簡略版: 主要な個体のみ
  { id: 'matsuba', name: 'まつば', parentIds: ['sakura', 'lili'] },
  { id: 'mocchi', name: 'モッチー', parentIds: ['yanyan2', 'kirari'] },
  { id: 'niko', name: 'ニーコ', parentIds: ['mocchi', 'matsuba'] },
  { id: 'kanoko', name: 'かのこ', parentIds: ['himari', 'nico'] },
  { id: 'sakura', name: 'サクラ', parentIds: [] },  // 仮
  { id: 'lili', name: 'リーリー', parentIds: [] },  // 仮
  { id: 'yanyan2', name: 'ヤンヤン', parentIds: [] },  // 仮
  { id: 'kirari', name: 'キラリ', parentIds: [] },  // 仮
  { id: 'himari', name: 'ヒマリ', parentIds: [] },  // 仮
  { id: 'nico', name: 'ニコ', parentIds: [] },  // 仮
];

function calculateGeneration(pandaId, pandas) {
  const panda = pandas.find(p => p.id === pandaId);
  if (!panda || panda.parentIds.length === 0) {
    return 0;
  }
  const parentGenerations = panda.parentIds.map(parentId => calculateGeneration(parentId, pandas));
  return Math.max(...parentGenerations) + 1;
}

console.log('=== 簡易検証（親情報が不完全な状態） ===\n');
console.log('慶慶:', calculateGeneration('keikei', ANCESTOR_PANDAS));
console.log('秀秀:', calculateGeneration('shushu', ANCESTOR_PANDAS));
console.log('胖胖:', calculateGeneration('panpan', ANCESTOR_PANDAS));
console.log('まつば:', calculateGeneration('matsuba', ANCESTOR_PANDAS));
console.log('モッチー:', calculateGeneration('mocchi', ANCESTOR_PANDAS));
console.log('ニーコ:', calculateGeneration('niko', ANCESTOR_PANDAS));
console.log('かのこ:', calculateGeneration('kanoko', ANCESTOR_PANDAS));

console.log('\n⚠️ この結果は不正確です。親情報が途中で途切れているためです。');
console.log('実際のancestorPandaData.tsで確認する必要があります。');
