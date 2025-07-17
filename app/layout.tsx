import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "devshaper - Shape Your Dev Skills",
  description: "Master your coding abilities with real-world technical assessments. Practice algorithms, system design, and full-stack development in a professional environment designed for developers, by developers.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <main className="w-full">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
