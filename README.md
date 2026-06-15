# ReleaseHub

[![npm version](https://img.shields.io/npm/v/@releasehub/cli.svg)](https://www.npmjs.com/package/@releasehub/cli)
[![npm downloads](https://img.shields.io/npm/dm/@releasehub/cli.svg)](https://www.npmjs.com/package/@releasehub/cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js 18+](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

> AI-powered release notes from your terminal.

ReleaseHub reads your merged pull requests, filters the noise, rewrites technical titles into plain language, and outputs GitHub release notes, a changelog entry, or a Slack message — in one command.

```bash
npx @releasehub/cli generate --from v2.3.0 --to v2.4.0
```

---

## Install

```bash
npm install -g @releasehub/cli
```

Requires Node.js 18 or later.

---

## Quick start

```bash
# 1. Connect your GitHub account
releasehub auth login

# 2. Add your AI key (Anthropic, OpenAI, or Gemini)
releasehub ai add-key

# 3. Generate release notes
releasehub generate --from v2.3.0 --to v2.4.0
```

---

## Output formats

```bash
# GitHub Release markdown (default)
releasehub generate --from v2.3.0 --to v2.4.0 --format github-release

# Keep a Changelog format
releasehub generate --from v2.3.0 --to v2.4.0 --format changelog

# Compact Slack message
releasehub generate --from v2.3.0 --to v2.4.0 --format slack
```

**Example output** (`--format github-release`):

```markdown
## v2.4.0

This release includes 2 new features, 3 improvements and 1 bug fix.

### ✨ New Features

- You can now export reports as CSV directly from the dashboard
- Added keyboard shortcuts for the most common actions

### 🔧 Improvements

- Search results now load noticeably faster
- Dark mode contrast improved across all pages
- Notification preferences are easier to find in settings

### 🐛 Bug Fixes

- Fixed an issue where file uploads would silently fail on slow connections
```

---

## Write to a file

```bash
releasehub generate --from v2.3.0 --to v2.4.0 --output RELEASE.md
```

## Publish as a GitHub Release

```bash
releasehub generate --from v2.3.0 --to v2.4.0 --publish
```

## Use in CI (GitHub Actions)

```yaml
- name: Generate release notes
  env:
    RELEASEHUB_GITHUB_TOKEN: ${{ secrets.RELEASEHUB_GITHUB_TOKEN }}
    RELEASEHUB_ANTHROPIC_KEY: ${{ secrets.RELEASEHUB_ANTHROPIC_KEY }}
  run: |
    npx @releasehub/cli generate \
      --from ${{ github.event.release.target_commitish }} \
      --to ${{ github.ref_name }} \
      --format github-release \
      --quiet \
      --output release-notes.md
```

---

## Commands

| Command | Description |
|---|---|
| `releasehub auth login` | Connect your GitHub account via OAuth |
| `releasehub auth logout` | Disconnect and remove saved token |
| `releasehub ai add-key` | Add an Anthropic or OpenAI key |
| `releasehub ai switch` | Switch active AI provider |
| `releasehub ai status` | Show provider status and validate keys |
| `releasehub generate` | Generate release notes from merged PRs |

### `generate` flags

| Flag | Default | Description |
|---|---|---|
| `--from <tag>` | required | Start tag |
| `--to <tag>` | required | End tag |
| `--repo <owner/name>` | auto-detect | Repository (defaults to git remote) |
| `--format <format>` | `github-release` | `github-release` \| `changelog` \| `slack` |
| `--output <file>` | stdout | Write output to a file |
| `--publish` | — | Publish as a GitHub Release |
| `--quiet` | — | Suppress progress output (CI mode) |

---

## AI providers

| Provider | Model | Set key via |
|---|---|---|
| Anthropic | claude-sonnet-4-6 | `releasehub ai add-key` or `RELEASEHUB_ANTHROPIC_KEY` |
| OpenAI | gpt-4o | `releasehub ai add-key` or `RELEASEHUB_OPENAI_KEY` |
| Google Gemini | gemini-1.5-flash | `releasehub ai add-key` or `RELEASEHUB_GEMINI_KEY` |

Anthropic is the default. Switch with `releasehub ai switch`.

---

## Environment variables

| Variable | Description |
|---|---|
| `RELEASEHUB_GITHUB_TOKEN` | GitHub personal access token (alternative to `auth login`) |
| `RELEASEHUB_ANTHROPIC_KEY` | Anthropic API key |
| `RELEASEHUB_OPENAI_KEY` | OpenAI API key |
| `RELEASEHUB_GEMINI_KEY` | Google Gemini API key |
| `RELEASEHUB_AI_PROVIDER` | Override active provider: `anthropic`, `openai`, or `gemini` |

---

## Repo structure

```
releasehub/
├── apps/
│   └── web/          # Landing page + docs (React + Vite)
├── packages/
│   └── cli/          # @releasehub/cli npm package
└── planning/         # Product docs, milestones, architecture
```

---

## Support

If ReleaseHub saves you time, consider buying me a coffee:

<a href="https://www.buymeacoffee.com/beratbozkurt0" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 60px !important;width: 217px !important;" ></a>

---

## License

MIT — see [LICENSE](LICENSE).

---

Built by [@berat](https://twitter.com/beratbuilds)
