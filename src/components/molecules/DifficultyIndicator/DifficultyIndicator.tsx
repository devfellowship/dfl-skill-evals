import * as React from "react"
import { getDifficultyColor, getDifficultyLabel } from "@/consts"
import { cn } from "@/lib/utils"

interface DifficultyIndicatorProps {
  difficulty: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const sizeClasses = {
  sm: {
    dots: "h-1.5 w-1.5",
    label: "text-xs",
    container: "gap-2"
  },
  md: {
    dots: "h-2 w-2", 
    label: "text-sm",
    container: "gap-2"
  },
  lg: {
    dots: "h-2.5 w-2.5",
    label: "text-base",
    container: "gap-3"
  }
}

export const DifficultyIndicator = React.forwardRef<
  HTMLDivElement,
  DifficultyIndicatorProps
>(({ difficulty, size = "md", showLabel = true, className, ...props }, ref) => {
  const classes = sizeClasses[size]
  const difficultyColor = getDifficultyColor(difficulty)
  const difficultyLabel = getDifficultyLabel(difficulty)
  
  return (
    <div
      ref={ref}
      className={cn("flex items-center", classes.container, className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-full",
              classes.dots,
              index < difficulty ? difficultyColor : "bg-muted"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn("text-muted-foreground", classes.label)}>
          {difficultyLabel}
        </span>
      )}
    </div>
  )
}) 