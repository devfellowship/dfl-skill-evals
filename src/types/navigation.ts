import { LucideIcon } from "lucide-react"

export interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
  badge?: string
}

export interface MenuSection {
  title: string
  items: MenuItem[]
}

export interface User {
  name: string
  email: string
  avatar?: string
  initials: string
} 