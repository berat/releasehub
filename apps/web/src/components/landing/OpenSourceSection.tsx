import { Reveal } from '@/components/ui/Reveal'
import { WaitlistForm } from '@/components/ui/WaitlistForm'
import { OPEN_SOURCE_CORE_FEATURES, OPEN_SOURCE_CLOUD_FEATURES } from '@/data/landing'

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" strokeLinecap="round" />
  </svg>
)

export function OpenSourceSection() {
  return (
    <section className="os-sec" id="open">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Open source first</span>
          <h2 className="sect" style={{ marginTop: 18 }}>The CLI is yours. Forever, and for free.</h2>
          <p className="sub">Install it, read every line, bring your own Anthropic key. The cloud version exists for teams that want a UI and shared history — never as a paywall on the core tool.</p>
        </Reveal>
        <Reveal>
          <div className="os-grid">
            <div className="os-card core">
              <span className="badge">Open source · MIT · npm</span>
              <h3>ReleaseHub CLI</h3>
              <p>Everything you need to generate great release communication from a GitHub repo, running from your terminal or CI pipeline.</p>
              <ul>
                {OPEN_SOURCE_CORE_FEATURES.map(feature => (
                  <li key={feature}><CheckIcon />{feature}</li>
                ))}
              </ul>
              <div className="pricing">
                <span className="big">$0</span>
                <span className="small">
                  MIT licensed · <a className="ln" href="https://npmjs.com/package/@releasehub/cli" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)' }}>npm install →</a>
                </span>
              </div>
            </div>
            <div className="os-card cloud">
              <span className="badge">Hosted cloud — coming later</span>
              <h3>ReleaseHub Cloud</h3>
              <p>The same power, fully managed, with the team features a growing org eventually wants.</p>
              <ul>
                {OPEN_SOURCE_CLOUD_FEATURES.map(feature => (
                  <li key={feature}><PlusIcon />{feature}</li>
                ))}
              </ul>
              <WaitlistForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
