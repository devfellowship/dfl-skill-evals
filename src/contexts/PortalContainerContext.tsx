import React, { createContext, useContext, useEffect, useState } from "react"

const PortalContainerContext = createContext<HTMLElement | null>(null)

export function PortalContainerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof document === "undefined") return

    const id = "devshaper-portal-root"
    let el = document.getElementById(id) as HTMLElement | null
    let created = false

    if (!el) {
      created = true
      el = document.createElement("div")
      el.id = id
      // Importante: mantém os tokens/variáveis dentro do escopo do remote
      // sem poluir o :root/body do host.
      el.className = "devshaper-scope"
      document.body.appendChild(el)
    }

    setContainer(el)

    return () => {
      if (created && el?.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  }, [])

  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}

export function usePortalContainer() {
  return useContext(PortalContainerContext)
}
