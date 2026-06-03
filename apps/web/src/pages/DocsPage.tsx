import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Callout } from '@/components/ui/Callout'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { useActiveTocSection } from '@/hooks/useActiveTocSection'

// ─── Sidebar structure ───────────────────────────────────────────────
const SECTIONS = [
  {
    label: 'Getting started',
    items: [
      { id: 'prerequisites', label: 'Prerequisites' },
      { id: 'installation', label: 'Installation' },
      { id: 'github-auth', label: 'GitHub auth' },
      { id: 'ai-key', label: 'AI key' },
    ],
  },
  {
    label: 'Usage',
    items: [
      { id: 'generate', label: 'Generate' },
      { id: 'output-formats', label: 'Output formats' },
      { id: 'flags', label: 'All flags' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { id: 'github-actions', label: 'GitHub Actions' },
      { id: 'env-vars', label: 'Environment variables' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { id: 'config-file', label: 'Config file' },
      { id: 'auth-commands', label: 'Auth commands' },
      { id: 'ai-commands', label: 'AI commands' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
    ],
  },
]

const ALL_IDS = SECTIONS.flatMap(s => s.items.map(i => i.id))

// ─── Sidebar ─────────────────────────────────────────────────────────
function DocsSidebar() {
  const activeId = useActiveTocSection(ALL_IDS)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        className="docs-mobile-toggle"
        onClick={() => setMobileOpen(o => !o)}
        aria-expanded={mobileOpen}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
        On this page
      </button>

      <aside className={`docs-sidebar${mobileOpen ? ' open' : ''}`}>
        {SECTIONS.map(section => (
          <div key={section.label} className="docs-sidebar-group">
            <p className="docs-sidebar-title">{section.label}</p>
            {section.items.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`docs-sidebar-link${activeId === item.id ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </aside>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────
export function DocsPage() {
  return (
    <PageLayout>
      <div className="docs-page">
        <div className="docs-layout wrap">
          <DocsSidebar />

          <article className="prose docs-content">

            {/* ── GETTING STARTED ── */}
            <h1 className="docs-h1">Documentation</h1>
            <p className="docs-intro">ReleaseHub is a CLI tool that turns your merged pull requests into release notes, changelogs, and Slack messages — using AI. No server, no Docker, no database.</p>

            <h2 id="prerequisites">Prerequisites</h2>
            <ul>
              <li><strong>Node.js 18+</strong></li>
              <li><strong>A GitHub account</strong> with access to the repos you want to analyze</li>
              <li><strong>An AI provider key</strong> — Anthropic or OpenAI (you choose during setup)</li>
            </ul>

            <h2 id="installation">Installation</h2>
            <p>Install globally via npm:</p>
            <CodeBlock>{'npm install -g @releasehub/cli'}</CodeBlock>
            <p>Or run without installing (useful in CI):</p>
            <CodeBlock>{'npx @releasehub/cli generate --from v2.3.0 --to v2.4.0'}</CodeBlock>
            <p>Verify the install:</p>
            <CodeBlock>{'releasehub --version'}</CodeBlock>

            <h2 id="github-auth">GitHub auth</h2>
            <p>Connect your GitHub account once. Opens a browser window for OAuth:</p>
            <CodeBlock>{'releasehub auth login'}</CodeBlock>
            <p>Your token is saved to <code className="inline">~/.releasehub/config.json</code> and reused automatically on every subsequent command.</p>
            <p>To disconnect:</p>
            <CodeBlock>{'releasehub auth logout'}</CodeBlock>
            <Callout>
              ReleaseHub only requests read access to your repositories. Write access is only used if you pass <code className="inline">--publish</code> to create a GitHub Release.
            </Callout>

            <h2 id="ai-key">AI key</h2>
            <p>ReleaseHub supports Anthropic (Claude) and OpenAI (GPT-4o). Run the command and select your provider interactively:</p>
            <CodeBlock>{'releasehub ai add-key'}</CodeBlock>
            <p>You'll be shown a numbered list — pick your provider, then paste your API key. It's validated immediately and saved to <code className="inline">~/.releasehub/config.json</code> with <code className="inline">chmod 600</code> permissions. It is never sent to ReleaseHub servers.</p>
            <ul>
              <li>Anthropic key: <a className="ln" href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
              <li>OpenAI key: <a className="ln" href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
            </ul>
            <p>To switch providers later:</p>
            <CodeBlock>{'releasehub ai switch'}</CodeBlock>
            <p>To check the status of all saved keys:</p>
            <CodeBlock>{'releasehub ai status'}</CodeBlock>
            <p>Average cost: <strong>~$0.003 per analysis</strong> (20 PRs). Costs go directly to your AI provider account.</p>

            {/* ── USAGE ── */}
            <h2 id="generate">Generate</h2>
            <p>Point the CLI at a tag range:</p>
            <CodeBlock>{'releasehub generate --from v2.3.0 --to v2.4.0'}</CodeBlock>
            <p>By default the repo is inferred from the current directory's git remote. Specify it explicitly if needed:</p>
            <CodeBlock>{'releasehub generate --repo acme/backend --from v2.3.0 --to v2.4.0'}</CodeBlock>
            <p>Write to a file instead of printing to stdout:</p>
            <CodeBlock>{'releasehub generate --from v2.3.0 --to v2.4.0 --output RELEASE.md'}</CodeBlock>
            <p>Publish directly as a GitHub Release:</p>
            <CodeBlock>{'releasehub generate --from v2.3.0 --to v2.4.0 --publish'}</CodeBlock>

            <h2 id="output-formats">Output formats</h2>
            <p>Use <code className="inline">--format</code> to choose the output. Default is <code className="inline">github-release</code>.</p>

            <h3>github-release</h3>
            <p>Grouped markdown ready to paste into a GitHub Release.</p>
            <CodeBlock>{'releasehub generate --from v2.3.0 --to v2.4.0 --format github-release'}</CodeBlock>
            <div className="code">
              <pre>{`## What's New in v2.4.0

### 🚀 New Features
- Sign in with Apple is now available

### ⚡ Improvements
- Dashboard now loads significantly faster

### 🐛 Bug Fixes
- Fixed an issue that could log you out unexpectedly

---
**Full Changelog:** https://github.com/acme/backend/compare/v2.3.0...v2.4.0`}</pre>
            </div>

            <h3>changelog</h3>
            <p>Clean, date-stamped changelog entry.</p>
            <CodeBlock>{'releasehub generate --from v2.3.0 --to v2.4.0 --format changelog'}</CodeBlock>
            <div className="code">
              <pre>{`## v2.4.0 — 2026-06-03

### New
- Sign in with Apple is now available

### Fixed
- Fixed an issue that could log you out unexpectedly`}</pre>
            </div>

            <h3>slack</h3>
            <p>Short Slack-ready message with highlights.</p>
            <CodeBlock>{'releasehub generate --from v2.3.0 --to v2.4.0 --format slack'}</CodeBlock>
            <div className="code">
              <pre>{`🚀 *backend* shipped v2.4.0

2 new feature(s), 1 improvement(s), 2 bug fix(es)

Highlights:
• Sign in with Apple is now available
• Dashboard now loads significantly faster

Full notes → https://github.com/acme/backend/releases/tag/v2.4.0`}</pre>
            </div>

            <h2 id="flags">All flags</h2>
            <table className="envtable">
              <thead>
                <tr><th>Flag</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>--repo</td><td>git remote</td><td>Repository in <code className="inline">owner/name</code> format. Inferred from git remote if omitted.</td></tr>
                <tr><td>--from</td><td>required</td><td>Start tag or date (e.g. <code className="inline">v2.3.0</code> or <code className="inline">2026-05-01</code>).</td></tr>
                <tr><td>--to</td><td>required</td><td>End tag or date.</td></tr>
                <tr><td>--format</td><td>github-release</td><td>Output format: <code className="inline">github-release</code>, <code className="inline">changelog</code>, <code className="inline">slack</code>.</td></tr>
                <tr><td>--output</td><td>stdout</td><td>Write output to a file instead of printing.</td></tr>
                <tr><td>--publish</td><td>false</td><td>Create a GitHub Release via the API after generating.</td></tr>
                <tr><td>--quiet</td><td>false</td><td>Suppress progress messages. Only the output is printed. Useful in CI.</td></tr>
              </tbody>
            </table>

            {/* ── AUTOMATION ── */}
            <h2 id="github-actions">GitHub Actions</h2>
            <p>Add two secrets to your repo under <strong>Settings → Secrets → Actions</strong>:</p>
            <ul>
              <li><code className="inline">RELEASEHUB_GITHUB_TOKEN</code> — run <code className="inline">releasehub auth login</code> locally, then copy the token from <code className="inline">~/.releasehub/config.json</code></li>
              <li><code className="inline">RELEASEHUB_ANTHROPIC_KEY</code> — your Anthropic API key</li>
            </ul>
            <p>Then add this workflow:</p>
            <CodeBlock>
              {'# .github/workflows/release.yml\n'}
              {'name: Release\n\n'}
              {'on:\n'}
              {'  push:\n'}
              {"    tags: ['v*']\n\n"}
              {'jobs:\n'}
              {'  release:\n'}
              {'    runs-on: ubuntu-latest\n'}
              {'    steps:\n'}
              {'      - uses: actions/checkout@v4\n'}
              {'        with:\n'}
              {'          fetch-depth: 0\n\n'}
              {'      - name: Get previous tag\n'}
              {'        id: prev_tag\n'}
              {'        run: |\n'}
              {"          PREV=$(git tag --sort=-version:refname | sed -n '2p')\n"}
              {'          echo "tag=$PREV" >> $GITHUB_OUTPUT\n\n'}
              {'      - name: Generate release notes\n'}
              {'        env:\n'}
              {'          RELEASEHUB_GITHUB_TOKEN: ${{ secrets.RELEASEHUB_GITHUB_TOKEN }}\n'}
              {'          RELEASEHUB_ANTHROPIC_KEY: ${{ secrets.RELEASEHUB_ANTHROPIC_KEY }}\n'}
              {'        run: |\n'}
              {'          npx @releasehub/cli generate \\\n'}
              {'            --from ${{ steps.prev_tag.outputs.tag }} \\\n'}
              {'            --to ${{ github.ref_name }} \\\n'}
              {'            --format github-release \\\n'}
              {'            --output release-notes.md \\\n'}
              {'            --quiet\n\n'}
              {'      - name: Create GitHub Release\n'}
              {'        run: |\n'}
              {'          gh release create ${{ github.ref_name }} \\\n'}
              {'            --title "${{ github.ref_name }}" \\\n'}
              {'            --notes-file release-notes.md\n'}
              {'        env:\n'}
              {'          GH_TOKEN: ${{ github.token }}'}
            </CodeBlock>
            <Callout>
              The workflow triggers on any tag starting with <code className="inline">v</code>. Adjust the <code className="inline">tags</code> filter to match your versioning convention.
            </Callout>

            <h2 id="env-vars">Environment variables</h2>
            <p>Environment variables take precedence over the config file. Use these in CI/CD instead of storing tokens on disk.</p>
            <table className="envtable">
              <thead>
                <tr><th>Variable</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>RELEASEHUB_GITHUB_TOKEN</td><td>GitHub OAuth token. Overrides the token saved by <code className="inline">releasehub auth login</code>.</td></tr>
                <tr><td>RELEASEHUB_ANTHROPIC_KEY</td><td>Anthropic API key. Used when active provider is <code className="inline">anthropic</code>.</td></tr>
                <tr><td>RELEASEHUB_OPENAI_KEY</td><td>OpenAI API key. Used when active provider is <code className="inline">openai</code>.</td></tr>
              </tbody>
            </table>

            {/* ── REFERENCE ── */}
            <h2 id="config-file">Config file</h2>
            <p>On first login, ReleaseHub creates <code className="inline">~/.releasehub/config.json</code>:</p>
            <div className="code">
              <pre>{`{
  "github_token": "ghp_...",
  "ai_provider": "anthropic",
  "anthropic_key": "sk-ant-...",
  "openai_key": "sk-...",
  "default_format": "github-release"
}`}</pre>
            </div>
            <p>The file is set to <code className="inline">chmod 600</code> — readable only by your user. Environment variables always take precedence over this file.</p>

            <h2 id="auth-commands">Auth commands</h2>
            <table className="envtable">
              <thead>
                <tr><th>Command</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>releasehub auth login</td><td>Connect GitHub via OAuth. Opens a browser window.</td></tr>
                <tr><td>releasehub auth logout</td><td>Remove the saved GitHub token.</td></tr>
              </tbody>
            </table>

            <h2 id="ai-commands">AI commands</h2>
            <table className="envtable">
              <thead>
                <tr><th>Command</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>releasehub ai add-key</td><td>Select a provider (Anthropic or OpenAI) and save your API key.</td></tr>
                <tr><td>releasehub ai switch</td><td>Switch the active AI provider. Offers to add a key if one is missing.</td></tr>
                <tr><td>releasehub ai remove-key</td><td>Remove a saved key. Prompts which provider to remove.</td></tr>
                <tr><td>releasehub ai status</td><td>Show all providers, validate each saved key.</td></tr>
              </tbody>
            </table>

            <h2 id="troubleshooting">Troubleshooting</h2>

            <h3>Auth token expired</h3>
            <p>Run <code className="inline">releasehub auth login</code> again to refresh your token.</p>

            <h3>Generation fails with an AI error</h3>
            <p>Run <code className="inline">releasehub ai status</code> to confirm your key is valid and has quota. Very large releases (50+ PRs) are batched automatically — if it still fails, try a narrower tag range.</p>

            <h3>Empty output / everything classified as internal</h3>
            <p>If a release only contains refactors, dependency bumps, and CI changes, there may be nothing user-facing to announce. This is expected behaviour, not a bug.</p>

            <h3>Can't find the repo</h3>
            <p>If you're not inside a git directory or the remote isn't GitHub, pass <code className="inline">--repo owner/name</code> explicitly.</p>

            <h3>Rate limit errors</h3>
            <p>The GitHub API allows 5,000 requests per hour for authenticated users. If you hit the limit, wait a few minutes and try again. Very large repos with hundreds of PRs per release are the most likely to trigger this.</p>

            <Callout style={{ marginTop: 40 }}>
              Something not covered here? Open an issue on{' '}
              <a className="ln" href="https://github.com/berat/releasehub" target="_blank" rel="noopener noreferrer">GitHub</a>.
            </Callout>

          </article>
        </div>
      </div>
    </PageLayout>
  )
}
