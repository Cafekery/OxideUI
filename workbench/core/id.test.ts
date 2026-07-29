import { describe, expect, it } from 'vitest'
import { sanitize, startCase, titleFromPath, toId } from './id'

describe('sanitize', () => {
  it('lowercases and collapses each run of punctuation into one dash', () => {
    expect(sanitize('Primitives/Button')).toBe('primitives-button')
    expect(sanitize('Foo  ///__Bar')).toBe('foo-bar')
  })

  it('trims leading and trailing dashes', () => {
    expect(sanitize('  /Data Display/  ')).toBe('data-display')
    expect(sanitize('---')).toBe('')
  })

  it('keeps digits', () => {
    expect(sanitize('Size 2XL')).toBe('size-2xl')
  })
})

describe('toId', () => {
  it('joins the sanitized title and export with a double dash', () => {
    expect(toId('Primitives/Button', 'Primary Large')).toBe(
      'primitives-button--primary-large',
    )
  })

  it('sanitizes the export verbatim, leaving camelCase splitting to the caller', () => {
    expect(toId('Primitives/Button', 'PrimaryLarge')).toBe(
      'primitives-button--primarylarge',
    )
    expect(toId('Primitives/Button', startCase('PrimaryLarge'))).toBe(
      'primitives-button--primary-large',
    )
  })

  it('keeps the separator distinguishable from sanitized punctuation runs', () => {
    const id = toId('A/B', 'C')
    expect(id).toBe('a-b--c')
    expect(id.split('--')).toHaveLength(2)
  })
})

describe('startCase', () => {
  it.each([
    ['primaryLarge', 'Primary Large'],
    ['WithIcon', 'With Icon'],
    ['size_2xl', 'Size 2xl'],
    ['Size2xl', 'Size 2xl'],
    ['Button2', 'Button 2'],
    ['with-dashes', 'With Dashes'],
    ['dot.separated', 'Dot Separated'],
    ['size2XL', 'Size 2 XL'],
  ])('%s -> %s', (input, expected) => {
    expect(startCase(input)).toBe(expected)
  })

  it('collapses repeated separators and trims', () => {
    expect(startCase('  foo__--bar  ')).toBe('Foo Bar')
  })
})

describe('titleFromPath', () => {
  it('derives a nested title from a category directory and basename', () => {
    expect(titleFromPath('src/primitives/button.stories.tsx')).toBe('Primitives/Button')
  })

  it('strips relative prefixes before the src segment', () => {
    expect(titleFromPath('../../src/data/filter-bar.stories.tsx')).toBe('Data/Filter Bar')
  })

  it('yields just the basename for a file directly under src', () => {
    expect(titleFromPath('src/overview.stories.tsx')).toBe('Overview')
  })

  it('strips the extension when there is no .stories segment', () => {
    expect(titleFromPath('src/forms/text-field.tsx')).toBe('Forms/Text Field')
  })
})
