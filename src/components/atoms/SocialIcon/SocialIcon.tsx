interface SocialIconProps {
  href: string
  label: string
  children: React.ReactNode
}

export function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
      aria-label={label}
    >
      {children}
    </a>
  )
}
