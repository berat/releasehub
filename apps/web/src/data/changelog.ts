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
    version: 'v1.1.0',
    date: 'June 15, 2026',
    summary: 'Google Gemini support, full test suite, CI pipeline, and branch protection.',
    changes: [
      {
        category: 'feature',
        items: [
          'Google Gemini (gemini-1.5-flash) added as a third AI provider — set key via releasehub ai add-key or RELEASEHUB_GEMINI_KEY',
        ],
      },
      {
        category: 'improvement',
        items: [
          'Full unit and integration test suite (51 tests across formatters, AI, GitHub, and the generate pipeline)',
          'GitHub Actions CI — tsc, ESLint, and vitest run on every PR',
          'ESLint with typescript-eslint added to catch style issues before they merge',
          'PR template enforces summary and test plan on every pull request',
          'Branch protection — CI must pass before any PR can merge to main',
        ],
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'June 10, 2026',
    summary: 'First public release of @releasehub/cli.',
    changes: [
      {
        category: 'feature',
        items: [
          'Published @releasehub/cli to npm — install with npm install -g @releasehub/cli',
          'Open source under MIT license on GitHub',
          'Landing page, docs, changelog, and roadmap at berat.app/releasehub',
          'GitHub OAuth device flow — releasehub auth login',
          'Multi-provider AI analysis — Anthropic (Claude) and OpenAI (GPT-4o)',
          'Three output formats: github-release, changelog, slack',
          '--publish flag — create a GitHub Release directly from the CLI',
          'CI/CD ready — env var support and --quiet flag for pipelines',
        ],
      },
    ],
  },
]
