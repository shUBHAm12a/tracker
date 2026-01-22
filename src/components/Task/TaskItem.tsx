import { Task as TaskType } from '../../utils/types'
import { Check, Trash2, GripVertical, Edit2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

interface TaskItemProps {
  task: TaskType
  onToggle: () => void
  onDelete: () => void
  onUpdate: (text: string) => void
  isDragging?: boolean
}

const colorStyles = {
  yellow: 'border-l-yellow-400 bg-yellow-50',
  blue: 'border-l-blue-400 bg-blue-50',
  green: 'border-l-green-400 bg-green-50',
  pink: 'border-l-pink-400 bg-pink-50',
  purple: 'border-l-purple-400 bg-purple-50',
  orange: 'border-l-orange-400 bg-orange-50',
  red: 'border-l-red-400 bg-red-50',
  gray: 'border-l-gray-400 bg-gray-50',
}

const isUrl = (text: string) => {
  try {
    new URL(text)
    return true
  } catch {
    return false
  }
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !task.text) {
      onDelete()
    }
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const isTaskUrl = isUrl(task.text)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2.5 p-2.5 border-l-4 rounded-lg transition-all duration-200 group ${
        colorStyles[task.colorCode]
      } ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:shadow-md'}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-600 transition-colors duration-200 button-transition flex-shrink-0"
      >
        <GripVertical size={18} />
      </button>
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 button-transition ${
          task.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-500 hover:shadow-sm'
        }`}
      >
        {task.completed && <Check size={15} />}
      </button>
      {isEditing || !isTaskUrl ? (
        <input
          type="text"
          value={task.text}
          onChange={(e) => onUpdate(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          autoFocus={isEditing}
          className={`flex-1 bg-transparent border-none outline-none text-sm transition-all duration-200 ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
          placeholder="Add task..."
        />
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <a
            href={task.text}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-sm transition-all duration-200 truncate ${
              task.completed ? 'line-through text-gray-400' : 'text-blue-600 hover:underline'
            }`}
          >
            {task.text}
          </a>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit link"
          >
            <Edit2 size={14} />
          </button>
        </div>
      )}
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-all duration-200 button-transition opacity-50 hover:opacity-100 flex-shrink-0"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
