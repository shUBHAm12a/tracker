import { useState, KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'
import { ColorCode } from '../../utils/constants'

interface TaskInputProps {
  onAdd: (text: string) => void
  colorCode: ColorCode
  placeholder?: string
}

const colorStyles = {
  yellow: 'bg-yellow-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  pink: 'bg-pink-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  red: 'bg-red-50',
  gray: 'bg-gray-50',
}

export function TaskInput({ onAdd, colorCode, placeholder = 'Add task...' }: TaskInputProps) {
  const [text, setText] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      onAdd(text.trim())
      setText('')
    }
  }

  return (
    <div className={`flex items-center gap-2 p-2.5 border-2 border-dashed border-gray-300 rounded-lg transition-all duration-200 ${colorStyles[colorCode]} hover:border-gray-400 hover:shadow-sm focus-within:border-gray-500 focus-within:shadow-md`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 transition-all duration-200 placeholder:text-gray-400"
      />
      <button
        onClick={() => {
          if (text.trim()) {
            onAdd(text.trim())
            setText('')
          }
        }}
        className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200 button-transition flex items-center justify-center"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
