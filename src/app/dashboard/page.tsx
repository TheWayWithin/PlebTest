import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Welcome back, {user.email}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-white shadow-sm">
            <h3 className="font-semibold">Getting Started</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Your dashboard is ready. Start validating your ideas.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
