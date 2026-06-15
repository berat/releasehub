export const PROBLEM_CARDS = [
  {
    number: '01 — Most teams',
    title: 'Write nothing at all',
    body: 'Shipping happens, but the people relying on you — customers, support, the founder — never hear about it. Work goes invisible.',
  },
  {
    number: '02 — Or worse',
    title: 'Write notes nobody reads',
    body: '"Refactor auth middleware" is technically a changelog. It also means nothing to a non-technical user.',
  },
  {
    number: '03 — And it costs',
    title: 'Hours of manual review',
    body: 'Someone scrolls every PR, decides what\'s user-facing, rewrites it for six audiences, and pastes it into six tools. Every single release.',
  },
]

export const COMPARISON_ROWS = [
  {
    capability: 'Understands what shipped',
    github: 'Lists PR titles verbatim',
    githubIcon: '✗',
    rh: 'Explains why each change matters',
    rhIcon: '✓',
  },
  {
    capability: 'Filters out noise',
    github: 'Shows every merge, refactors included',
    githubIcon: '✗',
    rh: 'Hides internal-only work automatically',
    rhIcon: '✓',
  },
  {
    capability: 'Plain, human language',
    github: 'Raw commit / PR text',
    githubIcon: '✗',
    rh: 'Rewritten for non-technical readers',
    rhIcon: '✓',
  },
  {
    capability: 'Multiple output formats',
    github: 'One format, one place',
    githubIcon: '✗',
    rh: 'GitHub release, changelog, Slack — one command',
    rhIcon: '✓',
  },
  {
    capability: 'Classifies change type',
    github: 'By PR label only — if configured',
    githubIcon: '~',
    rh: 'Auto-detected: feature / fix / improvement / breaking',
    rhIcon: '✓',
  },
  {
    capability: 'CI/CD integration',
    github: 'Manual copy-paste',
    githubIcon: '✗',
    rh: 'One step in your GitHub Actions workflow',
    rhIcon: '✓',
  },
]

export const HERO_COMMITS = [
  { hash: 'a1f4c', text: 'feat: add Sign in with Apple', muted: false },
  { hash: '7c11d', text: 'fix: token refresh race condition', muted: false },
  { hash: 'b40f2', text: 'chore: bump 12 dependencies', muted: true },
]

export const HERO_OUTPUTS = [
  { pill: 'Feature', pillClass: 'feature', text: 'Sign in with Apple is now available.' },
  { pill: 'Fix', pillClass: 'fix', text: 'Fixed an issue that could log you out.' },
  { pill: 'Internal', pillClass: 'internal', text: '1 change hidden.', muted: true },
]

export const AI_DEMO_ROWS = [
  {
    input: 'feat: add Sign in with Apple (OAuth)',
    pill: 'Feature',
    pillClass: 'feature',
    output: 'You can now sign in with Apple.',
    internal: false,
  },
  {
    input: 'perf: memoize dashboard aggregation queries',
    pill: 'Faster',
    pillClass: 'improve',
    output: 'Your dashboard now loads up to 2× faster.',
    internal: false,
  },
  {
    input: 'fix: token refresh race condition',
    pill: 'Fix',
    pillClass: 'fix',
    output: 'Fixed an issue that could occasionally interrupt your session.',
    internal: false,
  },
  {
    input: 'refactor: extract auth middleware',
    pill: 'Internal',
    pillClass: 'internal',
    output: 'Hidden from users — no visible impact. Kept in the engineering recap.',
    internal: true,
  },
  {
    input: 'feat!: drop Node 16 support',
    pill: 'Breaking',
    pillClass: 'breaking',
    output: 'Heads up: ReleaseHub now requires Node 18 or newer.',
    internal: false,
  },
]

export const OPEN_SOURCE_CORE_FEATURES = [
  'npm install -g @releasehub/cli',
  'GitHub OAuth — one-time setup',
  'AI analysis — Anthropic, OpenAI, or Gemini',
  'GitHub release, changelog & Slack output',
  'CI/CD ready — works in GitHub Actions',
]

export const OPEN_SOURCE_CLOUD_FEATURES = [
  'Web UI — review & edit before publishing',
  'Team workspaces & release history',
  'Hosted public changelog page',
  'Slack integration & email distribution',
  'Engagement analytics',
]

export const FOOTER_LINKS = {
  product: [
    { label: 'How it works', href: '/#flow' },
    { label: 'AI understanding', href: '/#understand' },
    { label: 'Output formats', href: '/#outputs' },
    { label: 'vs GitHub', href: '/#vs' },
  ],
  openSource: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'GitHub repo', href: 'https://github.com/berat/releasehub', external: true },
    { label: 'npm package', href: 'https://npmjs.com/package/@releasehub/cli', external: true },
    { label: 'Cloud waitlist', href: '/waitlist' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  builtFor: [
    { label: 'SaaS startups', href: '/#problem' },
    { label: 'Indie developers', href: '/#problem' },
    { label: 'CI/CD pipelines', href: '/#flow' },
    { label: 'Open source projects', href: '/#open' },
    { label: 'Small engineering teams', href: '/#problem' },
    { label: 'Solo founders', href: '/#problem' },
  ],
}
