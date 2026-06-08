export type RoadmapStatus = 'shipped' | 'now' | 'next' | 'exploring'

export interface RoadmapCard {
  title: string
  description: string
  tag: string
}

export interface RoadmapColumn {
  status: RoadmapStatus
  label: string
  color: string
  cards: RoadmapCard[]
}

export const ROADMAP_COLUMNS: RoadmapColumn[] = [
  {
    status: 'shipped',
    label: 'Shipped',
    color: 'var(--success)',
    cards: [
      { title: 'AI analysis — multi-provider', description: 'Classify and rewrite PRs using Anthropic (Claude) or OpenAI (GPT-4o). 20-PR batching for large releases.', tag: 'CLI' },
      { title: 'GitHub data ingestion', description: 'Fetch merged PRs between two tags, extract labels and linked issues, auto-detect repo from git remote.', tag: 'CLI' },
      { title: 'CLI auth & key management', description: 'GitHub OAuth device flow. AI provider selection (Anthropic / OpenAI) with releasehub ai add-key, switch, status.', tag: 'CLI' },
      { title: 'Roadmap page', description: 'Live board with tag filtering — Shipped / Now / Next / Exploring.', tag: 'Website' },
      { title: 'Changelog page', description: 'Versioned changelog with categories. Preview section on the landing page.', tag: 'Website' },
      { title: 'Docs page', description: 'Full CLI reference with sidebar navigation — commands, flags, GitHub Actions workflow.', tag: 'Website' },
      { title: 'Landing page', description: 'Full marketing site with hero, AI demo, output formats, and open source section.', tag: 'Website' },
    ],
  },
  {
    status: 'now',
    label: 'Now',
    color: 'var(--acc)',
    cards: [
      { title: 'Output generation (M3)', description: 'Generate github-release, changelog, and slack formats from AI analysis. stdout, --output file, --publish to GitHub.', tag: 'CLI' },
    ],
  },
  {
    status: 'next',
    label: 'Next',
    color: 'var(--improve)',
    cards: [
      { title: 'Polish & launch (M4)', description: 'Error handling, --help improvements, README update, npm publish. Hacker News & Product Hunt.', tag: 'Launch' },
      { title: 'Gemini support', description: 'Add Google Gemini as a third AI provider option.', tag: 'CLI' },
    ],
  },
  {
    status: 'exploring',
    label: 'Exploring',
    color: 'var(--internal)',
    cards: [
      { title: 'Cloud web UI', description: 'Review and edit AI output in a browser before publishing.', tag: 'Cloud' },
      { title: 'Team workspaces & history', description: 'Shared releases, saved drafts, release history search.', tag: 'Cloud' },
      { title: 'Hosted changelog page', description: 'Public, brandable changelog at yourapp.releasehub.app.', tag: 'Cloud' },
      { title: 'Webhook support', description: 'Auto-trigger analysis on GitHub release event.', tag: 'Cloud' },
      { title: 'Slack integration', description: 'Post release notes directly to a Slack channel.', tag: 'Cloud' },
      { title: 'GitLab support', description: 'Same CLI pipeline for GitLab repositories.', tag: 'Integration' },
      { title: 'Linear & Jira sources', description: 'Pull issue context beyond GitHub for richer release notes.', tag: 'Integration' },
      { title: 'More output formats', description: 'Internal weekly recap, blog post draft, social media posts.', tag: 'Output' },
    ],
  },
]

export const WAITLIST_FEATURES = [
  'Web UI — review & edit before publishing',
  'Team workspaces & full release history',
  'Hosted, brandable public changelog page',
  'Slack integration & email distribution',
  'Engagement analytics on what readers open',
]
