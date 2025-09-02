import Link from "next/link"

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

export function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link 
      href={href} 
      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base block py-2"
    >
      {children}
    </Link>
  )
}
