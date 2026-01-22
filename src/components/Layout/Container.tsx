import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-3 py-3">
      {children}
    </div>
  )
}
