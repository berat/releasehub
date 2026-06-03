interface Crumb {
  label: string
  href?: string
}

interface BreadcrumbProps {
  crumbs: Crumb[]
  center?: boolean
}

export function Breadcrumb({ crumbs, center }: BreadcrumbProps) {
  return (
    <div className="crumb" style={center ? { justifyContent: 'center' } : undefined}>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="sep">/</span>}
          {crumb.href
            ? <a href={crumb.href}>{crumb.label}</a>
            : <span>{crumb.label}</span>
          }
        </span>
      ))}
    </div>
  )
}
