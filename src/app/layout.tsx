import type React from "react"
import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { GlobalAuthGuard } from "@/components/atoms/GlobalAuthGuard/GlobalAuthGuard"
import { ConditionalFooter } from "@/components/organisms/Footer/ConditionalFooter"
export const metadata: Metadata = {
  title: "DevShaper - Technical Assessments",
  description: "Advanced technical assessment platform for developers",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GlobalAuthGuard>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  {children}
                </main>
                <ConditionalFooter />
              </div>
            </GlobalAuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
