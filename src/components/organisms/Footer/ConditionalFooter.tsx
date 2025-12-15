"use client"
import { useLocation } from 'react-router-dom'
import { Footer } from "./Footer"
export function ConditionalFooter() {
  const location = useLocation(); const pathname = location.pathname
  const hideFooterPages = [
    "/admin",
    "/teacher",
    "/teacher/create",
    "/edit",
    "/challenge",
    "/challenge/pre"
  ]
  const shouldHideFooter = hideFooterPages.some(page => 
    pathname === page || pathname.startsWith(page + "/")
  )
  if (shouldHideFooter) {
    return null
  }
  return <Footer />
}
