import { useEffect, useState } from 'react'
import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'

export function useLocalStorage<T>(key: keyof typeof STORAGE_KEYS, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    return storage.get(key, defaultValue)
  })

  useEffect(() => {
    storage.set(key, value)
  }, [key, value])

  return [value, setValue] as const
}
