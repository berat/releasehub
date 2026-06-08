import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { detectRepo, parseRepo } from '../lib/git.js'
import { fetchPullRequests } from '../lib/github.js'
import { analyzePullRequests } from '../lib/ai.js'
import { getActiveAIKey, getActiveProvider, AI_PROVIDER_LABELS } from '../lib/config.js'
import { handleError, AuthError } from '../lib/errors.js'

export interface GenerateOptions {
  from: string
  to: string
  repo?: string
  format: string
  output?: string
  publish?: boolean
  quiet?: boolean
}

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Generate release notes from merged pull requests')
    .requiredOption('--from <tag>', 'Start tag (e.g. v2.3.0)')
    .requiredOption('--to <tag>', 'End tag (e.g. v2.4.0)')
    .option('--repo <repo>', 'Repository in owner/name format (defaults to git remote)')
    .option('--format <format>', 'Output format: github-release | changelog | slack', 'github-release')
    .option('--output <file>', 'Write output to a file instead of stdout')
    .option('--publish', 'Publish directly as a GitHub Release')
    .option('--quiet', 'Suppress progress messages (useful in CI)')
    .action(async (options: GenerateOptions) => {
      try {
        const log = (msg: string) => { if (!options.quiet) process.stderr.write(msg + '\n') }

        log('')

        // 1. Resolve repo
        const repo = options.repo ? parseRepo(options.repo) : detectRepo()
        log(chalk.dim(`  repo     : ${repo.owner}/${repo.name}`))
        log(chalk.dim(`  range    : ${options.from} → ${options.to}`))
        log(chalk.dim(`  format   : ${options.format}`))
        log(chalk.dim(`  provider : ${AI_PROVIDER_LABELS[getActiveProvider()]}`))
        log('')

        // 2. Check AI key
        if (!getActiveAIKey()) {
          throw new AuthError('No AI key found. Run: releasehub ai add-key')
        }

        // 3. Fetch PRs
        const prSpinner = ora({ text: 'Fetching pull requests...', isSilent: options.quiet }).start()
        const prs = await fetchPullRequests(repo, options.from, options.to)

        if (prs.length === 0) {
          prSpinner.warn(chalk.yellow('No merged pull requests found in this range.'))
          log('')
          process.exit(0)
        }

        prSpinner.succeed(`Fetched ${chalk.bold(prs.length)} pull requests`)

        // 4. AI analysis
        const aiSpinner = ora({ text: 'Analyzing with AI...', isSilent: options.quiet }).start()
        const { changes } = await analyzePullRequests(prs)
        const visible = changes.filter(c => c.visible)
        const hidden = changes.filter(c => !c.visible)
        aiSpinner.succeed(`Analyzed — ${chalk.bold(visible.length)} user-facing, ${chalk.dim(`${hidden.length} hidden`)}`)

        // 5. TODO M3: output generation
        log('')
        log(chalk.yellow('  ⚠ Output generation (M3) coming next.'))
        log(chalk.dim('  Preview of what was found:'))
        log('')

        for (const change of visible) {
          log(`  ${categoryLabel(change.category)} ${change.rewritten_title}`)
        }

        if (hidden.length > 0) {
          log('')
          log(chalk.dim(`  ${hidden.length} internal change(s) hidden.`))
        }

        log('')

      } catch (err) {
        handleError(err)
      }
    })
}

function categoryLabel(category: string): string {
  switch (category) {
    case 'feature':     return chalk.blue('[Feature]    ')
    case 'improvement': return chalk.cyan('[Improvement]')
    case 'bugfix':      return chalk.yellow('[Fix]        ')
    case 'breaking':    return chalk.red('[Breaking]   ')
    default:            return chalk.dim('[Internal]   ')
  }
}
