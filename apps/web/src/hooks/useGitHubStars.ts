import { useState, useEffect } from 'react'

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function useGitHubStars(repo: string) {
  const [stars, setStars] = useState<string | null>(null)

  useEffect(() => {
    const cacheKey = `gh-stars:${repo}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) { setStars(cached); return }

    fetch(`https://api.github.com/repos/${repo}`)
      .then(r => r.json())
      .then(data => {
        if (typeof data.stargazers_count === 'number') {
          const formatted = formatStars(data.stargazers_count)
          setStars(formatted)
          sessionStorage.setItem(cacheKey, formatted)
        }
      })
      .catch(() => {}) // sessizce fail et
  }, [repo])

  return stars
}
