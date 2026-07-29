import { useCallback, useState } from 'react'

export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const controlled = value !== undefined

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next)
      onChange?.(next)
    },
    [controlled, onChange],
  )

  return [controlled ? value : internal, set]
}
