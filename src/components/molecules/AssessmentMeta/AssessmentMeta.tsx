import * as React from "react"
import { Clock, Users, Star } from "lucide-react"
import { formatParticipants } from "@/consts"
import { cn } from "@/lib/utils"

interface AssessmentMetaProps {
  duration?: string
  participants?: number
  rating?: number
  problems?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: {
    text: "text-xs",
    icon: "h-3 w-3",
    gap: "gap-3"
  },
  md: {
    text: "text-sm", 
    icon: "h-4 w-4",
    gap: "gap-4"
  },
  lg: {
    text: "text-base",
    icon: "h-5 w-5", 
    gap: "gap-5"
  }
}

export const AssessmentMeta = React.forwardRef<
  HTMLDivElement,
  AssessmentMetaProps
>(({ duration, participants, rating, problems, size = "md", className, ...props }, ref) => {
  const classes = sizeClasses[size]
  
  return (
    <div
      ref={ref}
      className={cn("flex items-center text-muted-foreground", classes.gap, className)}
      {...props}
    >
      {duration && (
        <div className="flex items-center gap-1">
          <Clock className={classes.icon} />
          <span className={classes.text}>{duration}</span>
        </div>
      )}
      
      {participants && (
        <div className="flex items-center gap-1">
          <Users className={classes.icon} />
          <span className={classes.text}>{formatParticipants(participants)}</span>
        </div>
      )}
      
      {rating && (
        <div className="flex items-center gap-1">
          <Star className={cn(classes.icon, "fill-yellow-400 text-yellow-400")} />
          <span className={classes.text}>{rating}</span>
        </div>
      )}
      
      {problems && (
        <div className="flex items-center">
          <span className={classes.text}>{problems} problems</span>
        </div>
      )}
    </div>
  )
}) 