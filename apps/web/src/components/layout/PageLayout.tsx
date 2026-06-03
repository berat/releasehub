import type { ReactNode } from 'react'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
