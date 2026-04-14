import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../atoms/Avatar/Avatar"
import type { User } from "@/types"
import { cn } from "@devfellowship/components"
interface ProfileInfoProps {
  user: User
  size?: "sm" | "md" | "lg"
  className?: string
  showEmail?: boolean
}
const sizeClasses = {
  sm: {
    avatar: "h-6 w-6",
    name: "text-sm font-medium",
    email: "text-xs text-muted-foreground",
    container: "gap-2"
  },
  md: {
    avatar: "h-8 w-8",
    name: "text-sm font-semibold",
    email: "text-xs text-muted-foreground",
    container: "gap-3"
  },
  lg: {
    avatar: "h-10 w-10",
    name: "text-base font-semibold",
    email: "text-sm text-muted-foreground",
    container: "gap-3"
  }
}
export const ProfileInfo = React.forwardRef<
  HTMLDivElement,
  ProfileInfoProps
>(({ user, size = "md", className, showEmail = true, ...props }, ref) => {
  const classes = sizeClasses[size]
  return (
    <div
      ref={ref}
      className={cn("flex items-center", classes.container, className)}
      {...props}
    >
      <Avatar className={classes.avatar}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className={cn("truncate", classes.name)}>
          {user.name}
        </div>
        {showEmail && (
          <div className={cn("truncate", classes.email)}>
            {user.email}
          </div>
        )}
      </div>
    </div>
  )
}) 