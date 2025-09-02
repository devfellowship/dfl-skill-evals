import { BrandLogo } from "@/components/atoms/Logo/Logo"
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks"

export function BrandSection() {
  return (
    <div className="lg:col-span-1">
      <div className="flex items-center space-x-4 mb-6">
        <BrandLogo />
        <span className="text-foreground font-bold text-2xl">Devfellowship</span>
      </div>
      <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm">
        Conectando talento, mentoria e oportunidades em tecnologia.
      </p>
      <SocialLinks />
    </div>
  )
}
