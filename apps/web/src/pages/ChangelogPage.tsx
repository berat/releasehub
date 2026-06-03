import { PageLayout } from '@/components/layout/PageLayout'
import { CHANGELOG } from '@/data/changelog'
import type { ChangelogEntry } from '@/data/changelog'

const CATEGORY_META = {
  feature:     { label: 'New',      className: 'cl-pill--feature' },
  improvement: { label: 'Improved', className: 'cl-pill--improve' },
  bugfix:      { label: 'Fixed',    className: 'cl-pill--fix' },
  breaking:    { label: 'Breaking', className: 'cl-pill--breaking' },
}

function ChangelogCard({ entry }: { entry: ChangelogEntry }) {
  return (
    <div className="cl-card">
      <div className="cl-card-meta">
        <span className="cl-version">{entry.version}</span>
        <span className="cl-date">{entry.date}</span>
      </div>
      <p className="cl-summary">{entry.summary}</p>
      <div className="cl-changes">
        {entry.changes.map(group => (
          <div key={group.category} className="cl-group">
            <div className="cl-group-header">
              <span className={`cl-pill ${CATEGORY_META[group.category].className}`}>
                {CATEGORY_META[group.category].label}
              </span>
            </div>
            <ul className="cl-items">
              {group.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChangelogPage() {
  return (
    <PageLayout>
      <section className="cl-page-hero">
        <div className="wrap">
          <span className="eyebrow">Changelog</span>
          <h1 className="cl-page-title">What's new in ReleaseHub</h1>
          <p className="cl-page-sub">Every update to the CLI and the website, in one place.</p>
        </div>
      </section>

      <section className="cl-page-body">
        <div className="wrap cl-layout">
          <div className="cl-timeline">
            {CHANGELOG.map(entry => (
              <ChangelogCard key={entry.version} entry={entry} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
