import type { Args, ArgType, ControlKind } from './types'

export const isActionArg = (name: string, value: unknown): boolean =>
  typeof value === 'function' || /^on[A-Z]/.test(name)

const inferControl = (
  name: string,
  value: unknown,
  argType: ArgType,
): ControlKind | null => {
  if (Array.isArray(argType.options)) return 'select'
  if (typeof value === 'string') return /color$/i.test(name) ? 'color' : 'text'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return null
}

export const inferControls = (
  initialArgs: Args,
  argTypes: Record<string, ArgType>,
): Record<string, ArgType> => {
  const controls: Record<string, ArgType> = {}

  for (const name of new Set([...Object.keys(initialArgs), ...Object.keys(argTypes)])) {
    const argType = argTypes[name] ?? {}
    const value = initialArgs[name]

    if (isActionArg(name, value)) {
      controls[name] = { ...argType, disable: true }
      continue
    }

    const control = argType.control ?? inferControl(name, value, argType)
    if (control) controls[name] = { ...argType, control }
  }

  return controls
}
