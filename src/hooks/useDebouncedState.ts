import { debounce } from 'lodash-es'
import { useMemo, useState } from 'react'

export function useDebouncedState<T>(
  initialValue: T,
  delay = 400,
): [value: T, debouncedValue: T, setValue: (value: T) => void] {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)

  const setDebounced = useMemo(() => debounce(setDebouncedValue, delay), [delay])

  function set(next: T) {
    setValue(next)
    setDebounced(next)
  }

  return [value, debouncedValue, set]
}
