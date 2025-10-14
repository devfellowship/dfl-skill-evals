import { useState, useEffect } from "react"
import { MOBILE_BREAKPOINT } from "@/consts/ui"
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    onChange()
    mql.addEventListener("change", onChange)
    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])
  return isMobile
}