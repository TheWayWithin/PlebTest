import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { LogoutButton } from '@/components/auth/logout-button'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-2 text-zinc-400">
          Manage your account settings and preferences.
        </p>

        <div className="mt-8 space-y-6">
          {/* Account Section */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400">Email</label>
                <p className="mt-1 text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">User ID</label>
                <p className="mt-1 font-mono text-sm text-zinc-300">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="rounded-lg border border-rose-500/20 bg-zinc-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white">Sign Out</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Sign out of your account on this device.
            </p>
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
