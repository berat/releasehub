import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { OUTPUT_FORMATS, type OutputKey } from '@/data/outputs'

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 012-2h10" strokeLinecap="round" />
  </svg>
)

export function OutputsSection() {
  const [activeKey, setActiveKey] = useState<OutputKey>('changelog')
  const active = OUTPUT_FORMATS.find(f => f.key === activeKey)!

  return (
    <section id="outputs">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">One release · every audience</span>
          <h2 className="sect" style={{ marginTop: 18 }}>Write it once. Speak to everyone in their language.</h2>
          <p className="sub">A founder needs business impact. A customer needs benefits. The team needs a recap. Same understood release — six tailored outputs. Pick an audience:</p>
        </Reveal>
        <Reveal>
          <div className="out-layout">
            <div className="aud-list" role="tablist" aria-label="Output formats">
              {OUTPUT_FORMATS.map(({ key, label, audience, icon }) => (
                <button
                  key={key}
                  className={`aud${activeKey === key ? ' active' : ''}`}
                  role="tab"
                  aria-selected={activeKey === key}
                  onClick={() => setActiveKey(key)}
                >
                  <span className="ai">{icon}</span>
                  <span className="meta">
                    <b>{label}</b>
                    <small>{audience}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="out-stage">
              <div className="bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="copy">
                  <CopyIcon />
                  {active.copyLabel}
                </span>
              </div>
              <div key={activeKey} className="out-body show">
                {active.content}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
