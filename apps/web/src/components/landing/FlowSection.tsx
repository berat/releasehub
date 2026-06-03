import { Reveal } from '@/components/ui/Reveal'

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const STEPS = [
  {
    index: 'STEP 01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9h18M9 21V9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Install once',
    body: 'npm install -g @releasehub/cli. Then run releasehub auth login and releasehub ai add-key. That\'s the entire setup — no server, no Docker, no database.',
    hasArrow: true,
  },
  {
    index: 'STEP 02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
    title: 'AI understands your release',
    body: 'Point it at a tag range. ReleaseHub fetches your merged PRs, filters out noise, classifies each change as feature / fix / improvement / breaking, and rewrites it in plain language.',
    hasArrow: true,
  },
  {
    index: 'STEP 03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
        <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        <circle cx="19" cy="18" r="2.2" />
      </svg>
    ),
    title: 'Ship the communication',
    body: 'Get GitHub release markdown, a public changelog, and a Slack message — all from one command. Pipe it into GitHub Actions, write to a file, or publish directly.',
    hasArrow: false,
  },
]

export function FlowSection() {
  return (
    <section id="flow" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">How it works</span>
          <h2 className="sect" style={{ marginTop: 18 }}>Install. Tag. <span style={{ color: 'var(--acc)' }}>Generate.</span></h2>
          <p className="sub">No web app to open, no copy-paste between tabs. One terminal command turns your PR history into release communication for every audience.</p>
        </Reveal>
        <Reveal>
          <div className="flow-grid">
            {STEPS.map(({ index, icon, title, body, hasArrow }) => (
              <div key={index} className="flow-step">
                <div className="idx">{index}</div>
                <div className="ico">{icon}</div>
                <h3>{title}</h3>
                <p>{body}</p>
                {hasArrow && (
                  <div className="arrow"><ArrowIcon /></div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  )
}
