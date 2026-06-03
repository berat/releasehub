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

export function handleError(err: unknown): never {
  if (err instanceof ReleaseHubError) {
    console.error(chalk.red(`✖ ${err.message}`))
  } else if (err instanceof Error) {
    console.error(chalk.red(`✖ ${err.message}`))
  } else {
    console.error(chalk.red('✖ An unexpected error occurred'))
  }
  process.exit(1)
}
