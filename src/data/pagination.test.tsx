import { paginationWindow } from './pagination'

describe('paginationWindow', () => {
  it('returns nothing when there are no pages', () => {
    expect(paginationWindow(1, 0)).toEqual([])
    expect(paginationWindow(1, -3)).toEqual([])
  })

  it('lists every page without ellipses up to seven pages', () => {
    expect(paginationWindow(1, 1)).toEqual([1])
    expect(paginationWindow(2, 3)).toEqual([1, 2, 3])
    expect(paginationWindow(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('opens with a trailing ellipsis while the current page is near the start', () => {
    expect(paginationWindow(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 10])
    expect(paginationWindow(4, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 10])
  })

  it('switches to a leading ellipsis once the current page passes four', () => {
    expect(paginationWindow(5, 10)).toEqual([
      1,
      'ellipsis-start',
      4,
      5,
      6,
      'ellipsis-end',
      10,
    ])
  })

  it('collapses to a single leading ellipsis near the end', () => {
    expect(paginationWindow(7, 10)).toEqual([1, 'ellipsis-start', 6, 7, 8, 9, 10])
    expect(paginationWindow(10, 10)).toEqual([1, 'ellipsis-start', 6, 7, 8, 9, 10])
  })

  it('never hides just one page behind an ellipsis', () => {
    for (let pageCount = 8; pageCount <= 40; pageCount += 1) {
      for (let page = 1; page <= pageCount; page += 1) {
        const slots = paginationWindow(page, pageCount)

        slots.forEach((slot, index) => {
          if (typeof slot === 'number') return
          const before = slots[index - 1]
          const after = slots[index + 1]
          expect(typeof before).toBe('number')
          expect(typeof after).toBe('number')
          expect(Number(after) - Number(before) - 1).toBeGreaterThanOrEqual(2)
        })
      }
    }
  })

  it('keeps a stable width and always includes the current page', () => {
    for (let pageCount = 8; pageCount <= 40; pageCount += 1) {
      for (let page = 1; page <= pageCount; page += 1) {
        const slots = paginationWindow(page, pageCount)
        expect(slots).toHaveLength(7)
        expect(slots).toContain(page)
        expect(slots[0]).toBe(1)
        expect(slots.at(-1)).toBe(pageCount)
      }
    }
  })

  it('clamps a current page outside the range', () => {
    expect(paginationWindow(0, 10)).toEqual(paginationWindow(1, 10))
    expect(paginationWindow(99, 10)).toEqual(paginationWindow(10, 10))
  })
})
