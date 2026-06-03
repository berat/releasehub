import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { CHANGELOG } from '@/data/changelog'

const CATEGORY_META = {
  feature:     { label: 'New',      className: 'cl-pill--feature' },
  improvement: { label: 'Improved', className: 'cl-pill--improve' },
  bugfix:      { label: 'Fixed',    className: 'cl-pill--fix' },
  breaking:    { label: 'Breaking', className: 'cl-pill--breaking' },
}

export function ChangelogPreview() {
  const preview = CHANGELOG.slice(0, 2)

  return (
    <section className="cl-preview-sec" id="changelog">
      <div className="wrap">
        <Reveal className="cl-preview-head">
          <div className="cl-preview-eyebrow">
            <span className="cl-live-dot" />
            <span className="eyebrow" style={{ color: 'var(--ink-2)' }}>Changelog</span>
          </div>
          <h2 className="sect">What we've been <span style={{ color: 'var(--acc)' }}>shipping.</span></h2>
          <p className="sub">Every update to the CLI and the website, logged here.</p>
        </Reveal>

        <div className="cl-preview-list">
          {preview.map((entry, i) => (
            <Reveal key={entry.version} delay={i * 80}>
              <div className="cl-preview-card">
                <div className="cl-preview-card-header">
                  <span className="cl-version">{entry.version}</span>
                  <span className="cl-date">{entry.date}</span>
                </div>
                <p className="cl-summary">{entry.summary}</p>
                <div className="cl-preview-pills">
                  {entry.changes.map(group => (
                    <span
                      key={group.category}
                      className={`cl-pill ${CATEGORY_META[group.category].className}`}
                    >
                      {CATEGORY_META[group.category].label} · {group.items.length}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="cl-preview-footer">
            <Link className="cl-view-all" to="/changelog">
              View full changelog
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
