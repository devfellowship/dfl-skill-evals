import { Link } from 'react-router-dom'
interface FooterLinkProps {
  href: string
  children: React.ReactNode
}
export function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link to={href} 
      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base block py-2"
    >
      {children}
    </Link>
  )
}