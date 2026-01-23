import {
  Hero,
  ProblemSection,
  SolutionSection,
  HowItWorks,
  PricingPreview,
  WaitlistCTA,
  Footer,
} from "@/components/landing"

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:top-4 focus:left-4 focus:rounded-lg"
      >
        Skip to main content
      </a>

      <main id="main-content">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <PricingPreview />
        <WaitlistCTA />
      </main>

      <Footer />
    </>
  )
}
