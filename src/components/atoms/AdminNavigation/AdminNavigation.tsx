"use client"

import { ReactNode } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Home, ChevronRight, ArrowLeft, User, Settings, BarChart3, Users, BookOpen, Plus } from 'lucide-react'
import Link from 'next/link'

export interface NavigationItem {
  label: string
  href: string
  icon?: ReactNode
}

export interface QuickAction {
  label: string
  href: string
  icon?: ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}

interface AdminNavigationProps {
  items: NavigationItem[]
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  className?: string
  quickActions?: QuickAction[]
  showUserInfo?: boolean
  userName?: string
  userRole?: string
}

export function AdminNavigation({ 
  items = [], 
  showBackButton = false, 
  backHref, 
  backLabel = "Voltar",
  className = "",
  quickActions = [],
  showUserInfo = true,
  userName = "Usuário",
  userRole = "Admin"
}: AdminNavigationProps) {
  return (
    <div className={`bg-background/95 backdrop-blur border-b border-border/50 ${className}`}>
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between py-5">
          {/* Breadcrumb Navigation - Esquerda */}
          <div className="flex items-center gap-2">
            {/* Home Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-primary/5 text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            {/* Navigation Items */}
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground/60 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-primary/5 text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Link href={item.href}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Quick Actions - Centro */}
          {quickActions.length > 0 && (
            <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-border/30">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  asChild
                  className="text-sm rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <Link href={action.href}>
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {/* User Info & Actions - Direita */}
          <div className="flex items-center gap-4">
            {/* Back Button (se não houver quick actions) */}
            {showBackButton && backHref && quickActions.length === 0 && (
              <Button 
                variant="outline" 
                asChild 
                size="sm"
                className="rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Link href={backHref}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backLabel}
                </Link>
              </Button>
            )}

            {/* User Info */}
            {showUserInfo && (
              <div className="flex items-center gap-3">
                {/* User Avatar & Info */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/40 hover:border-border/60 transition-all duration-200 hover:scale-105 group">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/30 transition-all duration-200">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="hidden sm:block text-sm">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {userName}
                    </div>
                    <div className="text-xs text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-200">
                      {userRole}
                    </div>
                  </div>
                </div>

                {/* User Menu */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-3 py-2 rounded-lg hover:bg-muted/30 hover:scale-105 transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
