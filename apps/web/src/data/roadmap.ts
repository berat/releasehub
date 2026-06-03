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
      { title: 'Landing page', description: 'Full marketing site with hero, AI demo, output formats, and open source section.', tag: 'Website' },
      { title: 'Docs page', description: 'Full CLI reference with sidebar navigation — commands, flags, GitHub Actions workflow.', tag: 'Website' },
      { title: 'Changelog page', description: 'Versioned changelog with categories. Preview section on the landing page.', tag: 'Website' },
      { title: 'Roadmap page', description: 'Live board with tag filtering — Shipped / Now / Next / Exploring.', tag: 'Website' },
      { title: 'CLI architecture', description: 'Command structure, auth flow, output formats, and CI/CD integration fully specced.', tag: 'CLI' },
    ],
  },
  {
    status: 'now',
    label: 'Now',
    color: 'var(--acc)',
    cards: [
      { title: 'CLI build', description: 'npm package scaffold, GitHub OAuth, Anthropic key management, GitHub data ingestion.', tag: 'CLI' },
    ],
  },
  {
    status: 'next',
    label: 'Next',
    color: 'var(--improve)',
    cards: [
      { title: 'AI analysis & output generation', description: 'Claude API integration, classify PRs, generate github-release / changelog / slack formats.', tag: 'CLI' },
      { title: 'npm publish & launch', description: 'npm install -g @releasehub/cli live. Hacker News, Product Hunt, social posts.', tag: 'Launch' },
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
