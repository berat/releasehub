import { useState, useEffect } from 'react'

const CMD = 'npm install -g @releasehub/cli'

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

// Global toast trigger — basit event bus
export function showCopiedToast() {
  window.dispatchEvent(new CustomEvent('releasehub:copied'))
}

interface CopyCommandProps {
  className?: string
}

export function CopyCommand({ className }: CopyCommandProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CMD)
      setCopied(true)
      showCopiedToast()
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = CMD
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      showCopiedToast()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      className={`copy-cmd${copied ? ' copied' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleCopy}
      aria-label="Copy install command"
      title="Copy to clipboard"
    >
      <code>{CMD}</code>
      <span className="copy-cmd-icon">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </button>
  )
}

export function CopiedToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => {
      setVisible(true)
      setTimeout(() => setVisible(false), 2200)
    }
    window.addEventListener('releasehub:copied', handler)
    return () => window.removeEventListener('releasehub:copied', handler)
  }, [])

  return (
    <div className={`copied-toast${visible ? ' visible' : ''}`} role="status" aria-live="polite">
      <CheckIcon />
      Copied!
    </div>
  )
}
