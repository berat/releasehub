import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavScroll } from '@/hooks/useNavScroll'
import { useGitHubStars } from '@/hooks/useGitHubStars'
import { Logo } from '@/components/ui/Logo'

const NAV_LINKS = [
  { href: '/#flow', label: 'How it works' },
  { href: '/#understand', label: 'AI understanding' },
  { href: '/#outputs', label: 'Outputs' },
  { href: '/#vs', label: 'vs GitHub' },
  { href: '/docs', label: 'Docs' },
  { href: '/changelog', label: 'Changelog', highlight: true },
]

interface NavCta {
  label: string
  href: string
}

const CTA_BY_PATH: Record<string, NavCta> = {
  '/': { label: 'Get started', href: '/docs' },
  '/waitlist': { label: 'Get started', href: '/docs' },
  '/roadmap': { label: 'Get started', href: '/docs' },
  '/docs': { label: 'Get started', href: '/docs' },
  '/changelog': { label: 'Get started', href: '/docs' },
}

export function Nav() {
  const scrolled = useNavScroll()
  const { pathname } = useLocation()
  const stars = useGitHubStars('berat/releasehub')
  const [menuOpen, setMenuOpen] = useState(false)
  const cta = CTA_BY_PATH[pathname] ?? CTA_BY_PATH['/']

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav-inner">
          <Logo />

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map(({ href, label, highlight }) => (
              highlight
                ? (
                  <a key={href} href={href} className="nav-changelog">
                    <span className="nav-changelog-dot" />
                    {label}
                  </a>
                )
                : (
                  <a key={href} href={href}>{label}</a>
                )
            ))}
          </nav>

          <div className="nav-cta">
            {/* Star — desktop only */}
            <a
              className="nav-star"
              href="https://github.com/berat/releasehub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2z" />
              </svg>
              <b>Star</b>
              {stars && <span className="nav-star-count">{stars}</span>}
            </a>

            {/* Get started — always visible */}
            <a className="btn btn-acc nav-cta-btn" href={cta.href}>{cta.label}</a>

            {/* Hamburger — mobile only */}
            <button
              className="nav-hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen
                ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                )
                : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 8h18M3 16h18" />
                  </svg>
                )
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-menu-inner">
            <nav className="mobile-menu-links">
              {NAV_LINKS.map(({ href, label, highlight }) => (
                highlight
                  ? (
                    <a key={href} href={href} className="mobile-menu-link mobile-menu-link--highlight" onClick={() => setMenuOpen(false)}>
                      <span className="nav-changelog-dot" />
                      {label}
                    </a>
                  )
                  : (
                    <a key={href} href={href} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
                      {label}
                    </a>
                  )
              ))}
            </nav>
            <div className="mobile-menu-footer">
              <a className="btn btn-acc" href={cta.href} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                {cta.label}
              </a>
              <a
                className="nav-star"
                href="https://github.com/berat/releasehub"
                target="_blank"
                rel="noopener noreferrer"
                style={{ justifyContent: 'center' }}
              >
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
