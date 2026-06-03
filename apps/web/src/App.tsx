import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { WaitlistPage } from '@/pages/WaitlistPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { DocsPage } from '@/pages/DocsPage'
import { ChangelogPage } from '@/pages/ChangelogPage'
import { CopiedToast } from '@/components/ui/CopyCommand'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
      </Routes>
      <CopiedToast />
    </BrowserRouter>
  )
}
