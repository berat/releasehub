import { PageLayout } from '@/components/layout/PageLayout'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Reveal } from '@/components/ui/Reveal'
import { WaitlistForm } from '@/components/ui/WaitlistForm'
import { WAITLIST_FEATURES } from '@/data/roadmap'

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Open source', href: '/#open' },
  { label: 'Cloud waitlist' },
]

export function WaitlistPage() {
  return (
    <PageLayout>
      <section className="page-section" style={{ paddingTop: 'clamp(56px,8vw,108px)' }}>
        <div className="wrap">
          <div className="wl-page">
            <div className="page-hero" style={{ padding: '0 0 28px' }}>
              <Breadcrumb crumbs={CRUMBS} center />
              <span className="eyebrow" style={{ justifyContent: 'center' }}>ReleaseHub Cloud</span>
              <h1>Join the Cloud waitlist.</h1>
              <p className="lede">
                Don't want to run it yourself? Cloud is the same product, fully managed — with workspaces,
                hosted changelogs, and distribution built in. Leave your email and we'll reach out when it opens.
              </p>
            </div>

            <Reveal>
              <div className="wl-card">
                <WaitlistForm labelText="Email address" buttonText="Join waitlist" />
                <ul className="wl-feats">
                  {WAITLIST_FEATURES.map(feature => (
                    <li key={feature}><CheckIcon />{feature}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <p style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: 14, marginTop: 22 }}>
              Not ready to wait?{' '}
              <a href="/docs" style={{ color: 'var(--acc)' }}>Install the CLI for free →</a>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
