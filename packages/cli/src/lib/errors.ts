import chalk from 'chalk'

export class ReleaseHubError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReleaseHubError'
  }
}

export class AuthError extends ReleaseHubError {
  constructor(message = 'Not authenticated. Run: releasehub auth login') {
    super(message)
    this.name = 'AuthError'
  }
}

export class ConfigError extends ReleaseHubError {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

export class ApiError extends ReleaseHubError {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const HINTS: Record<string, string> = {
  ConfigError: 'Run: releasehub --help for usage',
}

export function handleError(err: unknown): never {
  console.error('')

  if (err instanceof ReleaseHubError) {
    console.error(`  ${chalk.red('✖')} ${err.message}`)
    const hint = HINTS[err.name]
    if (hint) console.error(`  ${chalk.dim(hint)}`)
  } else if (err instanceof Error) {
    console.error(`  ${chalk.red('✖')} ${err.message}`)
  } else {
    console.error(`  ${chalk.red('✖')} An unexpected error occurred.`)
  }

  console.error('')
  process.exit(1)
}
