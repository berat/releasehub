export interface ChangelogEntry {
  version: string
  date: string
  summary: string
  changes: {
    category: 'feature' | 'improvement' | 'bugfix' | 'breaking'
    items: string[]
  }[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v0.3.0',
    date: 'June 3, 2026',
    summary: 'Docs page, copy-to-clipboard, and a fully redesigned hero.',
    changes: [
      {
        category: 'feature',
        items: [
          'New /docs page with sidebar navigation and full CLI reference',
          'Copy-to-clipboard on all npm install commands with toast feedback',
          'GitHub star count is now fetched live from the GitHub API',
        ],
      },
      {
        category: 'improvement',
        items: [
          'Hero panel now combines the terminal commands and the translator in a single card',
          'Changelog link added to nav and footer',
          '"Get started" always routes to /docs',
        ],
      },
    ],
  },
  {
    version: 'v0.2.0',
    date: 'May 28, 2026',
    summary: 'CLI-first pivot. Dropped Docker self-host in favour of a simple npm install.',
    changes: [
      {
        category: 'feature',
        items: [
          'releasehub auth login — GitHub OAuth via device flow',
          'releasehub ai add-key / remove-key / status',
          'releasehub generate with --format, --output, --publish, --quiet flags',
          'Full GitHub Actions workflow example',
        ],
      },
      {
        category: 'improvement',
        items: [
          'All planning docs rewritten around the CLI MVP',
          'Landing page copy updated to reflect CLI-first positioning',
          '"Open source & self-hostable" → "No server required · CI/CD ready"',
        ],
      },
      {
        category: 'breaking',
        items: [
          'Docker Compose self-host removed — install via npm instead',
        ],
      },
    ],
  },
  {
    version: 'v0.1.0',
    date: 'May 20, 2026',
    summary: 'First public version of the ReleaseHub landing page.',
    changes: [
      {
        category: 'feature',
        items: [
          'Landing page with hero, problem, flow, AI demo, outputs, and open source sections',
          'Waitlist form with email capture',
          'Roadmap page',
          '/self-host quick start guide',
        ],
      },
    ],
  },
]
