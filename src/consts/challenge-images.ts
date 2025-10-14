export const DEFAULT_CHALLENGE_IMAGES = {
  'default': '/images/challenges/defaults/Default.jpg'
}
export const getDefaultImageForChallenge = (category?: string[], difficulty?: string): string => {
  return DEFAULT_CHALLENGE_IMAGES.default
}