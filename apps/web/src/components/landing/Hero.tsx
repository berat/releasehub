import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { HERO_COMMITS, HERO_OUTPUTS } from '@/data/landing'

export function Hero() {
  return (
    <section className="hero" style={{ paddingTop: 'clamp(48px,6vw,84px)' }}>
      <div className="wrap hero-grid">
        <Reveal>
          <span className="eyebrow">Open source CLI tool</span>
          <h1>
            Stop shipping in silence.<br />
            <span className="hl">Publish the release.</span>
          </h1>
          <p className="lede">
            Run one command after tagging a release. ReleaseHub reads your PRs,
            filters the noise, rewrites technical titles into plain language, and
            outputs GitHub release notes, a changelog, and a Slack message — ready to ship.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-acc" to="/docs">Get started →</Link>
            <a className="btn btn-ghost" href="https://github.com/berat/releasehub" target="_blank" rel="noopener noreferrer">Star on GitHub ★</a>
          </div>
          <div className="hero-meta">
            <span><i className="dot" />Open source · MIT</span>
            <span><i className="dot" />No server required</span>
            <span><i className="dot" />CI/CD ready</span>
          </div>
        </Reveal>

        <Reveal delay={120} className="translator">
          <div className="panel">

            {/* Terminal commands */}
            <div className="panel-bar">
              <span className="dots"><i /><i /><i /></span>
              <span className="ttl">Terminal</span>
            </div>
            <div className="hero-terminal-lines">
              <div className="hero-terminal-line">
                <span className="hero-terminal-prompt">$</span>
                <span>npm install -g @releasehub/cli</span>
              </div>
              <div className="hero-terminal-line">
                <span className="hero-terminal-prompt hero-terminal-prompt--green">$</span>
                <span>releasehub generate --from v2.3.0 --to v2.4.0</span>
              </div>
            </div>

            {/* Divider */}
            <div className="panel-divider">
              <span className="panel-divider-label">releasehub/web · v2.4.0</span>
            </div>

            {/* Translator */}
            <div className="twocol">
              <div className="col raw">
                <div className="col-label">
                  <span>Merged this release</span>
                  <span className="tag-in">raw activity</span>
                </div>
                {HERO_COMMITS.map(({ hash, text, muted }) => (
                  <div key={hash} className="commit">
                    <span className="hash">{hash}</span>
                    <span className={muted ? 'type-c' : undefined}>{text}</span>
                  </div>
                ))}
              </div>
              <div className="col">
                <div className="ai-divider">
                  <span className="ln" />
                  <span className="chip">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    AI understands
                  </span>
                  <span className="ln" />
                </div>
                <div className="col-label">
                  <span>Public changelog</span>
                  <span className="tag-out">communication</span>
                </div>
                {HERO_OUTPUTS.map(({ pill, pillClass, text, muted }) => (
                  <div key={pill} className={`out-row${muted ? ' muted' : ''}`}>
                    <span className={`pill ${pillClass}`}>{pill}</span>
                    <span className="txt">{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  )
}
