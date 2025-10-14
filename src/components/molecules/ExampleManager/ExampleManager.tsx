"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { Plus, Trash2 } from "lucide-react"
interface Example {
  input: string
  output: string
  explanation: string
}
interface ExampleManagerProps {
  examples: Example[]
  onAdd: (example: Example) => void
  onRemove: (index: number) => void
}
export function ExampleManager({ examples, onAdd, onRemove }: ExampleManagerProps) {
  const [example, setExample] = useState<Example>({
    input: "",
    output: "",
    explanation: ""
  })
  const addExample = () => {
    if (example.input.trim() && example.output.trim()) {
      const newExample = {
        input: example.input.trim(),
        output: example.output.trim(),
        explanation: example.explanation.trim()
      }
      onAdd(newExample)
      setExample({ input: "", output: "", explanation: "" })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exemplos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exampleInput">Input do Exemplo</Label>
            <Textarea
              id="exampleInput"
              value={example.input}
              onChange={(e) => setExample(prev => ({ ...prev, input: e.target.value }))}
              placeholder='Ex: nums = [2,7,11,15], target = 9'
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exampleOutput">Output do Exemplo</Label>
            <Textarea
              id="exampleOutput"
              value={example.output}
              onChange={(e) => setExample(prev => ({ ...prev, output: e.target.value }))}
              placeholder='Ex: [0,1]'
              rows={3}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exampleExplanation">Explicação (Opcional)</Label>
          <Textarea
            id="exampleExplanation"
            value={example.explanation}
            onChange={(e) => setExample(prev => ({ ...prev, explanation: e.target.value }))}
            placeholder='Ex: Porque nums[0] + nums[1] == 9, retornamos [0, 1].'
            rows={2}
          />
        </div>
        <Button type="button" onClick={addExample} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Exemplo
        </Button>
        {examples.length > 0 && (
          <div className="space-y-2">
            <Label>Exemplos Adicionados ({examples.length})</Label>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">Exemplo {index + 1}</div>
                    <div className="text-xs text-muted-foreground">
                      Input: {example.input}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Output: {example.output}
                    </div>
                    {example.explanation && (
                      <div className="text-xs text-muted-foreground">
                        Explicação: {example.explanation}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}