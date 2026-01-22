import { STORAGE_KEYS } from './constants'

export const storage = {
  get<T>(key: keyof typeof STORAGE_KEYS, defaultValue: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key])
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage:`, error)
      return defaultValue
    }
  },

  set<T>(key: keyof typeof STORAGE_KEYS, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage:`, error)
    }
  },

  remove(key: keyof typeof STORAGE_KEYS): void {
    try {
      localStorage.removeItem(STORAGE_KEYS[key])
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
    }
  },
}
