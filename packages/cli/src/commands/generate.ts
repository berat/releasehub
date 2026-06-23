import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { writeFileSync } from 'fs'
import { detectRepo, parseRepo } from '../lib/git.js'
import { fetchPullRequests, publishGitHubRelease } from '../lib/github.js'
import { analyzePullRequests } from '../lib/ai.js'
import { getActiveAIKey, getActiveProvider, AI_PROVIDER_LABELS } from '../lib/config.js'
import { handleError, AuthError } from '../lib/errors.js'
import { formatOutput } from '../lib/formatters.js'

export interface GenerateOptions {
  from: string
  to: string
  repo?: string
  format: string
  output?: string
  publish?: boolean
  quiet?: boolean
  dryRun?: boolean
}

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Generate release notes from merged pull requests')
    .addHelpText('after', `
${chalk.bold('Formats:')}
  ${chalk.cyan('github-release')}  ${chalk.dim('Markdown for a GitHub Release page (default)')}
  ${chalk.cyan('changelog')}       ${chalk.dim('Keep a Changelog format, with date')}
  ${chalk.cyan('slack')}           ${chalk.dim('Compact Slack message with emoji')}

${chalk.bold('Examples:')}
  ${chalk.cyan('releasehub generate --from v1.0.0 --to v1.1.0')}
  ${chalk.cyan('releasehub generate --from v1.0.0 --to v1.1.0 --format slack')}
  ${chalk.cyan('releasehub generate --from v1.0.0 --to v1.1.0 --output release.md')}
  ${chalk.cyan('releasehub generate --from v1.0.0 --to v1.1.0 --publish')}
  ${chalk.cyan('releasehub generate --from v1.0.0 --to v1.1.0 --quiet')}  ${chalk.dim('(CI mode — stdout only)')}
    `)
    .requiredOption('--from <tag>', 'Start tag (e.g. v1.0.0)')
    .requiredOption('--to <tag>', 'End tag (e.g. v1.1.0)')
    .option('--repo <repo>', 'Repository in owner/name format (auto-detected from git remote if omitted)')
    .option('--format <format>', 'Output format: github-release | changelog | slack', 'github-release')
    .option('--output <file>', 'Write output to a file instead of printing to stdout')
    .option('--publish', 'Publish directly as a GitHub Release via the API')
    .option('--quiet', 'Suppress progress output — prints only the final result (useful in CI)')
    .option('--dry-run', 'Fetch PRs and show what would be analyzed — no AI call, no output written')
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

        // 2. Check AI key (skip in dry-run)
        if (!options.dryRun && !getActiveAIKey()) {
          throw new AuthError('No AI key found. Run: releasehub ai add-key')
        }

        // 3. Fetch PRs
        const prSpinner = ora({ text: 'Fetching pull requests...', isSilent: options.quiet }).start()
        const prs = await fetchPullRequests(repo, options.from, options.to)

        if (prs.length === 0) {
          prSpinner.warn(chalk.yellow('No merged pull requests found in this range.'))
          log(chalk.dim('  Make sure the tags exist and there are merged PRs between them.'))
          log(chalk.dim(`  Try: git tag --list to see available tags.`))
          log('')
          process.exit(0)
        }

        prSpinner.succeed(`Found ${chalk.bold(prs.length)} pull requests between ${chalk.cyan(options.from)} and ${chalk.cyan(options.to)}`)

        // 4. Dry run — show PR list, skip AI
        if (options.dryRun) {
          log('')
          log(chalk.bold('  Dry run — no AI call will be made'))
          log('')
          prs.forEach((pr, i) => {
            const labels = pr.labels?.join(', ')
            const labelStr = labels ? chalk.dim(` [${labels}]`) : ''
            log(`  ${chalk.dim(`${i + 1}.`)} ${pr.title}${labelStr}`)
          })
          log('')
          log(chalk.dim(`  ${prs.length} PRs would be sent to ${AI_PROVIDER_LABELS[getActiveProvider()]} for analysis.`))
          log(chalk.dim('  Remove --dry-run to generate release notes.'))
          log('')
          process.exit(0)
        }

        // 5. AI analysis
        const aiSpinner = ora({ text: 'Analyzing with AI...', isSilent: options.quiet }).start()
        const { changes } = await analyzePullRequests(prs)
        const visible = changes.filter(c => c.visible)
        const hidden = changes.filter(c => !c.visible)
        aiSpinner.succeed(`Analyzed — ${chalk.bold(visible.length)} user-facing, ${chalk.dim(`${hidden.length} hidden`)}`)

        if (visible.length === 0) {
          log('')
          log(chalk.yellow('  No user-facing changes found.'))
          log(chalk.dim('  All pull requests were classified as internal (refactors, CI, dependencies).'))
          log(chalk.dim('  Nothing to publish for this release range.'))
          log('')
          process.exit(0)
        }

        // 6. Format output
        const output = formatOutput(options.format, { version: options.to, changes })

        // 7. Write or print
        if (options.output) {
          writeFileSync(options.output, output, 'utf8')
          log('')
          log(chalk.green(`  ✓ Written to ${options.output}`))
          log('')
        } else if (!options.publish) {
          // Only print to stdout if not publishing (publish prints the URL instead)
          process.stdout.write(output)
        }

        // 8. Publish as GitHub Release
        if (options.publish) {
          const publishSpinner = ora({ text: 'Publishing GitHub Release...', isSilent: options.quiet }).start()

          // --publish only makes sense with github-release format
          const releaseBody = options.format === 'github-release'
            ? output
            : formatOutput('github-release', { version: options.to, changes })

          const release = await publishGitHubRelease(repo, options.to, releaseBody)
          publishSpinner.succeed(`Published: ${chalk.cyan(release.html_url)}`)
          log('')
        }

      } catch (err) {
        handleError(err)
      }
    })
}
