import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { FOOTER_LINKS } from '@/data/landing'
import { CopyCommand } from '@/components/ui/CopyCommand'

// Hash anchor'lar (#) ve external linkler <a> kalır, route linkleri <Link> olur
function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  if (external || href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
    )
  }
  // Internal links (routes and hash anchors) — React Router adds basename
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
          <CopyCommand className="footer-copy" />
        </div>
      </div>
    </footer>
  )
}
