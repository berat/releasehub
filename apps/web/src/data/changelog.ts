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
