import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useNavScroll } from '@/hooks/useNavScroll'
import { useGitHubStars } from '@/hooks/useGitHubStars'
import { Logo } from '@/components/ui/Logo'

// isRoute: true → <Link> kullan (React Router), false → <a> kullan (hash anchor)
const NAV_LINKS = [
  { href: '/#flow',      label: 'How it works',   isRoute: false },
  { href: '/#understand',label: 'AI understanding',isRoute: false },
  { href: '/#outputs',   label: 'Outputs',         isRoute: false },
  { href: '/#vs',        label: 'vs GitHub',       isRoute: false },
  { href: '/docs',       label: 'Docs',            isRoute: true  },
  { href: '/changelog',  label: 'Changelog',       isRoute: true, highlight: true },
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

export function Nav() {
  const scrolled = useNavScroll()
  const { pathname } = useLocation()
  const stars = useGitHubStars('berat/releasehub')
  const [menuOpen, setMenuOpen] = useState(false)
  const cta = CTA_BY_PATH[pathname] ?? CTA_BY_PATH['/']

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const renderNavLink = (href: string, label: string, isRoute: boolean, highlight?: boolean, extraClass?: string, onClick?: () => void) => {
    if (highlight) {
      return isRoute
        ? <Link key={href} to={href} className={`nav-changelog${extraClass ? ` ${extraClass}` : ''}`} onClick={onClick}><span className="nav-changelog-dot" />{label}</Link>
        : <a key={href} href={href} className={`nav-changelog${extraClass ? ` ${extraClass}` : ''}`} onClick={onClick}><span className="nav-changelog-dot" />{label}</a>
    }
    return isRoute
      ? <Link key={href} to={href} className={extraClass} onClick={onClick}>{label}</Link>
      : <a key={href} href={href} className={extraClass} onClick={onClick}>{label}</a>
  }

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav-inner">
          <Logo />

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map(({ href, label, isRoute, highlight }) =>
              renderNavLink(href, label, isRoute, highlight)
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

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-menu-inner">
            <nav className="mobile-menu-links">
              {NAV_LINKS.map(({ href, label, isRoute, highlight }) =>
                renderNavLink(href, label, isRoute, highlight, `mobile-menu-link${highlight ? ' mobile-menu-link--highlight' : ''}`, () => setMenuOpen(false))
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
