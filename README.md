# ReleaseHub

> AI-powered release notes from your terminal.

ReleaseHub reads your merged pull requests, filters the noise, rewrites technical titles into plain language, and outputs GitHub release notes, a changelog, and a Slack message — in one command.

```bash
npm install -g @releasehub/cli
releasehub auth login
releasehub ai add-key
releasehub generate --from v2.3.0 --to v2.4.0
```

## Status

🚧 **CLI is under active development.** The website is live at [releasehub.app](https://releasehub.app).

## Repo structure

```
releasehub/
├── apps/
│   └── web/          # Landing page + docs (React + Vite)
├── planning/         # Product docs, milestones, architecture
└── README.md
```

CLI package (`packages/cli`) coming in M0.

## Roadmap

See [releasehub.app/roadmap](https://releasehub.app/roadmap) or [planning/MILESTONES.md](planning/MILESTONES.md).

## License

MIT
