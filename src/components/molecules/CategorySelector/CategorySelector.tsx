"use client"

import { Label } from "@/components/atoms/Label/Label"

const CATEGORY_OPTIONS = [
  "Algoritmos",
  "Estruturas de Dados", 
  "Matemática",
  "Strings",
  "Arrays",
  "Grafos",
  "Árvores",
  "Dinâmica",
  "Guloso",
  "Backtracking"
]

interface CategorySelectorProps {
  selectedCategories: string[]
  onCategoryChange: (category: string, checked: boolean) => void
}

export function CategorySelector({ selectedCategories, onCategoryChange }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Categorias</Label>
      <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
        {CATEGORY_OPTIONS.map(category => (
          <div key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onChange={(e) => onCategoryChange(category, e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor={`category-${category}`} className="text-sm">
              {category}
            </Label>
          </div>
        ))}
      </div>
      {selectedCategories.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Selecionadas: {selectedCategories.join(", ")}
        </div>
      )}
    </div>
  )
}
