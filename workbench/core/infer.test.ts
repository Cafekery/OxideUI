import { describe, expect, it } from 'vitest'
import { inferControls, isActionArg } from './infer'
import type { ArgType } from './types'

describe('isActionArg', () => {
  it('treats any function value as an action', () => {
    expect(isActionArg('submit', () => {})).toBe(true)
  })

  it('treats an on* prop name as an action even without a value', () => {
    expect(isActionArg('onClick', undefined)).toBe(true)
  })

  it('requires an uppercase letter after on', () => {
    expect(isActionArg('onboarding', 'yes')).toBe(false)
    expect(isActionArg('only', 1)).toBe(false)
  })

  it('is false for ordinary values', () => {
    expect(isActionArg('size', 'sm')).toBe(false)
  })
})

describe('inferControls', () => {
  const infer = (args: Record<string, unknown>, argTypes: Record<string, ArgType> = {}) =>
    inferControls(args, argTypes)

  it('infers boolean, number and text from the runtime value', () => {
    expect(infer({ disabled: true, count: 3, label: 'Save' })).toEqual({
      disabled: { control: 'boolean' },
      count: { control: 'number' },
      label: { control: 'text' },
    })
  })

  it('infers a colour control for a *color key holding a string', () => {
    expect(infer({ accentColor: '#ff0000', COLOR: 'red' })).toEqual({
      accentColor: { control: 'color' },
      COLOR: { control: 'color' },
    })
  })

  it('does not infer colour when the value is not a string', () => {
    expect(infer({ color: 2 })).toEqual({ color: { control: 'number' } })
  })

  it('infers select whenever the argType declares options, whatever the value is', () => {
    expect(
      infer(
        { size: 'sm', level: 2 },
        { size: { options: ['sm', 'lg'] }, level: { options: [1, 2] } },
      ),
    ).toEqual({
      size: { control: 'select', options: ['sm', 'lg'] },
      level: { control: 'select', options: [1, 2] },
    })
  })

  it('gives an on* prop no control and marks it disabled', () => {
    const controls = infer({ onClick: () => {}, label: 'Save' })

    expect(controls.onClick).toEqual({ disable: true })
    expect(controls.onClick?.control).toBeUndefined()
    expect(controls.label).toEqual({ control: 'text' })
  })

  it('marks a plain function value as an action too', () => {
    expect(infer({ format: (v: number) => String(v) })).toEqual({
      format: { disable: true },
    })
  })

  it('omits args with no inferable control', () => {
    expect(
      infer({ items: [1, 2], meta: { a: 1 }, nothing: null, missing: undefined }),
    ).toEqual({})
  })

  it('keeps an explicit control instead of inferring one', () => {
    expect(infer({ count: 3 }, { count: { control: 'text' } })).toEqual({
      count: { control: 'text' },
    })
  })

  it('covers argTypes-only keys that have no initial arg', () => {
    expect(
      infer(
        {},
        { variant: { options: ['a', 'b'] }, note: { description: 'no control' } },
      ),
    ).toEqual({
      variant: { control: 'select', options: ['a', 'b'] },
    })
  })

  it('preserves the rest of the argType alongside the inferred control', () => {
    expect(infer({ label: 'Save' }, { label: { description: 'Button text' } })).toEqual({
      label: { description: 'Button text', control: 'text' },
    })
  })

  it('does not mutate the argTypes it was given', () => {
    const argTypes: Record<string, ArgType> = { label: { description: 'Button text' } }
    inferControls({ label: 'Save' }, argTypes)

    expect(argTypes).toEqual({ label: { description: 'Button text' } })
  })
})
