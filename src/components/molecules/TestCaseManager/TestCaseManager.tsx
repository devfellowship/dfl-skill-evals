"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@devfellowship/components';
import { useState } from "react"

import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { Plus, Trash2 } from "lucide-react"
interface TestCase {
  input: string
  expectedOutput: string
}
interface TestCaseManagerProps {
  testCases: TestCase[]
  onAdd: (testCase: TestCase) => void
  onRemove: (index: number) => void
}
export function TestCaseManager({ testCases, onAdd, onRemove }: TestCaseManagerProps) {
  const [testCase, setTestCase] = useState<TestCase>({
    input: "",
    expectedOutput: ""
  })
  const addTestCase = () => {
    if (testCase.input.trim() && testCase.expectedOutput.trim()) {
      const newTestCase = {
        input: testCase.input.trim(),
        expectedOutput: testCase.expectedOutput.trim()
      }
      onAdd(newTestCase)
      setTestCase({ input: "", expectedOutput: "" })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos de Teste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="testInput">Input</Label>
            <Textarea
              id="testInput"
              value={testCase.input}
              onChange={(e) => setTestCase(prev => ({ ...prev, input: e.target.value }))}
              placeholder='Ex: [2,7,11,15], 9'
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="testOutput">Output Esperado</Label>
            <Textarea
              id="testOutput"
              value={testCase.expectedOutput}
              onChange={(e) => setTestCase(prev => ({ ...prev, expectedOutput: e.target.value }))}
              placeholder='Ex: [0,1]'
              rows={3}
            />
          </div>
        </div>
        <Button type="button" onClick={addTestCase} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Caso de Teste
        </Button>
        {testCases.length > 0 && (
          <div className="space-y-2">
            <Label>Casos de Teste Adicionados ({testCases.length})</Label>
            <div className="space-y-2">
              {testCases.map((testCase, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">Caso {index + 1}</div>
                    <div className="text-xs text-muted-foreground">
                      Input: {testCase.input} | Output: {testCase.expectedOutput}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
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