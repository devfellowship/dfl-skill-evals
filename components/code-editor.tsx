"use client"

import { useState, useEffect } from "react"
import { Play, Square, Save, RotateCcw, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface CodeEditorProps {
  initialCode: string
  language: string
  onCodeChange: (code: string) => void
  onRun: () => void
  isRunning: boolean
}

const languages = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "go", label: "Go", extension: "go" },
]

const themes = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "high-contrast", label: "High Contrast" },
]

export function CodeEditor({ initialCode, language, onCodeChange, onRun, isRunning }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      setLastSaved(new Date())
      onCodeChange(code)
    }, 2000)

    return () => clearTimeout(timer)
  }, [code, onCodeChange])

  const handleReset = () => {
    setCode(initialCode)
    onCodeChange(initialCode)
  }

  const handleSave = () => {
    setLastSaved(new Date())
    onCodeChange(code)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const currentLanguage = languages.find((lang) => lang.value === selectedLanguage)

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      {/* Editor Header */}
      <div className="border-b border-border/40 p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-xs">
                .{currentLanguage?.extension}
              </Badge>
            </div>

            <Separator orientation="vertical" className="h-4" />

            <div className="flex items-center gap-2">
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-4" />

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Auto-saved at {formatTime(lastSaved)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize2 className="h-4 w-4 mr-1" />
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button onClick={onRun} disabled={isRunning} className="min-w-24">
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`h-full font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 ${
            selectedTheme === "dark"
              ? "bg-slate-950 text-slate-100"
              : selectedTheme === "light"
                ? "bg-white text-slate-900"
                : "bg-black text-yellow-400"
          }`}
          placeholder={`// Write your ${currentLanguage?.label} solution here...\n// Use Ctrl+S to save or it will auto-save every 2 seconds`}
          spellCheck={false}
        />

        {/* Line numbers overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/10 border-r border-border/20 pointer-events-none">
          <div className="p-3 text-xs text-muted-foreground font-mono leading-5">
            {code.split("\n").map((_, index) => (
              <div key={index} className="text-right pr-2">
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          textarea {
            padding-left: 3rem !important;
          }
        `}</style>
      </div>

      {/* Status Bar */}
      <div className="border-t border-border/40 px-4 py-2 bg-muted/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Lines: {code.split("\n").length}</span>
            <span>Characters: {code.length}</span>
            <span>Language: {currentLanguage?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Theme: {selectedTheme}</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
