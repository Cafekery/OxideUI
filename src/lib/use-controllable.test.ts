import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useControllable } from './use-controllable'

describe('useControllable', () => {
  it('tracks its own state when uncontrolled', () => {
    const { result } = renderHook(() => useControllable<string>(undefined, 'a'))

    act(() => result.current[1]('b'))

    expect(result.current[0]).toBe('b')
  })

  it('ignores internal updates when controlled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllable<string>('a', 'a', onChange))

    act(() => result.current[1]('b'))

    expect(result.current[0]).toBe('a')
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('reports changes in both modes', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllable<string>(undefined, 'a', onChange))

    act(() => result.current[1]('b'))

    expect(result.current[0]).toBe('b')
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('follows the controlled value when the prop changes', () => {
    const { result, rerender } = renderHook(({ value }) => useControllable(value, 'a'), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'c' })

    expect(result.current[0]).toBe('c')
  })
})
