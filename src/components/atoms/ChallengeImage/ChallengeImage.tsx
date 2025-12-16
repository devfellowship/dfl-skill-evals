import { getDefaultImageForChallenge } from '@/consts/challenge-images'
import { useState, useEffect } from 'react'
import { useModuleFederation } from '@/remote-exports/shared-providers'

interface ChallengeImageProps {
  imageUrl?: string
  category?: string[]
  difficulty?: string
  title?: string
  className?: string
}

export function ChallengeImage({
  imageUrl,
  category,
  difficulty,
  title,
  className = "w-full h-32 object-cover rounded-lg"
}: ChallengeImageProps) {
  const [imageError, setImageError] = useState(false)
  const isGradient = imageUrl?.startsWith('linear-gradient')
  const defaultImage = getDefaultImageForChallenge(category, difficulty)
  const isInHost = useModuleFederation()

  const shouldUseGradient = imageError || !imageUrl

  const gradientByDifficulty = {
    'easy': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'medium': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'hard': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'expert': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  }

  const fallbackGradient = gradientByDifficulty[difficulty?.toLowerCase() as keyof typeof gradientByDifficulty] || gradientByDifficulty['easy']

  const finalImageSrc = shouldUseGradient ? defaultImage : imageUrl

  useEffect(() => {
    if (isInHost) {
      console.group('🖼️ [HOST DEBUG] ChallengeImage:', title || 'Unnamed')
      console.log('📍 imageUrl:', imageUrl)
      console.log('📍 category:', category)
      console.log('📍 difficulty:', difficulty)
      console.log('📍 title:', title)
      console.log('🔍 isGradient:', isGradient)
      console.log('🔍 imageError:', imageError)
      console.log('🔍 defaultImage:', defaultImage)
      console.log('🔍 finalImageSrc:', finalImageSrc)
      console.log('🌐 origin:', window.location.origin)
      console.log('🌐 pathname:', window.location.pathname)
      console.log('🌐 isModuleFederation:', isInHost)
      console.groupEnd()
    }
  }, [imageUrl, imageError, isInHost, title, category, difficulty, isGradient, defaultImage, finalImageSrc])

  return (
    <div className="relative overflow-hidden rounded-lg group w-full h-full" style={{ minHeight: '200px' }}>
      {isGradient || shouldUseGradient ? (
        <div
          className="absolute inset-0 w-full h-full"
          style={{ background: isGradient ? imageUrl : fallbackGradient }}
        />
      ) : (
        <img
          src={finalImageSrc}
          alt={`Imagem do challenge: ${title || 'Challenge'}`}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          onLoad={(e) => {
            if (isInHost) {
              const target = e.target as HTMLImageElement
              console.group(`✅ [HOST DEBUG] Imagem carregou com sucesso: ${title}`)
              console.log('src:', target.src)
              console.log('naturalWidth:', target.naturalWidth)
              console.log('naturalHeight:', target.naturalHeight)
              console.log('complete:', target.complete)
              console.groupEnd()
            }
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            if (isInHost) {
              console.group(`❌ [HOST DEBUG] Erro ao carregar imagem: ${title}`)
              console.log('tentativaSrc:', target.src)
              console.log('imageError:', imageError)
              console.log('finalImageSrc:', finalImageSrc)
              console.log('defaultImage:', defaultImage)
              console.log('⚡ Usando gradiente fallback:', fallbackGradient)
              console.groupEnd()
            }
            if (!imageError) {
              setImageError(true)
            }
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" style={{ pointerEvents: 'none' }} />
      <div className="absolute inset-0 flex items-center justify-center z-20" style={{ pointerEvents: 'none' }}>
        <div className="text-center">
          <div className="text-4xl mb-2">⟨⟩</div>
          <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">
            {title || 'Challenge'}
          </h3>
        </div>
      </div>
    </div>
  )
}
