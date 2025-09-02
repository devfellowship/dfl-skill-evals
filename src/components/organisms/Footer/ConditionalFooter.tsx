"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./Footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  const hideFooterPages = [
    "/admin",
    "/teacher",
    "/teacher/create",
    "/teacher/edit",
    "/challenge-page",
    "/pre-challenge-page"
  ]
  const shouldHideFooter = hideFooterPages.some(page => 
    pathname === page || pathname.startsWith(page + "/")
  )

  if (shouldHideFooter) {
    return null
  }

  return <Footer />
}
