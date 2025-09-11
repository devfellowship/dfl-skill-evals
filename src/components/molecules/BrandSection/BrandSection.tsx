import { BrandLogo } from "@/components/atoms/Logo/Logo"
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks"

export function BrandSection() {
  return (
    <div className="lg:col-span-1">
      <a 
        href="https://devfellowship.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
      >
        <BrandLogo />
        <span className="text-foreground font-bold text-2xl group-hover:text-primary transition-colors duration-300">Devfellowship</span>
      </a>
      <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm">
        Conectando talento, mentoria e oportunidades em tecnologia.
      </p>
      <SocialLinks />
    </div>
  )
}
