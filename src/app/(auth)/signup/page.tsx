'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Create your account</h2>
        <p className="mt-2 text-gray-400">
          Start validating your ideas in minutes
        </p>
      </div>

      {/* OAuth */}
      <OAuthButtons mode="signup" redirect={redirect} />

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
      <SignupForm redirect={redirect} />

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
