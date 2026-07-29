import { describe, expect, it } from 'vitest'
import type { Args } from './types'
import { decodeArgs, encodeArgs, readLocation, writeLocation } from './url'

describe('encodeArgs', () => {
  const initial: Args = { size: 'sm', count: 1, disabled: false }

  it('yields an empty string when nothing changed', () => {
    expect(encodeArgs(initial, { ...initial })).toBe('')
  })

  it('serialises only the keys that differ from the initial args', () => {
    expect(encodeArgs(initial, { ...initial, size: 'lg' })).toBe('size:lg')
  })

  it('encodes booleans, null and undefined as bang literals', () => {
    expect(
      encodeArgs(
        { a: false, b: true, c: 'x', d: 1 },
        { a: true, b: false, c: null, d: undefined },
      ),
    ).toBe('a:!true;b:!false;c:!null;d:!undefined')
  })

  it('treats an undefined value as unchanged when the initial arg is absent', () => {
    expect(encodeArgs({}, { d: undefined })).toBe('')
  })

  it('writes numbers bare', () => {
    expect(encodeArgs({}, { count: 42, ratio: -0.5 })).toBe('count:42;ratio:-0.5')
  })

  it('percent-encodes the delimiters and the escape character in strings', () => {
    expect(encodeArgs({}, { label: 'a;b:c%d' })).toBe('label:a%3Bb%3Ac%25d')
  })

  it('percent-encodes characters that are structural in a url', () => {
    expect(encodeArgs({}, { tintColor: '#ff8800' })).toBe('tintColor:%23ff8800')
    expect(encodeArgs({}, { children: 'A&B' })).toBe('children:A%26B')
    expect(encodeArgs({}, { q: 'a?b+c' })).toBe('q:a%3Fb%2Bc')
  })

  it('skips function values even when they differ from the initial arg', () => {
    expect(encodeArgs({ onClick: () => {} }, { onClick: () => {}, size: 'lg' })).toBe(
      'size:lg',
    )
  })

  it('skips values with no representation', () => {
    expect(encodeArgs({}, { items: [1, 2], meta: { a: 1 } })).toBe('')
  })
})

describe('decodeArgs', () => {
  it('returns an empty object for an empty param', () => {
    expect(decodeArgs('')).toEqual({})
  })

  it('decodes bang literals back to their primitives', () => {
    const args = decodeArgs('a:!true;b:!false;c:!null;d:!undefined')

    expect(args).toEqual({ a: true, b: false, c: null, d: undefined })
    expect(Object.hasOwn(args, 'd')).toBe(true)
  })

  it('decodes numeric-looking values to numbers', () => {
    expect(decodeArgs('count:42;ratio:-0.5;label:v2')).toEqual({
      count: 42,
      ratio: -0.5,
      label: 'v2',
    })
  })

  it('drops keys outside the allow-list', () => {
    expect(decodeArgs('ok-1:a;ok_1:b;bad key:c;also.bad:d;:e')).toEqual({
      'ok-1': 'a',
      ok_1: 'b',
    })
  })

  it('drops parts with no separator', () => {
    expect(decodeArgs('lonely;size:lg')).toEqual({ size: 'lg' })
  })

  it('keeps a colon inside a value once the key has been split off', () => {
    expect(decodeArgs('label:a%3Ab')).toEqual({ label: 'a:b' })
  })

  it('does not resolve prototype keys as bang literals', () => {
    expect(decodeArgs('label:constructor')).toEqual({ label: 'constructor' })
  })
})

describe('encodeArgs / decodeArgs round trip', () => {
  it('survives booleans, null, numbers and delimiter-laden strings', () => {
    const initial: Args = { size: 'sm' }
    const args: Args = {
      size: 'lg',
      disabled: true,
      loading: false,
      empty: null,
      count: 7,
      ratio: -1.25,
      label: 'a;b:c%d',
    }

    const decoded = decodeArgs(encodeArgs(initial, args))

    expect(decoded).toEqual(args)
  })
})

describe('readLocation', () => {
  it('returns a null story id and no args for an empty search', () => {
    expect(readLocation('')).toEqual({ storyId: null, args: {} })
  })

  it('reads the story id and decodes the args param', () => {
    expect(
      readLocation('?story=primitives-button--primary&args=size:lg;disabled:!true'),
    ).toEqual({
      storyId: 'primitives-button--primary',
      args: { size: 'lg', disabled: true },
    })
  })

  it('reads a search string given without the leading question mark', () => {
    expect(readLocation('story=a--b').storyId).toBe('a--b')
  })

  it('ignores unrelated params and a missing args param', () => {
    expect(readLocation('?theme=light&story=a--b')).toEqual({ storyId: 'a--b', args: {} })
  })
})

describe('writeLocation', () => {
  it('omits the args param when the encoded diff is empty', () => {
    expect(writeLocation('primitives-button--primary', '')).toBe(
      '?story=primitives-button--primary',
    )
  })

  it('includes the args param when there is a diff', () => {
    expect(writeLocation('primitives-button--primary', 'size:lg')).toBe(
      '?story=primitives-button--primary&args=size:lg',
    )
  })

  it('round-trips through readLocation', () => {
    const initial: Args = { size: 'sm', disabled: false }
    const args: Args = { size: 'lg', disabled: true }
    const search = writeLocation('primitives-button--primary', encodeArgs(initial, args))

    expect(readLocation(search)).toEqual({ storyId: 'primitives-button--primary', args })
  })

  it('survives the browser splitting the url, which a raw codec round-trip would miss', () => {
    const args: Args = {
      tintColor: '#ff8800',
      children: 'A&B',
      q: 'a?b+c',
      label: 'x;y:z%w',
    }
    const search = writeLocation('primitives-button--primary', encodeArgs({}, args))
    const url = new URL(`https://gallery.test/${search}`)

    expect(url.hash).toBe('')
    expect(readLocation(url.search)).toEqual({
      storyId: 'primitives-button--primary',
      args,
    })
  })
})
