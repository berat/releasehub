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
    version: 'v0.5.0',
    date: 'June 4, 2026',
    summary: 'CLI M1 & M2 complete — GitHub data ingestion and multi-provider AI analysis.',
    changes: [
      {
        category: 'feature',
        items: [
          'releasehub ai switch — switch active AI provider at any time',
          'Multi-provider AI analysis: Anthropic (Claude) and OpenAI (GPT-4o)',
          'GitHub data ingestion: fetch merged PRs, labels, linked issues between two tags',
          'Auto-detect repo from git remote (SSH and HTTPS)',
        ],
      },
      {
        category: 'improvement',
        items: [
          'releasehub ai add-key now shows a provider selection menu',
          'releasehub ai status validates all saved keys',
          'releasehub ai remove-key prompts which provider to remove',
          'All internal navigation links fixed for /releasehub subdirectory deployment',
          'Hash anchor scroll fixed — works correctly from any page',
          'Logo click now routes correctly to home',
        ],
      },
    ],
  },
  {
    version: 'v0.4.0',
    date: 'June 3, 2026',
    summary: 'CLI M0 — auth, GitHub OAuth, and initial project scaffold.',
    changes: [
      {
        category: 'feature',
        items: [
          'releasehub auth login / logout — GitHub OAuth device flow',
          'releasehub ai add-key / remove-key / status — Anthropic key management',
          'releasehub generate stub — flags and structure in place',
          'packages/cli scaffolded with TypeScript + ESM + commander',
        ],
      },
    ],
  },
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
