import { Card, CardContent } from '@devfellowship/components';
import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"

import { Check } from "lucide-react"
interface BackgroundImageSelectorProps {
  currentImage?: string
  onImageSelect: (imageUrl: string) => void
  className?: string
}
const BACKGROUND_IMAGES = [
  {
    id: 'gradient-1',
    name: 'Gradiente Azul',
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-2', 
    name: 'Gradiente Verde',
    url: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-3',
    name: 'Gradiente Roxo',
    url: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-4',
    name: 'Gradiente Laranja',
    url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-5',
    name: 'Gradiente Azul Escuro',
    url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-6',
    name: 'Gradiente Rosa',
    url: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-7',
    name: 'Gradiente Roxo Escuro',
    url: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-8',
    name: 'Gradiente Verde Escuro',
    url: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    type: 'gradient'
  }
]
export function BackgroundImageSelector({ 
  currentImage, 
  onImageSelect, 
  className = "" 
}: BackgroundImageSelectorProps) {
  const [selectedImage, setSelectedImage] = useState(currentImage || BACKGROUND_IMAGES[0].url)
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    onImageSelect(imageUrl)
  }
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Imagem de Fundo</h3>
        <p className="text-sm text-muted-foreground">
          Escolha uma imagem de fundo para o seu challenge
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {BACKGROUND_IMAGES.map((image) => (
          <Card
            key={image.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedImage === image.url ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleImageSelect(image.url)}
          >
            <CardContent className="p-2">
              <div 
                className="w-full h-16 rounded-md relative overflow-hidden"
                style={{ background: image.url }}
              >
                {selectedImage === image.url && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                {image.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}