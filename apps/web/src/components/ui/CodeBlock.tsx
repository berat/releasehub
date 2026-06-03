import { useState } from 'react'
import type { ReactNode } from 'react'

interface CodeBlockProps {
  children: ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const pre = (e.currentTarget.parentElement as HTMLElement).querySelector('pre')
    if (!pre) return
    navigator.clipboard?.writeText(pre.innerText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <div className="code">
      <button className="copy-code" type="button" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>{children}</pre>
    </div>
  )
}

export function C({ children }: { children: ReactNode }) {
  return <span className="cmt">{children}</span>
}

export function T({ children }: { children: ReactNode }) {
  return <span className="tok">{children}</span>
}
