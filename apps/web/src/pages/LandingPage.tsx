import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { TrustStrip } from '@/components/landing/TrustStrip'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { FlowSection } from '@/components/landing/FlowSection'
import { AIUnderstandingSection } from '@/components/landing/AIUnderstandingSection'
import { OutputsSection } from '@/components/landing/OutputsSection'
import { VSGitHubSection } from '@/components/landing/VSGitHubSection'
import { OpenSourceSection } from '@/components/landing/OpenSourceSection'
import { CTASection } from '@/components/landing/CTASection'
import { ChangelogPreview } from '@/components/landing/ChangelogPreview'
import { Footer } from '@/components/landing/Footer'

export function LandingPage() {
  return (
    <>
      <Nav />
      <a id="top" />
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <FlowSection />
      <AIUnderstandingSection />
      <OutputsSection />
      <VSGitHubSection />
      <OpenSourceSection />
      <CTASection />
      <ChangelogPreview />
      <Footer />
    </>
  )
}
