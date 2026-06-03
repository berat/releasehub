import { execSync } from 'child_process'
import { ConfigError } from './errors.js'

export interface RepoInfo {
  owner: string
  name: string
}

/**
 * Parse owner/name from a GitHub remote URL.
 * Supports both SSH (git@github.com:owner/repo.git) and HTTPS (https://github.com/owner/repo.git)
 */
function parseGitHubRemote(url: string): RepoInfo | null {
  // SSH: git@github.com:owner/repo.git or git@p-github.com:owner/repo.git
  const sshMatch = url.match(/github\.com[:/]([^/]+)\/([^/\s.]+?)(?:\.git)?$/)
  if (sshMatch) {
    return { owner: sshMatch[1]!, name: sshMatch[2]! }
  }

  // HTTPS: https://github.com/owner/repo.git
  const httpsMatch = url.match(/github\.com\/([^/]+)\/([^/\s.]+?)(?:\.git)?$/)
  if (httpsMatch) {
    return { owner: httpsMatch[1]!, name: httpsMatch[2]! }
  }

  return null
}

/**
 * Detect repo from the current directory's git remote.
 */
export function detectRepo(): RepoInfo {
  try {
    const remoteUrl = execSync('git remote get-url origin', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim()

    const repo = parseGitHubRemote(remoteUrl)
    if (!repo) {
      throw new ConfigError(
        `Remote origin doesn't look like a GitHub repo.\nPass --repo owner/name explicitly.`,
      )
    }
    return repo
  } catch (err) {
    if (err instanceof ConfigError) throw err
    throw new ConfigError(
      `Not inside a git repository or no remote set.\nPass --repo owner/name explicitly.`,
    )
  }
}

/**
 * Parse "owner/name" string into RepoInfo.
 */
export function parseRepo(repo: string): RepoInfo {
  const parts = repo.split('/')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new ConfigError(`Invalid repo format: "${repo}". Expected: owner/name`)
  }
  return { owner: parts[0], name: parts[1] }
}
