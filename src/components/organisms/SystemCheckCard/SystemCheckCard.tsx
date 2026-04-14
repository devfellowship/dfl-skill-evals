"use client"
import { CheckCircle, AlertCircle, Monitor, Wifi } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devfellowship/components";
import { UI_MESSAGES } from "@/consts/ui"
interface SystemChecks {
  browser: boolean
  internet: boolean
}
interface SystemCheckCardProps {
  systemChecks: SystemChecks
}
export function SystemCheckCard({ systemChecks }: SystemCheckCardProps) {
  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-lg">{UI_MESSAGES.SYSTEM_CHECK.TITLE}</CardTitle>
        <CardDescription>{UI_MESSAGES.SYSTEM_CHECK.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <span>{UI_MESSAGES.SYSTEM_CHECK.BROWSER}</span>
          </div>
          {systemChecks.browser ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-muted-foreground" />
            <span>{UI_MESSAGES.SYSTEM_CHECK.INTERNET}</span>
          </div>
          {systemChecks.internet ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
