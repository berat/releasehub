import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="ReleaseHub home">
      <span className="mark" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 74C67.732 74 74 67.732 74 60C74 52.268 67.732 46 60 46C52.268 46 46 52.268 46 60C46 67.732 52.268 74 60 74Z" fill="var(--acc)"/>
          <path opacity="0.3" d="M60 68C64.4183 68 68 64.4183 68 60C68 55.5817 64.4183 52 60 52C55.5817 52 52 55.5817 52 60C52 64.4183 55.5817 68 60 68Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M60 33C64.4183 33 68 29.4183 68 25C68 20.5817 64.4183 17 60 17C55.5817 17 52 20.5817 52 25C52 29.4183 55.5817 33 60 33Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M85 43C89.4183 43 93 39.4183 93 35C93 30.5817 89.4183 27 85 27C80.5817 27 77 30.5817 77 35C77 39.4183 80.5817 43 85 43Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M95 68C99.4183 68 103 64.4183 103 60C103 55.5817 99.4183 52 95 52C90.5817 52 87 55.5817 87 60C87 64.4183 90.5817 68 95 68Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M85 93C89.4183 93 93 89.4183 93 85C93 80.5817 89.4183 77 85 77C80.5817 77 77 80.5817 77 85C77 89.4183 80.5817 93 85 93Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M60 103C64.4183 103 68 99.4183 68 95C68 90.5817 64.4183 87 60 87C55.5817 87 52 90.5817 52 95C52 99.4183 55.5817 103 60 103Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M35 93C39.4183 93 43 89.4183 43 85C43 80.5817 39.4183 77 35 77C30.5817 27 27 80.5817 27 85C27 89.4183 30.5817 93 35 93Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M25 68C29.4183 68 33 64.4183 33 60C33 55.5817 29.4183 52 25 52C20.5817 52 17 55.5817 17 60C17 64.4183 20.5817 68 25 68Z" fill="var(--acc)"/>
          <path opacity="0.6" d="M35 43C39.4183 43 43 39.4183 43 35C43 30.5817 39.4183 27 35 27C30.5817 27 27 30.5817 27 35C27 39.4183 30.5817 43 35 43Z" fill="var(--acc)"/>
          <path opacity="0.4" d="M60 60V25" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60L85 35" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60H95" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60L85 85" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60V95" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60L35 85" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60H25" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
          <path opacity="0.4" d="M60 60L35 35" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </span>
      ReleaseHub
    </Link>
  )
}
