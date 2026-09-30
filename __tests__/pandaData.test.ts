import { describe, it, expect } from 'vitest'
import { LESSER_PANDAS, KEEPER_DIARIES, PANDA_BLOGS } from '../lib/pandaData'

describe('LESSER_PANDAS', () => {
  it('has 13 pandas from open data', () => {
    expect(LESSER_PANDAS.length).toBe(13)
  })

  it('each panda has required fields', () => {
    for (const panda of LESSER_PANDAS) {
      expect(panda.id).toBeTruthy()
      expect(panda.name).toBeTruthy()
      expect(panda.gender).toMatch(/^(male|female)$/)
      expect(panda.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('parent ids reference existing pandas', () => {
    const ids = LESSER_PANDAS.map((p) => p.id)
    for (const panda of LESSER_PANDAS) {
      for (const parentId of panda.parentIds) {
        expect(ids).toContain(parentId)
      }
    }
  })

  it('partner ids reference existing pandas', () => {
    const ids = LESSER_PANDAS.map((p) => p.id)
    for (const panda of LESSER_PANDAS) {
      if (panda.partnerId) {
        expect(ids).toContain(panda.partnerId)
      }
    }
  })

  it('includes known pandas from CSV open data', () => {
    const names = LESSER_PANDAS.map((p) => p.name)
    expect(names).toContain('ミンファ')
    expect(names).toContain('キラリ')
    expect(names).toContain('ライト')
    expect(names).toContain('まつば')
    expect(names).toContain('モッチー')
    expect(names).toContain('ティアラ')
    expect(names).toContain('かのこ')
    expect(names).toContain('かんた')
    expect(names).toContain('ニーコ')
    expect(names).toContain('かえで')
  })

  it('kaede has correct parents from open data', () => {
    const kaede = LESSER_PANDAS.find((p) => p.id === 'kaede')
    expect(kaede?.parentIds).toContain('light')
    expect(kaede?.parentIds).toContain('kanoko')
  })

  it('niko and reifa are twins (same birthdate and parents)', () => {
    const niko = LESSER_PANDAS.find((p) => p.id === 'niko')
    const reifa = LESSER_PANDAS.find((p) => p.id === 'reifa')
    expect(niko?.birthDate).toBe(reifa?.birthDate)
    expect(niko?.parentIds.sort()).toEqual(reifa?.parentIds.sort())
  })
})

describe('KEEPER_DIARIES', () => {
  it('has at least 1 diary', () => {
    expect(KEEPER_DIARIES.length).toBeGreaterThanOrEqual(1)
  })

  it('each diary has a date and content', () => {
    for (const diary of KEEPER_DIARIES) {
      expect(diary.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(diary.content).toBeTruthy()
    }
  })

  it('diary panda ids reference valid pandas', () => {
    const ids = LESSER_PANDAS.map((p) => p.id)
    for (const diary of KEEPER_DIARIES) {
      for (const pandaId of diary.pandaIds) {
        expect(ids).toContain(pandaId)
      }
    }
  })
})

describe('PANDA_BLOGS', () => {
  it('each blog references a valid panda id', () => {
    const pandaIds = LESSER_PANDAS.map((p) => p.id)
    for (const blog of PANDA_BLOGS) {
      expect(pandaIds).toContain(blog.pandaId)
    }
  })
})
