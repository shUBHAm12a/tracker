import { ColorCode } from './constants'

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
  date: string | null
  listId: string | null
  colorCode: ColorCode
  order: number
  notes?: string
}

export interface List {
  id: string
  name: string
  colorCode: ColorCode
  order: number
}

export interface AppState {
  tasks: Task[]
  lists: List[]
  currentWeekStart: string
  viewMode: 'week' | 'day'
}
