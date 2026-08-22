import { describe, it, expect } from 'vitest'
import { generateTourPlan } from '../lib/tourPlanGenerator'

describe('generateTourPlan', () => {
  it('generates a plan with a title including duration', () => {
    const plan = generateTourPlan({ duration: 3, groupSize: 2, interests: ['nature'] })
    expect(plan.title).toContain('3時間')
  })

  it('generates a plan with activities', () => {
    const plan = generateTourPlan({ duration: 4, groupSize: 2, interests: ['lesser_panda'] })
    expect(plan.activities.length).toBeGreaterThan(0)
  })

  it('includes lesser panda activities when interest is selected', () => {
    const plan = generateTourPlan({ duration: 5, groupSize: 3, interests: ['lesser_panda'] })
    const hasPandaActivity = plan.activities.some((a) => a.category === 'lesser_panda')
    expect(hasPandaActivity).toBe(true)
  })

  it('includes meal activity for plans 3 hours or longer', () => {
    const plan = generateTourPlan({ duration: 3, groupSize: 2, interests: ['nature', 'history'] })
    const hasMeal = plan.activities.some((a) => a.category === 'meal')
    expect(hasMeal).toBe(true)
  })

  it('does not exceed total available time', () => {
    const plan = generateTourPlan({ duration: 2, groupSize: 2, interests: ['nature', 'lesser_panda'] })
    const totalMinutes = plan.activities.reduce((sum, a) => sum + a.duration, 0)
    expect(totalMinutes).toBeLessThanOrEqual(2 * 60)
  })

  it('assigns time strings to all activities', () => {
    const plan = generateTourPlan({ duration: 4, groupSize: 2, interests: ['nature'] })
    for (const activity of plan.activities) {
      expect(activity.time).toMatch(/^\d{2}:\d{2}$/)
    }
  })

  it('includes tips array', () => {
    const plan = generateTourPlan({ duration: 3, groupSize: 2, interests: ['nature'] })
    expect(Array.isArray(plan.tips)).toBe(true)
    expect(plan.tips.length).toBeGreaterThan(0)
  })

  it('puts lesser panda activities first when selected', () => {
    const plan = generateTourPlan({ duration: 6, groupSize: 2, interests: ['nature', 'lesser_panda'] })
    const firstNonMeal = plan.activities.find((a) => a.category !== 'meal')
    expect(firstNonMeal?.category).toBe('lesser_panda')
  })
})
