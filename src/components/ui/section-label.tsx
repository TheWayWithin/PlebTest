import { cn } from "@/lib/utils"

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-block text-sm font-semibold uppercase tracking-wider text-indigo-600",
        className
      )}
    >
      {children}
    </span>
  )
}
