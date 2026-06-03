import { Logo } from '@/components/ui/Logo'
import { FOOTER_LINKS } from '@/data/landing'
import { CopyCommand } from '@/components/ui/CopyCommand'

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
                <a key={href} href={href}>{label}</a>
              ))}
            </div>
            <div className="foot-col">
              <h5>Open source</h5>
              {FOOTER_LINKS.openSource.map(({ href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="foot-col">
              <h5>Built for</h5>
              {FOOTER_LINKS.builtFor.map(({ href, label }) => (
                <a key={label} href={href}>{label}</a>
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
