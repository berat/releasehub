import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { CopyCommand } from '@/components/ui/CopyCommand'

export function CTASection() {
  return (
    <section className="cta-sec" id="cta">
      <div className="wrap">
        <Reveal>
          <div className="cta-box">
            <h2>Stop shipping <span className="acc">in silence.</span></h2>
            <p>One command after every tag. Your release notes, changelog, and Slack message — written, formatted, and ready to go.</p>
            <div className="cta-install">
              <CopyCommand />
            </div>
            <div className="cta-actions">
              <Link className="btn btn-acc" to="/docs">See the setup →</Link>
              <a className="btn btn-ghost" href="https://github.com/berat/releasehub" target="_blank" rel="noopener noreferrer">Star on GitHub ★</a>
            </div>
            <p className="cta-fine">Free &amp; open source · MIT licensed · no server, no lock-in</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
