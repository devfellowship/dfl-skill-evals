import Link from "next/link"

export function FooterBottom() {
  return (
    <div className="border-t border-border/40 mt-12 pt-8">
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
        <p className="text-muted-foreground text-base">
          © 2025 devfellowship. Todos os direitos reservados.
        </p>
        <div className="flex space-x-8">
          <Link 
            href="/privacy" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base py-2"
          >
            Política de Privacidade
          </Link>
          <Link 
            href="/terms" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base py-2"
          >
            Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  )
}
