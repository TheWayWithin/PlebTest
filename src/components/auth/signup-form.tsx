'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUpWithEmail } from '@/lib/auth/actions'

interface SignupFormProps {
  redirect?: string | null
}

export function SignupForm({ redirect }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Store redirect for callback
    if (redirect) {
      localStorage.setItem('plebtest_auth_redirect', redirect)
    }

    const result = await signUpWithEmail(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
        <p className="text-gray-400 text-sm">
          We sent you a confirmation link. Please check your inbox and click the link to verify your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
          Full name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Doe"
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Min. 8 characters"
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
        />
        <label htmlFor="terms" className="text-sm text-gray-400">
          I agree to the{' '}
          <a href="/terms" className="text-blue-400 hover:text-blue-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300">
            Privacy Policy
          </a>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating account...
          </span>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  )
}
