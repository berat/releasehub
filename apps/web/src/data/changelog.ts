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
    version: 'v1.1.1',
    date: 'June 25, 2026',
    summary: 'Dry-run mode, config command, and GitHub Actions workflow improvements.',
    changes: [
      {
        category: 'feature',
        items: [
          '--dry-run flag for generate — fetches PRs and shows what would be analyzed without making an AI call',
          'releasehub config command — view current configuration (GitHub token, AI provider, masked API keys)',
          'releasehub config --reset — delete the config file and start fresh',
        ],
      },
      {
        category: 'improvement',
        items: [
          'GitHub Actions workflow now handles first-tag edge case — skips release notes generation when no previous tag exists',
          'RELEASEHUB_AI_PROVIDER env var support — switch providers in CI without touching the config file',
        ],
      },
      {
        category: 'bugfix',
        items: [
          'Fixed fetch is not defined error on Node 16 — Octokit now uses native fetch only when available',
        ],
      },
    ],
  },
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
