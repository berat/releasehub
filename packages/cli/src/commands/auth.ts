import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { updateConfig, writeConfig, readConfig } from '../lib/config.js'
import { handleError, ApiError } from '../lib/errors.js'

// GitHub OAuth device flow
const GITHUB_CLIENT_ID = process.env.RELEASEHUB_GITHUB_CLIENT_ID ?? 'Ov23lilDl2r3neGz7d7P'

async function requestDeviceCode(): Promise<{
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}> {
  const res = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      scope: 'repo read:user',
    }),
  })

  if (!res.ok) throw new ApiError('Failed to connect to GitHub. Check your internet connection and try again.', res.status)
  return res.json() as Promise<{
    device_code: string
    user_code: string
    verification_uri: string
    expires_in: number
    interval: number
  }>
}

async function pollForToken(
  deviceCode: string,
  interval: number,
): Promise<string> {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  while (true) {
    await delay(interval * 1000)

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    })

    const data = await res.json() as {
      access_token?: string
      error?: string
      error_description?: string
    }

    if (data.access_token) return data.access_token
    if (data.error === 'authorization_pending') continue
    if (data.error === 'slow_down') { await delay(5000); continue }
    if (data.error === 'expired_token') throw new ApiError('The code expired. Run releasehub auth login again.')
    if (data.error === 'access_denied') throw new ApiError('Authorization was cancelled.')
    throw new ApiError(data.error_description ?? 'GitHub authorization failed.')
  }
}

async function getGitHubUser(token: string): Promise<{ login: string; name: string }> {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': '@releasehub/cli',
    },
  })
  if (!res.ok) throw new ApiError('Failed to fetch your GitHub profile.', res.status)
  return res.json() as Promise<{ login: string; name: string }>
}

export function registerAuthCommands(program: Command): void {
  const auth = program
    .command('auth')
    .description('Manage GitHub authentication')
    .addHelpText('after', `
${chalk.bold('Commands:')}
  ${chalk.cyan('releasehub auth login')}   ${chalk.dim('Connect your GitHub account')}
  ${chalk.cyan('releasehub auth logout')}  ${chalk.dim('Disconnect and remove saved token')}
    `)

  auth
    .command('login')
    .description('Connect your GitHub account via OAuth')
    .addHelpText('after', `
${chalk.dim('Opens a GitHub device authorization flow in your browser.')}
${chalk.dim('Your token is stored locally in ~/.releasehub/config.json')}
    `)
    .action(async () => {
      try {
        console.log('')
        const spinner = ora('Connecting to GitHub...').start()
        const { device_code, user_code, verification_uri, interval } = await requestDeviceCode()
        spinner.stop()

        console.log(chalk.bold('  Open this URL in your browser:'))
        console.log(`  ${chalk.cyan(verification_uri)}`)
        console.log('')
        console.log(chalk.bold('  Enter this code when prompted:'))
        console.log(`  ${chalk.yellow.bold(user_code)}`)
        console.log('')

        const waiting = ora('Waiting for authorization...').start()
        const token = await pollForToken(device_code, interval)
        const user = await getGitHubUser(token)

        updateConfig({ github_token: token })
        waiting.succeed(`Authenticated as ${chalk.bold('@' + user.login)}`)
        console.log('')
        console.log(chalk.dim('  Next: releasehub ai add-key'))
        console.log('')
      } catch (err) {
        handleError(err)
      }
    })

  auth
    .command('logout')
    .description('Disconnect your GitHub account and remove saved token')
    .action(() => {
      try {
        const config = readConfig()
        if (!config.github_token) {
          console.log('')
          console.log(chalk.yellow('  You are not logged in.'))
          console.log('')
          return
        }
        delete config.github_token
        writeConfig(config)
        console.log('')
        console.log(chalk.green('  ✔ Logged out successfully.'))
        console.log('')
      } catch (err) {
        handleError(err)
      }
    })
}
