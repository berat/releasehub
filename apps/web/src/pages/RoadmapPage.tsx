import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Callout } from '@/components/ui/Callout'
import { Reveal } from '@/components/ui/Reveal'
import { ROADMAP_COLUMNS } from '@/data/roadmap'

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Roadmap' },
]

const ALL_TAGS = ['All', 'CLI', 'Website', 'Output', 'Cloud', 'Integration', 'Launch']

const TAG_COLORS: Record<string, string> = {
  CLI:         'var(--acc)',
  Website:     'var(--improve)',
  Output:      'var(--fix)',
  Cloud:       '#7C3AED',
  Integration: 'var(--ink-3)',
  Launch:      'var(--success)',
}

export function RoadmapPage() {
  const [activeTag, setActiveTag] = useState('All')

  return (
    <PageLayout>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumb crumbs={CRUMBS} />
          <span className="eyebrow">Roadmap</span>
          <h1>Where ReleaseHub is headed.</h1>
          <p className="lede">
            Built in the open. The CLI stays free forever — new outputs, integrations, and cloud
            features land here as they're validated. Want something moved up? Open an issue on GitHub.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="wrap">
          <Reveal>
            {/* Tag filter */}
            <div className="rm-filters">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`rm-filter-btn${activeTag === tag ? ' active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                  style={activeTag === tag && tag !== 'All'
                    ? { borderColor: TAG_COLORS[tag], color: TAG_COLORS[tag], background: `${TAG_COLORS[tag]}14` }
                    : undefined
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="board">
              {ROADMAP_COLUMNS.map(({ status, label, color, cards }) => {
                const filtered = activeTag === 'All'
                  ? cards
                  : cards.filter(c => c.tag === activeTag)
                return (
                  <div key={status} className="col-rm">
                    <div className="col-h">
                      <b>
                        <span className="doth" style={{ background: color }} />
                        {label}
                      </b>
                      <span className="cnt">{filtered.length}</span>
                    </div>
                    <div className="col-cards">
                      {filtered.length === 0
                        ? <div className="rm-empty">Nothing here for this filter.</div>
                        : filtered.map(({ title, description, tag }) => (
                          <div key={title} className="rm-card">
                            <b>{title}</b>
                            <p>{description}</p>
                            <span
                              className="rt"
                              style={{ color: TAG_COLORS[tag] ?? 'var(--ink-faint)' }}
                            >
                              {tag}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
              })}
            </div>

            <Callout style={{ marginTop: 34, maxWidth: 760 }}>
              This roadmap is directional, not a commitment to dates. Order changes based on what
              the community needs most — the surest way to influence it is a{' '}
              <a className="ln" href="https://github.com/berat/releasehub/issues" target="_blank" rel="noopener noreferrer">
                GitHub issue
              </a>{' '}
              with a clear use case.
            </Callout>
          </Reveal>
        </div>
      </section>
    </PageLayout>
  )
}
