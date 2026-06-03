import { useState } from 'react'

type Status = 'idle' | 'error' | 'success'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useWaitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  function submit() {
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    // TODO: wire up real API endpoint
    setEmail('')
    setStatus('success')
    setMessage("✓ You're on the list — we'll email you when Cloud opens.")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') submit()
  }

  function handleChange(value: string) {
    setEmail(value)
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
  }

  return { email, status, message, submit, handleKeyDown, handleChange }
}
