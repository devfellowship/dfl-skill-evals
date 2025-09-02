interface FooterSectionProps {
  title: string
  children: React.ReactNode
}

export function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <div>
      <h3 className="text-foreground font-semibold text-lg mb-6">{title}</h3>
      <ul className="space-y-4">
        {children}
      </ul>
    </div>
  )
}
