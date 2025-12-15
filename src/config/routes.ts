export const ROUTES = {
  PUBLIC: [
    '/login',
    '/auth/login',
    '/reset-password',
    '/auth/reset-password',
  ],
  PROTECTED: [
    '/',
    '/profile',
    '/challenge',
  ],
  ADMIN: [
    '/admin',
    '/teacher',
    '/create',
    '/edit',
  ],
} as const

export const ASSET_EXTENSIONS = ['.js', '.css', '.json', '.png', '.jpg', '.svg', '.ico']

export const isPublicRoute = (pathname: string): boolean => {
  return ROUTES.PUBLIC.some(route => pathname === route || pathname.startsWith(route))
}

export const isAdminRoute = (pathname: string): boolean => {
  return ROUTES.ADMIN.some(route => pathname.startsWith(route))
}

export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname)
}

export const isAssetRoute = (pathname: string): boolean => {
  if (pathname.startsWith('/assets/')) return true
  return ASSET_EXTENSIONS.some(ext => pathname.endsWith(ext))
}
