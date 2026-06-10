import { useState } from 'react'

type Status = 'idle' | 'loading' | 'error' | 'success'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useWaitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function submit() {
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('https://berat.app/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), project: 'releasehub' }),
      })

      const data = await res.json() as { ok?: boolean; error?: string }

      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please try again.')
      }

      setEmail('')
      setStatus('success')
      setMessage("✓ You're on the list — we'll email you when Cloud opens.")
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
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
