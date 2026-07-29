import type { Args } from './types'

const SAFE_KEY = /^[a-zA-Z0-9_-]+$/

const LITERALS: Record<string, unknown> = {
  '!true': true,
  '!false': false,
  '!null': null,
  '!undefined': undefined,
}

const encodeValue = (value: unknown): string | null => {
  if (value === true) return '!true'
  if (value === false) return '!false'
  if (value === null) return '!null'
  if (value === undefined) return '!undefined'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string')
    return value.replace(
      /[%;:#&+?]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    )
  return null
}

const decodeValue = (raw: string): unknown => {
  if (Object.hasOwn(LITERALS, raw)) return LITERALS[raw]
  let text: string
  try {
    /* Percent-escapes are UTF-8 byte sequences once the browser has serialised
       the URL, so decoding them a byte at a time mangles anything non-ASCII. */
    text = decodeURIComponent(raw)
  } catch {
    text = raw
  }
  return /^-?\d*\.?\d+$/.test(text) ? Number(text) : text
}

export const encodeArgs = (initialArgs: Args, args: Args): string => {
  const parts: string[] = []
  for (const [key, value] of Object.entries(args)) {
    if (Object.is(value, initialArgs[key])) continue
    const encoded = encodeValue(value)
    if (encoded !== null) parts.push(`${key}:${encoded}`)
  }
  return parts.join(';')
}

export const decodeArgs = (param: string): Args => {
  const entries: [string, unknown][] = []
  for (const part of param.split(';')) {
    const split = part.indexOf(':')
    if (split < 1) continue
    const key = part.slice(0, split)
    if (SAFE_KEY.test(key)) entries.push([key, decodeValue(part.slice(split + 1))])
  }
  return Object.fromEntries(entries)
}

const rawParam = (search: string, key: string): string | null => {
  for (const pair of search.replace(/^[?#]/, '').split('&')) {
    const split = pair.indexOf('=')
    if (split > 0 && pair.slice(0, split) === key) return pair.slice(split + 1)
  }
  return null
}

export const readLocation = (search: string): { storyId: string | null; args: Args } => ({
  storyId: rawParam(search, 'story'),
  args: decodeArgs(rawParam(search, 'args') ?? ''),
})

export const writeLocation = (storyId: string, argsParam: string): string =>
  argsParam ? `?story=${storyId}&args=${argsParam}` : `?story=${storyId}`
