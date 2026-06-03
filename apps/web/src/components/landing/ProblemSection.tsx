import { Reveal } from '@/components/ui/Reveal'
import { PROBLEM_CARDS } from '@/data/landing'

export function ProblemSection() {
  return (
    <section className="problem" id="problem">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">The real problem</span>
          <p className="lead" style={{ marginTop: 22 }}>
            The hard part was never the writing.<br />
            It's <em>understanding what shipped</em>, filtering what matters, and explaining it to people who don't read diffs.
          </p>
        </Reveal>
        <div className="prob-grid">
          {PROBLEM_CARDS.map(({ number, title, body }, i) => (
            <Reveal key={number} delay={i * 80}>
              <div className="prob-card">
                <div className="n">{number}</div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
