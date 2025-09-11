import Image from 'next/image'
import { getDefaultImageForChallenge } from '@/consts/challenge-images'

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
  const isGradient = imageUrl?.startsWith('linear-gradient')
  const imageSrc = !isGradient ? getDefaultImageForChallenge(category, difficulty) : null
  const fallbackImage = getDefaultImageForChallenge(category, difficulty)
  
  return (
    <div className="relative overflow-hidden rounded-lg group">
      {isGradient ? (
        <div 
          className={className}
          style={{ background: imageUrl }}
        />
      ) : (
        <Image
          src={imageSrc!}
          alt={`Imagem do challenge: ${title || 'Challenge'}`}
          width={400}
          height={200}
          className={`${className} relative z-0`}
          priority={false}
          unoptimized={true}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = fallbackImage
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 flex items-center justify-center z-20">
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
