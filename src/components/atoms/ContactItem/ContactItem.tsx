import { LucideIcon } from "lucide-react"

interface ContactItemProps {
  icon: LucideIcon
  children: React.ReactNode
}

export function ContactItem({ icon: Icon, children }: ContactItemProps) {
  return (
    <li className="flex items-center space-x-4">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <div className="text-muted-foreground text-base">
        {children}
      </div>
    </li>
  )
}
