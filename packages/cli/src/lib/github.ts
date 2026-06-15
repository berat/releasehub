import { Octokit } from '@octokit/rest'
import { AuthError, ApiError } from './errors.js'
import { getGitHubToken } from './config.js'
import type { RepoInfo } from './git.js'

export interface PullRequest {
  number: number
  title: string
  body: string | null
  labels: string[]
  author: string
  merged_at: string
  url: string
  linked_issues: string[]
}

export interface Tag {
  name: string
  sha: string
  date: string | null
}

function getOctokit(): Octokit {
  const token = getGitHubToken()
  if (!token) throw new AuthError('No GitHub token found. Run: releasehub auth login')
  const fetchImpl = typeof fetch !== 'undefined' ? fetch : undefined
  return new Octokit({ auth: token, ...(fetchImpl ? { request: { fetch: fetchImpl } } : {}) })
}

/**
 * Extract linked issue numbers from PR body text.
 * Matches: "Closes #123", "Fixes #456", "Resolves #789"
 */
function extractLinkedIssues(body: string | null): string[] {
  if (!body) return []
  const matches = body.matchAll(/(?:closes?|fixe?s?|resolves?)\s+#(\d+)/gi)
  return [...matches].map(m => `#${m[1]}`)
}

/**
 * Fetch all tags for a repo, sorted by date descending.
 */
export async function fetchTags(repo: RepoInfo): Promise<Tag[]> {
  const octokit = getOctokit()

  try {
    const tags: Tag[] = []
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listTags, {
      owner: repo.owner,
      repo: repo.name,
      per_page: 100,
    })

    for await (const { data } of iterator) {
      for (const tag of data) {
        // Fetch commit date for each tag
        let date: string | null = null
        try {
          const { data: commit } = await octokit.rest.git.getCommit({
            owner: repo.owner,
            repo: repo.name,
            commit_sha: tag.commit.sha,
          })
          date = commit.author.date
        } catch {
          // ignore — date is optional
        }
        tags.push({ name: tag.name, sha: tag.commit.sha, date })
      }
    }

    return tags
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: number }).status
      if (status === 401) throw new AuthError('GitHub token is invalid or expired. Run: releasehub auth login')
      if (status === 404) throw new ApiError(`Repository ${repo.owner}/${repo.name} not found.`, 404)
      if (status === 403) throw new ApiError('GitHub API rate limit exceeded. Wait a moment and try again.', 403)
    }
    throw err
  }
}

/**
 * Fetch merged PRs between two tags.
 */
export async function fetchPullRequests(
  repo: RepoInfo,
  fromTag: string,
  toTag: string,
): Promise<PullRequest[]> {
  const octokit = getOctokit()

  try {
    // Compare the two tags to get the list of commits
    const { data: comparison } = await octokit.rest.repos.compareCommits({
      owner: repo.owner,
      repo: repo.name,
      base: fromTag,
      head: toTag,
    })

    if (comparison.commits.length === 0) return []

    // Collect commit SHAs in the range
    const commitShas = new Set(comparison.commits.map(c => c.sha))

    // Fetch merged PRs and filter to those whose merge commit is in range
    const prs: PullRequest[] = []
    const iterator = octokit.paginate.iterator(octokit.rest.pulls.list, {
      owner: repo.owner,
      repo: repo.name,
      state: 'closed',
      per_page: 100,
      sort: 'updated',
      direction: 'desc',
    })

    for await (const { data } of iterator) {
      for (const pr of data) {
        if (!pr.merged_at) continue
        if (!pr.merge_commit_sha) continue
        if (!commitShas.has(pr.merge_commit_sha)) continue

        prs.push({
          number: pr.number,
          title: pr.title,
          body: pr.body ?? null,
          labels: pr.labels.map(l => (typeof l === 'string' ? l : l.name ?? '')),
          author: pr.user?.login ?? 'unknown',
          merged_at: pr.merged_at,
          url: pr.html_url,
          linked_issues: extractLinkedIssues(pr.body ?? null),
        })
      }

      // Stop paginating once PRs are older than the from-tag comparison window
      const oldest = data[data.length - 1]
      if (oldest && comparison.commits[0]) {
        const oldestDate = new Date(oldest.updated_at).getTime()
        const baseDate = new Date(comparison.commits[0].commit.committer?.date ?? 0).getTime()
        if (oldestDate < baseDate - 7 * 24 * 60 * 60 * 1000) break
      }
    }

    // Sort by merged_at ascending
    return prs.sort(
      (a, b) => new Date(a.merged_at).getTime() - new Date(b.merged_at).getTime(),
    )
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: number }).status
      if (status === 401) throw new AuthError('GitHub token is invalid or expired. Run: releasehub auth login')
      if (status === 404) throw new ApiError(`Repository or tag not found. Check --from and --to values.`, 404)
      if (status === 403) throw new ApiError('GitHub API rate limit exceeded. Wait a moment and try again.', 403)
    }
    throw err
  }
}

export interface GitHubRelease {
  id: number
  html_url: string
  name: string
}

/**
 * Create a GitHub Release for the given tag with the provided body.
 */
export async function publishGitHubRelease(
  repo: RepoInfo,
  tag: string,
  body: string,
): Promise<GitHubRelease> {
  const octokit = getOctokit()

  try {
    const { data } = await octokit.rest.repos.createRelease({
      owner: repo.owner,
      repo: repo.name,
      tag_name: tag,
      name: tag,
      body,
      draft: false,
      prerelease: tag.includes('-'),
    })

    return { id: data.id, html_url: data.html_url, name: data.name ?? tag }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: number }).status
      if (status === 401) throw new AuthError('GitHub token is invalid or expired. Run: releasehub auth login')
      if (status === 422) throw new ApiError(`A release for tag "${tag}" already exists.`, 422)
      if (status === 403) throw new ApiError('GitHub API rate limit exceeded. Wait a moment and try again.', 403)
    }
    throw err
  }
}
