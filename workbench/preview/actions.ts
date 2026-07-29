import { type ActionEvent, type Args, type ArgType, isActionArg } from '../core'

const MAX_DEPTH = 3
const MAX_STRING = 120
const MAX_ITEMS = 8

/** A handler argument is usually a SyntheticEvent: cyclic, BigInt-capable and
 *  full of DOM nodes, so every branch here has to terminate on its own. */
function describe(value: unknown, depth: number, seen: WeakSet<object>): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') {
    return JSON.stringify(
      value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…` : value,
    )
  }
  if (typeof value === 'bigint') return `${String(value)}n`
  if (typeof value === 'function') return `ƒ ${value.name || 'anonymous'}`
  if (typeof value !== 'object') return String(value)

  if (seen.has(value)) return '[Circular]'
  if ('tagName' in value && typeof value.tagName === 'string') {
    // Only a DOM node carries a string `tagName`; nothing else is read unchecked.
    const el = value as Element
    const id = el.id ? `#${el.id}` : ''
    const classes =
      typeof el.className === 'string'
        ? el.className.split(/\s+/).filter(Boolean).slice(0, 2)
        : []
    return `<${el.tagName.toLowerCase()}${id}${classes.map((c) => `.${c}`).join('')}>`
  }
  if (value instanceof Event || 'nativeEvent' in value) {
    const type = 'type' in value ? value.type : undefined
    return `Event(${typeof type === 'string' ? type : 'unknown'})`
  }
  seen.add(value)

  if (Array.isArray(value)) {
    if (depth === MAX_DEPTH) return `Array(${value.length})`
    const items = value.slice(0, MAX_ITEMS).map((item) => describe(item, depth + 1, seen))
    if (value.length > MAX_ITEMS) items.push(`+${value.length - MAX_ITEMS} more`)
    return `[${items.join(', ')}]`
  }

  const keys = Object.keys(value)
  if (keys.length === 0) return '{}'
  if (depth === MAX_DEPTH) return '{…}'
  const entries = keys
    .slice(0, MAX_ITEMS)
    .map((key) => `${key}: ${describe((value as Args)[key], depth + 1, seen)}`)
  if (keys.length > MAX_ITEMS) entries.push(`+${keys.length - MAX_ITEMS} more`)
  return `{ ${entries.join(', ')} }`
}

let sequence = 0

/** Replaces every action arg with a reporting proxy that still calls — and
 *  returns — whatever the story supplied, so formatter args keep working. */
export function wrapActions(args: Args, argTypes: Record<string, ArgType>): Args {
  const wrapped: Args = { ...args }
  for (const name of new Set([...Object.keys(args), ...Object.keys(argTypes)])) {
    const original = args[name]
    if (!isActionArg(name, original)) continue
    wrapped[name] = (...called: unknown[]) => {
      const event: ActionEvent = {
        id: `${name}-${++sequence}`,
        name,
        args: called.map((value) => describe(value, 0, new WeakSet())),
        at: Date.now(),
      }
      window.parent.__oxideChrome?.onAction(event)
      return typeof original === 'function'
        ? (original as (...a: unknown[]) => unknown)(...called)
        : undefined
    }
  }
  return wrapped
}
