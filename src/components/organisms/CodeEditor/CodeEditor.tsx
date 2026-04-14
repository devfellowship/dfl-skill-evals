"use client"
import { useState, useEffect } from "react"
import { Code, Play } from "lucide-react"
import { Textarea } from "@devfellowship/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devfellowship/components";
import { Button } from "@/components/atoms/Button/Button"
import { LANGUAGES, EDITOR_CONFIG } from "@/consts/editor"
interface CodeEditorProps {
  value: string
  onChange: (code: string) => void
  language: string
  onLanguageChange?: (language: string) => void
  onRun?: () => void
  isRunning?: boolean
  showRunButton?: boolean
}
export function CodeEditor({ value, onChange, language, onLanguageChange, onRun, isRunning, showRunButton = false }: CodeEditorProps) {
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  useEffect(() => {
    const timer = setTimeout(() => {
      setLastSaved(new Date())
      onChange(value)
    }, EDITOR_CONFIG.AUTO_SAVE_DELAY)
    return () => clearTimeout(timer)
  }, [value, onChange])
  const formatSaveTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  const currentLanguage = LANGUAGES.find((lang) => lang.value === language)
  return (
    <div className="flex h-full flex-col bg-background border rounded-md overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="text-sm font-medium">Code Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={(newLanguage) => onLanguageChange?.(newLanguage) || onChange(`// Language changed to ${newLanguage}\n${value}`)}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showRunButton && onRun && (
            <Button 
              onClick={onRun} 
              disabled={isRunning}
              size="sm"
              className="h-7 px-3"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Run Code
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full resize-none border-0 bg-background font-mono text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 pl-14"
          placeholder={`//Write your ${currentLanguage?.label} solution here...\n// Use Ctrl+S to save or it will auto-save every 2 seconds`}
          spellCheck={false}
        />
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/30 border-r pointer-events-none">
          <div className="flex flex-col h-full text-xs text-muted-foreground pt-3 pr-2 leading-relaxed">
            {value.split('\n').map((_, index) => (
              <div key={index} className="text-right min-h-[1.5rem] flex items-center justify-end">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {value.split('\n').length}</span>
          <span>Characters: {value.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{currentLanguage?.label}</span>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </div>
  )
}
