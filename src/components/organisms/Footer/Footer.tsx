"use client"

import { Mail, MapPin, ExternalLink } from "lucide-react"
import { BrandSection } from "@/components/molecules/BrandSection/BrandSection"
import { FooterSection } from "@/components/molecules/FooterSection/FooterSection"
import { FooterBottom } from "@/components/molecules/FooterBottom/FooterBottom"
import { FooterLink } from "@/components/atoms/FooterLink/FooterLink"
import { ContactItem } from "@/components/atoms/ContactItem/ContactItem"

export function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur border-t border-border/40 text-foreground">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <BrandSection />
          
          <FooterSection title="Para Desenvolvedores">
            <li>
              <FooterLink href="/challenges">Challenges</FooterLink>
            </li>
            <li>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </li>
            <li>
              <FooterLink href="/progress">Progresso</FooterLink>
            </li>
          </FooterSection>

          <FooterSection title="Para Empresas">
            <li>
              <FooterLink href="/hiring">Modelos de contratação</FooterLink>
            </li>
            <li>
              <FooterLink href="/talent-pool">Pool de talentos</FooterLink>
            </li>
            <li>
              <FooterLink href="/partnership">Parcerias</FooterLink>
            </li>
          </FooterSection>

          <FooterSection title="Contato">
            <ContactItem icon={Mail}>
              <a 
                href="mailto:contato@devfellowship.com" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center space-x-2 group"
              >
                <span>contato@devfellowship.com</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </ContactItem>
            <ContactItem icon={MapPin}>
              Maringá, PR - Brasil
            </ContactItem>
          </FooterSection>
        </div>

        <FooterBottom />
      </div>
    </footer>
  )
}
