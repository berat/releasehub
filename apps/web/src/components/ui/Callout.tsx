import type { CSSProperties, ReactNode } from 'react'

interface CalloutProps {
  children: ReactNode
  style?: CSSProperties
}

export function Callout({ children, style }: CalloutProps) {
  return (
    <div className="callout" style={style}>
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      <p>{children}</p>
    </div>
  )
}
