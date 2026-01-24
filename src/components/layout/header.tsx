import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/logout-button'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-white">PlebTest</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <nav className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Settings
              </Link>
              <LogoutButton variant="ghost" />
            </nav>
          ) : (
            <nav className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
