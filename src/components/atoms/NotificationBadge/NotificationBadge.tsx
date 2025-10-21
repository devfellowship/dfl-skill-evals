import React from 'react'
interface NotificationBadgeProps {
  count: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  showZero?: boolean
  className?: string
}
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  variant = 'default',
  showZero = false,
  className = ''
}) => {
  if (count === 0 && !showZero) return null
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      default:
        return 'bg-blue-500 text-white'
    }
  }
  const getAnimation = () => {
    if (count > 0 && variant === 'error') {
      return 'animate-pulse'
    }
    return ''
  }
  return (
    <span
      className={`
        ml-2 
        ${getVariantStyles()} 
        text-xs font-bold 
        rounded-full 
        h-5 w-5 
        flex items-center justify-center 
        min-w-[20px] 
        shadow-sm 
        ${getAnimation()}
        ${className}
      `.trim()}
    >
      {count === 0 && variant === 'success' ? '✓' : (count > 99 ? '99+' : count)}
    </span>
  )
}