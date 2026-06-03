import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useNavScroll } from '@/hooks/useNavScroll'
import { useGitHubStars } from '@/hooks/useGitHubStars'
import { Logo } from '@/components/ui/Logo'

const NAV_LINKS = [
  { to: '/#flow',       label: 'How it works', hash: 'flow'       },
  { to: '/#understand', label: 'AI understanding', hash: 'understand' },
  { to: '/#outputs',    label: 'Outputs',      hash: 'outputs'    },
  { to: '/#vs',         label: 'vs GitHub',    hash: 'vs'         },
  { to: '/docs',        label: 'Docs',         hash: null          },
  { to: '/changelog',   label: 'Changelog',    hash: null, highlight: true },
]

interface NavCta {
  label: string
  to: string
}

const CTA_BY_PATH: Record<string, NavCta> = {
  '/':          { label: 'Get started', to: '/docs' },
  '/waitlist':  { label: 'Get started', to: '/docs' },
  '/roadmap':   { label: 'Get started', to: '/docs' },
  '/docs':      { label: 'Get started', to: '/docs' },
  '/changelog': { label: 'Get started', to: '/docs' },
}

function useHashScroll() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (hash: string, onDone?: () => void) => {
    const scrollTo = () => {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      onDone?.()
    }

    if (pathname === '/') {
      scrollTo()
    } else {
      navigate('/')
      // Ana sayfanın render'lanması için kısa bekle
      setTimeout(scrollTo, 80)
    }
  }
}

export function Nav() {
  const scrolled = useNavScroll()
  const { pathname } = useLocation()
  const stars = useGitHubStars('berat/releasehub')
  const [menuOpen, setMenuOpen] = useState(false)
  const cta = CTA_BY_PATH[pathname] ?? CTA_BY_PATH['/']
  const scrollToHash = useHashScroll()

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const renderLink = (to: string, label: string, hash: string | null | undefined, highlight?: boolean, extraClass?: string, onClose?: () => void) => {
    if (hash) {
      return (
        <a
          key={to}
          href={`#${hash}`}
          className={extraClass}
          onClick={(e) => { e.preventDefault(); scrollToHash(hash, onClose) }}
        >
          {label}
        </a>
      )
    }
    return highlight
      ? (
        <Link key={to} to={to} className={`nav-changelog${extraClass ? ` ${extraClass}` : ''}`} onClick={onClose}>
          <span className="nav-changelog-dot" />
          {label}
        </Link>
      )
      : <Link key={to} to={to} className={extraClass} onClick={onClose}>{label}</Link>
  }

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav-inner">
          <Logo />

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map(({ to, label, hash, highlight }) =>
              renderLink(to, label, hash, highlight)
            )}
          </nav>

          <div className="nav-cta">
            <a className="nav-star" href="https://github.com/berat/releasehub" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2z" />
              </svg>
              <b>Star</b>
              {stars && <span className="nav-star-count">{stars}</span>}
            </a>

            <Link className="btn btn-acc nav-cta-btn" to={cta.to}>{cta.label}</Link>

            <button
              className="nav-hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8h18M3 16h18" /></svg>
              }
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-menu-inner">
            <nav className="mobile-menu-links">
              {NAV_LINKS.map(({ to, label, hash, highlight }) =>
                renderLink(
                  to, label, hash, highlight,
                  `mobile-menu-link${highlight ? ' mobile-menu-link--highlight' : ''}`,
                  () => setMenuOpen(false)
                )
              )}
            </nav>
            <div className="mobile-menu-footer">
              <Link className="btn btn-acc" to={cta.to} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                {cta.label}
              </Link>
              <a className="nav-star" href="https://github.com/berat/releasehub" target="_blank" rel="noopener noreferrer" style={{ justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2z" />
                </svg>
                <b>Star on GitHub</b>
                {stars && <span className="nav-star-count">{stars}</span>}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
