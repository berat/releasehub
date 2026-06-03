import type { ReactNode } from 'react'

export type OutputKey = 'changelog' | 'github' | 'slack' | 'email' | 'founder' | 'weekly'

export interface OutputFormat {
  key: OutputKey
  label: string
  audience: string
  copyLabel: string
  icon: ReactNode
  content: ReactNode
}

const ChangelogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
    <path d="M4 6h16M4 12h16M4 18h9" strokeLinecap="round" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.5 5 .3.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0022 12.3C22 6.6 17.5 2 12 2z" />
  </svg>
)

const SlackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
    <path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1121 11.5z" strokeLinejoin="round" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" strokeLinecap="round" />
  </svg>
)

const FounderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
    <path d="M4 19V9l5-3 5 4 6-4v13" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WeeklyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
  </svg>
)

export const OUTPUT_FORMATS: OutputFormat[] = [
  {
    key: 'changelog',
    label: 'Public changelog',
    audience: 'customers',
    copyLabel: 'changelog.md',
    icon: <ChangelogIcon />,
    content: (
      <>
        <h5>What's new — v2.4.0</h5>
        <div className="meta-line">Released today · ReleaseHub</div>
        <h6>New</h6>
        <ul><li>Sign in with Apple — log in faster with the Apple ID you already use.</li></ul>
        <h6>Improved</h6>
        <ul><li className="imp">Your dashboard now loads up to 2× faster, even on large accounts.</li></ul>
        <h6>Fixed</h6>
        <ul><li className="fix">Resolved an issue that could occasionally interrupt your session.</li></ul>
        <p className="dim" style={{ marginTop: 18 }}>2 internal changes were made this release with no user impact.</p>
      </>
    ),
  },
  {
    key: 'github',
    label: 'GitHub release',
    audience: 'markdown',
    copyLabel: 'RELEASE.md',
    icon: <GithubIcon />,
    content: (
      <div className="mono-block">
        <span className="h">{'## v2.4.0'}</span>
        {'\n\n'}
        <span className="h">{'### ✨ New Features'}</span>
        {'\n- Sign in with Apple (#412) — faster login via Apple ID\n\n'}
        <span className="h">{'### 🚀 Improvements'}</span>
        {'\n- Dashboard loads up to 2× faster on large datasets (#418)\n\n'}
        <span className="h">{'### 🐛 Bug Fixes'}</span>
        {'\n- Fixed a token-refresh race that could interrupt sessions (#421)\n\n'}
        <span className="h">{'### ⚠️ Breaking'}</span>
        {'\n- Node 18+ now required (dropped Node 16)\n\n'}
        <span style={{ color: 'var(--ink-faint)' }}>{'<!-- internal: auth middleware refactor, 12 dependency bumps -->'}</span>
      </div>
    ),
  },
  {
    key: 'slack',
    label: 'Slack post',
    audience: 'the team',
    copyLabel: 'slack-message',
    icon: <SlackIcon />,
    content: (
      <>
        <div className="slackline">
          <div className="av" />
          <div className="body">
            <b>ReleaseHub</b><span className="t">9:41 AM</span>
            <p style={{ marginTop: 4 }}>🚀 <b>We just shipped v2.4.0</b></p>
          </div>
        </div>
        <ul style={{ marginTop: 4 }}>
          <li>Apple Login is live</li>
          <li className="imp">Dashboard is ~2× faster</li>
          <li className="fix">Fixed the session-interrupt bug</li>
        </ul>
        <p className="dim" style={{ marginTop: 14 }}>⚠️ Heads up: Node 18+ now required. Refactors + dep bumps under the hood. Nice work, team 👏</p>
      </>
    ),
  },
  {
    key: 'email',
    label: 'Customer email',
    audience: 'your users',
    copyLabel: 'email.html',
    icon: <EmailIcon />,
    content: (
      <>
        <div className="emailfield"><b>Subject:</b> New: Sign in with Apple + a faster dashboard</div>
        <p>Hi there 👋</p>
        <p>We shipped a few updates this week we think you'll like:</p>
        <ul>
          <li><b>Sign in with Apple</b> — one tap to log in, no new password.</li>
          <li className="imp"><b>A faster dashboard</b> — up to 2× quicker to load.</li>
          <li className="fix"><b>A smoother session</b> — we fixed a bug that could log you out unexpectedly.</li>
        </ul>
        <p style={{ marginTop: 16 }}>As always, reply to this email if anything feels off.</p>
        <p className="dim">— The ReleaseHub team</p>
      </>
    ),
  },
  {
    key: 'founder',
    label: 'Founder brief',
    audience: 'business impact',
    copyLabel: 'founder-brief',
    icon: <FounderIcon />,
    content: (
      <>
        <h5>Release impact — v2.4.0</h5>
        <div className="meta-line">For: founders &amp; product · 5 PRs merged · 0 incidents</div>
        <p><b>Shipped Apple Login.</b> Removes signup friction on mobile — the most-requested auth method in support tickets last quarter. Expect a lift in mobile signup conversion.</p>
        <p><b>Dashboard ~2× faster.</b> Directly addresses our #1 performance complaint; should reduce churn signals from large accounts.</p>
        <p><b>Closed a session-reliability bug.</b> Cuts a recurring support category.</p>
        <p className="dim" style={{ marginTop: 16 }}>Cost: one breaking change (Node 18+) — low risk, self-hosters notified.</p>
      </>
    ),
  },
  {
    key: 'weekly',
    label: 'Weekly recap',
    audience: 'internal',
    copyLabel: 'weekly-recap',
    icon: <WeeklyIcon />,
    content: (
      <>
        <h5>What we shipped this week</h5>
        <div className="meta-line">Internal engineering recap · releasehub/web</div>
        <h6>Shipped</h6>
        <ul>
          <li>Apple OAuth integration (a1f4c)</li>
          <li className="imp">Dashboard aggregation query optimization (9e2b0)</li>
          <li className="fix">Token refresh race condition fix (7c11d)</li>
        </ul>
        <h6>Under the hood</h6>
        <ul>
          <li>Auth middleware extracted &amp; refactored (tech debt)</li>
          <li>12 dependencies bumped</li>
        </ul>
        <p className="dim" style={{ marginTop: 16 }}>5 PRs merged · 1 breaking change (Node 18+) · 0 production incidents.</p>
      </>
    ),
  },
]
