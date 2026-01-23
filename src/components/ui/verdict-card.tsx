import { cn } from "@/lib/utils"
import { XCircle, RefreshCw, Rocket, LucideIcon } from "lucide-react"

type VerdictType = "kill" | "pivot" | "build"

interface VerdictCardProps {
  verdict: VerdictType
  title: string
  description: string
  className?: string
}

const verdictConfig: Record<VerdictType, {
  icon: LucideIcon
  borderColor: string
  bgColor: string
  iconColor: string
  titleColor: string
}> = {
  kill: {
    icon: XCircle,
    borderColor: "border-rose-500",
    bgColor: "bg-rose-50/50",
    iconColor: "text-rose-600",
    titleColor: "text-rose-600",
  },
  pivot: {
    icon: RefreshCw,
    borderColor: "border-amber-500",
    bgColor: "bg-amber-50/50",
    iconColor: "text-amber-600",
    titleColor: "text-amber-600",
  },
  build: {
    icon: Rocket,
    borderColor: "border-emerald-500",
    bgColor: "bg-emerald-50/50",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-600",
  },
}

export function VerdictCard({ verdict, title, description, className }: VerdictCardProps) {
  const config = verdictConfig[verdict]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "border-l-4 p-4 rounded-r-xl",
        config.borderColor,
        config.bgColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-6 h-6 shrink-0", config.iconColor)} aria-hidden="true" />
        <div>
          <h4 className={cn("font-semibold", config.titleColor)}>{title}</h4>
          <p className="text-slate-600 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}
