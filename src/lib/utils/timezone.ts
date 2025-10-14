export const getBrazilianDateTime = (): string => {
  const now = new Date()
  const brazilianTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
  return brazilianTime.toISOString()
}
export const getBrazilianDateTimeFormatted = (): string => {
  const now = new Date()
  return now.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
export const convertToBrazilianTime = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
