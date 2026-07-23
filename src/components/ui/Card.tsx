import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
