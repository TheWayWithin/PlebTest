import { SectionLabel } from "@/components/ui/section-label"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Solo",
    price: "$9.95",
    period: "per month",
    popular: false,
    features: [
      "1 product",
      "10 interviews/month",
      "Kill/Pivot/Build verdict",
      "Shareable report",
    ],
  },
  {
    name: "Growth",
    price: "$19.95",
    period: "per month",
    popular: true,
    features: [
      "3 products",
      "30 interviews/month",
      "Multiple ICPs per product",
      "Anti-sycophancy pushback presets",
    ],
  },
  {
    name: "Scale",
    price: "$29.95",
    period: "per month",
    popular: false,
    features: [
      "10 products",
      "100 interviews/month",
      "Assumption Board + Reality Check",
      "Priority processing",
    ],
  },
  {
    name: "Pro",
    price: "$49.95",
    period: "per month",
    popular: false,
    features: [
      "20 products",
      "200 interviews/month",
      "Early feature access",
      "Shareable decision briefs",
    ],
  },
]

export function PricingPreview() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that fits your validation needs.
          </p>
          <p className="mt-2 text-sm font-medium text-indigo-600">
            Early access pricing from $7.95/mo + free credits
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-2xl bg-white p-8 border",
                tier.popular
                  ? "ring-2 ring-indigo-600 border-indigo-600"
                  : "border-slate-200"
              )}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white border-0 px-3 py-1">
                  Most Popular
                </Badge>
              )}

              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-semibold text-slate-900">{tier.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                  <span className="ml-2 text-slate-500">{tier.period}</span>
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button (Disabled) */}
                <button
                  disabled
                  className="mt-8 w-full rounded-lg bg-slate-100 py-3 text-slate-400 cursor-not-allowed font-medium"
                >
                  Coming Soon
                </button>
              </div>

              {/* Coming Soon Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[2px]"
                aria-hidden="true"
              >
                <Badge className="bg-slate-900 text-white border-0 px-4 py-2 text-sm">
                  Coming Soon
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
