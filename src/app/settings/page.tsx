import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { LogoutButton } from '@/components/auth/logout-button'
import { SubscriptionCard } from '@/components/settings/subscription-card'
import { getSubscriptionDetails } from '@/lib/stripe/get-subscription-details'

const TIER_LIMITS: Record<string, number> = {
  solo: 1,
  growth: 3,
  scale: 10,
  pro: 20,
}

function getPriceConfig() {
  return {
    solo: {
      monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY!,
      annual: process.env.STRIPE_PRICE_SOLO_ANNUAL!,
    },
    growth: {
      monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY!,
      annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL!,
    },
    scale: {
      monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY!,
      annual: process.env.STRIPE_PRICE_SCALE_ANNUAL!,
    },
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
    },
  }
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user subscription data
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, subscription_status, stripe_customer_id, trial_ends_at')
    .eq('id', user.id)
    .single()

  // Count user's ideas for usage display
  const { count: ideasCount } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const tier = userData?.subscription_tier || 'solo'
  const status = userData?.subscription_status || 'trial'

  // Fetch Stripe details if customer exists
  let stripeDetails = null
  if (userData?.stripe_customer_id) {
    try {
      stripeDetails = await getSubscriptionDetails(userData.stripe_customer_id)
    } catch (error) {
      console.error('Failed to fetch Stripe subscription details:', error)
    }
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

          {/* Subscription Section */}
          <SubscriptionCard
            tier={tier}
            status={status}
            ideasUsed={ideasCount || 0}
            ideasLimit={TIER_LIMITS[tier] || 1}
            trialEndsAt={userData?.trial_ends_at || null}
            nextBillingDate={stripeDetails?.currentPeriodEnd || null}
            paymentMethodLast4={stripeDetails?.paymentMethodLast4 || null}
            paymentMethodBrand={stripeDetails?.paymentMethodBrand || null}
            cancelAtPeriodEnd={stripeDetails?.cancelAtPeriodEnd || false}
            interval={stripeDetails?.interval || null}
            priceConfig={status === 'active' ? getPriceConfig() : null}
          />

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
