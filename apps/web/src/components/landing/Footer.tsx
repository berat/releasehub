import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { FOOTER_LINKS } from '@/data/landing'
import { CopyCommand } from '@/components/ui/CopyCommand'

function useHashScroll() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (hash: string) => {
    const scrollTo = () => {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    if (pathname === '/') {
      scrollTo()
    } else {
      navigate('/')
      setTimeout(scrollTo, 80)
    }
  }
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const scrollToHash = useHashScroll()

  // External link
  if (external || href.startsWith('http')) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
  }

  // Hash anchor (e.g. /#flow)
  if (href.startsWith('/#')) {
    const hash = href.slice(2)
    return (
      <a href={href} onClick={(e) => { e.preventDefault(); scrollToHash(hash) }}>
        {label}
      </a>
    )
  }

  // Internal route
  return <Link to={href}>{label}</Link>
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo />
            <p>AI-powered release notes from your terminal. GitHub tells you what changed — ReleaseHub explains why it matters.</p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h5>Product</h5>
              {FOOTER_LINKS.product.map(({ href, label }) => (
                <FooterLink key={label} href={href} label={label} />
              ))}
            </div>
            <div className="foot-col">
              <h5>Open source</h5>
              {FOOTER_LINKS.openSource.map(({ href, label, external }) => (
                <FooterLink key={label} href={href} label={label} external={external} />
              ))}
            </div>
            <div className="foot-col">
              <h5>Built for</h5>
              {FOOTER_LINKS.builtFor.map(({ href, label }) => (
                <FooterLink key={label} href={href} label={label} />
              ))}
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 ReleaseHub · MIT licensed</span>
          <a href="https://www.buymeacoffee.com/beratbozkurt0" target="_blank" rel="noopener noreferrer" className="foot-sponsor">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" />
          </a>
          <CopyCommand className="footer-copy" />
        </div>
      </div>
    </footer>
  )
}
