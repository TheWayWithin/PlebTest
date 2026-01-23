import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { PostHogProvider } from "@/components/providers/posthog-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "PlebTest - AI-Powered Startup Validation",
  description:
    "Get an AI-powered market analysis in minutes. Know if your startup idea is worth pursuing before you write a single line of code. Kill, Pivot, or Build - get clarity before you commit.",
  keywords: [
    "startup validation",
    "market analysis",
    "AI validation",
    "business idea validation",
    "startup testing",
    "market research",
    "competitor analysis",
  ],
  authors: [{ name: "PlebTest" }],
  creator: "PlebTest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plebtest.com",
    siteName: "PlebTest",
    title: "PlebTest - AI-Powered Startup Validation",
    description:
      "Get an AI-powered market analysis in minutes. Know if your startup idea is worth pursuing before you write a single line of code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlebTest - AI-Powered Startup Validation",
    description:
      "Get an AI-powered market analysis in minutes. Know if your startup idea is worth pursuing before you write a single line of code.",
    creator: "@plebtest",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Suspense fallback={null}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
