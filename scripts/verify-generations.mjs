import { getAllPandas, calculateGeneration, groupByGeneration } from '../lib/familyTree.ts'

console.log('=== 世代計算検証 ===\n')

const allPandas = getAllPandas()
console.log(`総個体数: ${allPandas.length}頭\n`)

// 創設メンバー（慶慶・秀秀・胖胖）の世代を確認
const keikei = allPandas.find(p => p.id === 'keikei')
const shushu = allPandas.find(p => p.id === 'shushu')
const panpan = allPandas.find(p => p.id === 'panpan')

console.log('=== 創設メンバー（1984年生まれ） ===')
if (keikei) {
  console.log(`慶慶: generation ${calculateGeneration('keikei', allPandas)}, parentIds:`, keikei.parentIds)
} else {
  console.log('慶慶: データなし')
}
if (shushu) {
  console.log(`秀秀: generation ${calculateGeneration('shushu', allPandas)}, parentIds:`, shushu.parentIds)
} else {
  console.log('秀秀: データなし')
}
if (panpan) {
  console.log(`胖胖: generation ${calculateGeneration('panpan', allPandas)}, parentIds:`, panpan.parentIds)
} else {
  console.log('胖胖: データなし')
}

console.log('\n=== 現在の個体（2013年以降生まれ） ===')
const light = allPandas.find(p => p.id === 'light')
const kanoko = allPandas.find(p => p.id === 'kanoko')
const matsuba = allPandas.find(p => p.id === 'matsuba')
const mocchi = allPandas.find(p => p.id === 'mocchi')

if (light) {
  console.log(`ライト(2013): generation ${calculateGeneration('light', allPandas)}, parentIds:`, light.parentIds)
}
if (kanoko) {
  console.log(`かのこ(2016): generation ${calculateGeneration('kanoko', allPandas)}, parentIds:`, kanoko.parentIds)
}
if (matsuba) {
  console.log(`まつば(2014): generation ${calculateGeneration('matsuba', allPandas)}, parentIds:`, matsuba.parentIds)
}
if (mocchi) {
  console.log(`モッチー(2015): generation ${calculateGeneration('mocchi', allPandas)}, parentIds:`, mocchi.parentIds)
}

console.log('\n=== 各世代の個体数分布 ===')
const generationMap = groupByGeneration(allPandas)
const maxGeneration = Math.max(...Array.from(generationMap.keys()))

for (let gen = 0; gen <= maxGeneration; gen++) {
  const genPandas = generationMap.get(gen) || []
  const sample = genPandas.slice(0, 5).map(p => `${p.name}(${new Date(p.birthDate).getFullYear()}年生)`).join(', ')
  console.log(`第${gen + 1}世代 (generation=${gen}): ${genPandas.length}頭`)
  if (sample) {
    console.log(`  例: ${sample}`)
  }
}

console.log('\n=== 期待される分布（公式データ、全188頭） ===')
console.log('第1世代: 3頭（秀秀・慶慶・胖胖）')
console.log('第2世代: 11頭')
console.log('第3世代: 24頭')
console.log('...')
console.log('第11世代: 2頭')
console.log('\n※現在のデータは77頭のため、比率的に近い分布になるはずです')
