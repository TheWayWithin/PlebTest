'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { SignupForm } from '@/components/auth/signup-form'
import { Badge } from '@/components/ui/badge'

const tiers = [
  {
    id: 'solo' as const,
    name: 'Solo',
    price: '$7.95',
    period: '/mo',
    description: 'Perfect for individual founders',
    features: ['3 active ideas', '10 validation tests/month', 'Shareable reports'],
  },
  {
    id: 'growth' as const,
    name: 'Growth',
    price: '$19.95',
    period: '/mo',
    description: 'For serious validators',
    features: ['10 active ideas', '50 validation tests/month', 'Priority support'],
    popular: true,
  },
]

export default function SignupPage() {
  const [selectedTier, setSelectedTier] = useState<'solo' | 'growth' | null>(null)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Create your account</h2>
        <p className="mt-2 text-gray-400">
          Start validating your ideas in minutes
        </p>
      </div>

      {/* Step 1: Tier Selection */}
      {!selectedTier ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 text-center">Choose your plan to get started</p>

          <div className="space-y-3">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  tier.popular
                    ? 'border-blue-500/50 bg-blue-500/5 hover:border-blue-500 hover:bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{tier.name}</span>
                      {tier.popular && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{tier.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-white">{tier.price}</span>
                    <span className="text-gray-400">{tier.period}</span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">
            14-day free trial. No credit card required.
          </p>
        </div>
      ) : (
        /* Step 2: Authentication */
        <div className="space-y-6">
          {/* Selected tier indicator */}
          <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-400">
              Selected: <span className="text-white font-medium">{selectedTier === 'solo' ? 'Solo' : 'Studio'}</span>
            </span>
            <button
              onClick={() => setSelectedTier(null)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Change
            </button>
          </div>

          {/* OAuth */}
          <OAuthButtons selectedTier={selectedTier} mode="signup" />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <SignupForm selectedTier={selectedTier} />
        </div>
      )}

      {/* Login link */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
