import { useWaitlist } from '@/hooks/useWaitlist'

interface WaitlistFormProps {
  labelText?: string
  buttonText?: string
}

export function WaitlistForm({ labelText = 'Join the waitlist', buttonText = 'Join' }: WaitlistFormProps) {
  const { email, status, message, submit, handleKeyDown, handleChange } = useWaitlist()

  return (
    <div className="waitlist">
      <label className="wl-label" htmlFor="wlEmail">{labelText}</label>
      <div className="wl-row">
        <input
          id="wlEmail"
          className={`wl-input${status === 'error' ? ' invalid' : ''}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={status === 'success'}
          aria-describedby="wlMsg"
        />
        <button
          type="button"
          className="btn btn-acc wl-btn"
          onClick={submit}
          disabled={status === 'success'}
        >
          {status === 'success' ? 'Added' : buttonText}
        </button>
      </div>
      {message && (
        <p id="wlMsg" className={`wl-msg ${status}`} aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}
