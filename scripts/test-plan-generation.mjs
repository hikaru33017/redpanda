// Test script for TASK15 plan generation verification
import { generateTourPlan } from '../lib/tourPlanGenerator.ts'

console.log('\n==============================================')
console.log('TASK15 Plan Generation Test')
console.log('==============================================\n')

// Test 1: 1時間 × 子供と遊ぶ
console.log('\n【テスト1】1時間 × 子供と遊ぶ')
console.log('----------------------------------------------')
const test1 = generateTourPlan({
  duration: 1,
  groupSize: 2,
  interests: ['family'],
  startHour: 9
})
console.log('\n生成されたプラン:', test1.title)
console.log('スポット数:', test1.activities.length)
console.log('スポット:', test1.activities.map(a => `${a.title}(${a.duration}分)`).join(', '))
const total1 = test1.activities.reduce((sum, a) => sum + a.duration, 0)
console.log('合計時間:', total1, '分 / 60分 (', Math.round(total1/60*100), '%)')
console.log('✓ 重複なし:', new Set(test1.activities.map(a => a.title)).size === test1.activities.length)
console.log('✓ 80%以上:', total1 >= 60 * 0.8)
console.log('✓ 1件以上:', test1.activities.length >= 1)

// Test 2: 2時間 × 子供と遊ぶ・レッサーパンダの癒し
console.log('\n【テスト2】2時間 × 子供と遊ぶ・レッサーパンダの癒し')
console.log('----------------------------------------------')
const test2 = generateTourPlan({
  duration: 2,
  groupSize: 2,
  interests: ['family', 'lesser_panda'],
  startHour: 9
})
console.log('\n生成されたプラン:', test2.title)
console.log('スポット数:', test2.activities.length)
console.log('スポット:', test2.activities.map(a => `${a.title}(${a.duration}分)`).join(', '))
const total2 = test2.activities.reduce((sum, a) => sum + a.duration, 0)
console.log('合計時間:', total2, '分 / 120分 (', Math.round(total2/120*100), '%)')
console.log('✓ 重複なし:', new Set(test2.activities.map(a => a.title)).size === test2.activities.length)
console.log('✓ 80%以上:', total2 >= 120 * 0.8, `(必要: ${120*0.8}分以上)`)

// Test 3: 4時間 × 家族・パワースポット・レッサーパンダの癒し
console.log('\n【テスト3】4時間 × 家族・パワースポット・レッサーパンダの癒し')
console.log('----------------------------------------------')
const test3 = generateTourPlan({
  duration: 4,
  groupSize: 2,
  interests: ['family', 'power_spot', 'lesser_panda'],
  startHour: 9
})
console.log('\n生成されたプラン:', test3.title)
console.log('スポット数:', test3.activities.length)
console.log('スポット:', test3.activities.map(a => `${a.title}(${a.duration}分)`).join(', '))
const total3 = test3.activities.reduce((sum, a) => sum + a.duration, 0)
console.log('合計時間:', total3, '分 / 240分 (', Math.round(total3/240*100), '%)')
console.log('✓ 重複なし:', new Set(test3.activities.map(a => a.title)).size === test3.activities.length)
console.log('✓ 80%以上:', total3 >= 240 * 0.8, `(必要: ${240*0.8}分以上)`)

// Test 4: 16:00開始 × 2時間（営業時間ギリギリ）
console.log('\n【テスト4】16:00開始 × 2時間（営業時間テスト）')
console.log('----------------------------------------------')
const test4 = generateTourPlan({
  duration: 2,
  groupSize: 2,
  interests: ['lesser_panda'],
  startHour: 16
})
console.log('\n生成されたプラン:', test4.title)
console.log('スポット数:', test4.activities.length)
console.log('スポット:', test4.activities.map(a => `${a.time} ${a.title}(${a.duration}分)`).join(', '))
const hasZoo = test4.activities.some(a => a.title === '西山動物園')
console.log('✓ 西山動物園が含まれるか:', hasZoo)
if (hasZoo) {
  const zooActivity = test4.activities.find(a => a.title === '西山動物園')
  const [hour, min] = zooActivity.time.split(':').map(Number)
  const endMin = hour * 60 + min + zooActivity.duration
  console.log('  開始時刻:', zooActivity.time, '終了予定:', `${Math.floor(endMin/60)}:${String(endMin%60).padStart(2, '0')}`)
  console.log('  営業終了時刻: 16:30')
  console.log('  ✓ 営業時間内:', endMin <= 990)
}

console.log('\n==============================================')
console.log('全テスト完了')
console.log('==============================================\n')
