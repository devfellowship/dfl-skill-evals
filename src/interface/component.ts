import { ReactNode } from 'react'

export interface MainHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
}

export interface AdminNavigationProps {
  items: NavigationItem[]
  showBackButton?: boolean
}

export interface NavigationItem {
  label: string
  href: string
  icon?: ReactNode
  active?: boolean
}

export interface AdminRouteWrapperProps {
  children: ReactNode
  allowedRoles: string[]
}

export interface LoadingStateProps {
  title?: string
  message?: string
}

export interface NotFoundStateProps {
  title: string
  message: string
}

export interface SystemChecks {
  browser: boolean
  internet: boolean
  microphone: boolean
}

export interface SystemCheckCardProps {
  systemChecks: SystemChecks
}

export interface PreAssessmentCardProps {
  assessment: Challenge
}

export interface SearchButtonProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export interface DashboardModalsProps {
  comparisonModalOpen: boolean
  challengeToCompare: string | null
}

export interface DashboardHeaderProps {
  broadcastWorking: boolean
  lastUpdate: Date
}

export interface ArchivedChallengesListProps {
  challenges: Challenge[]
  isInitialLoading: boolean
}

export interface ChallengeImageProps {
  imageUrl?: string
  category?: string[]
}

export interface BackgroundImageSelectorProps {
  currentImage?: string
  onImageSelect: (imageUrl: string) => void
}

export interface SocialIconProps {
  href: string
  label: string
}

export interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

export interface ContactItemProps {
  icon: any
  children: React.ReactNode
}

export interface ConnectionStatusProps {
  isConnected: boolean
  lastUpdate: Date
}

export interface BreadcrumbItem {
  href?: string
  label: string
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItem[]
}
