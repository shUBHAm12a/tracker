export const COLOR_OPTIONS = [
  { name: 'Yellow', code: 'yellow' },
  { name: 'Blue', code: 'blue' },
  { name: 'Green', code: 'green' },
  { name: 'Pink', code: 'pink' },
  { name: 'Purple', code: 'purple' },
  { name: 'Orange', code: 'orange' },
  { name: 'Red', code: 'red' },
  { name: 'Gray', code: 'gray' },
] as const

export const DEFAULT_LISTS = [
  { name: 'Brain Dump', colorCode: 'yellow' },
  { name: 'Grocery List', colorCode: 'blue' },
  { name: 'To Buy', colorCode: 'green' },
  { name: 'To Read', colorCode: 'pink' },
] as const

export const STORAGE_KEYS = {
  TASKS: 'apptracker_tasks',
  LISTS: 'apptracker_lists',
  CURRENT_WEEK: 'apptracker_current_week',
} as const

export type ColorCode = typeof COLOR_OPTIONS[number]['code']
