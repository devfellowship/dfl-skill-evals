import * as React from "react"
import { Badge } from "../../atoms/Badge/Badge"
import { cn } from "@devfellowship/components"
interface SkillTagsProps {
  skills: string[]
  maxVisible?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "secondary" | "outline"
  className?: string
}
export const SkillTags = React.forwardRef<
  HTMLDivElement,
  SkillTagsProps
>(({ skills, maxVisible = 3, size = "md", variant = "secondary", className, ...props }, ref) => {
  const visibleSkills = skills.slice(0, maxVisible)
  const remainingCount = skills.length - maxVisible
  const badgeSize = size === "sm" ? "text-xs px-2 py-0.5" : 
                   size === "lg" ? "text-sm px-3 py-1" : 
                   "text-xs px-2.5 py-0.5"
  return (
    <div
      ref={ref}
      className={cn("flex flex-wrap gap-1.5", className)}
      {...props}
    >
      {visibleSkills.map((skill) => (
        <Badge 
          key={skill} 
          variant={variant}
          className={badgeSize}
        >
          {skill}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge 
          variant="outline"
          className={cn(badgeSize, "text-muted-foreground")}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}) 