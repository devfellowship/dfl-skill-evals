import React, { createContext, useContext, type ReactNode } from 'react'

interface BasePathContextType {
  basePath: string
  buildRoute: (path: string) => string
}

const BasePathContext = createContext<BasePathContextType | undefined>(undefined)

const normalize = (p: string) => {
  if (!p) return ''
  // garante que come├ºa com /
  const withSlash = p.startsWith('/') ? p : `/${p}`
  // remove trailing /
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash
}

export function BasePathProvider({
  children,
  basePath = '',
}: {
  children: ReactNode
  basePath?: string
}) {
  const normalizedBase = normalize(basePath)

  const buildRoute = (path: string) => {
    if (!path) return normalizedBase || '/'

    // Links externos ou anchors n├úo devem ser mexidos
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('#')) return path

    const normalizedPath = normalize(path)

    // Se j├í est├í prefixado, mant├®m
    if (normalizedBase && normalizedPath.startsWith(normalizedBase)) return normalizedPath

    // Se basePath vazio, retorna rota original
    if (!normalizedBase) return normalizedPath

    // Root do remote
    if (normalizedPath === '/') return normalizedBase

    return `${normalizedBase}${normalizedPath}`
  }

  return (
    <BasePathContext.Provider value={{ basePath: normalizedBase || '/', buildRoute }}>
      {children}
    </BasePathContext.Provider>
  )
}

export function useBasePath() {
  const ctx = useContext(BasePathContext)
  if (!ctx) {
    // fallback seguro: mant├®m rota como est├í
    return { basePath: '/', buildRoute: (p: string) => p }
  }
  return ctx
}
