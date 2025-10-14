/**
 * Utilitários para manipulação de timezone
 */

/**
 * Retorna a data atual no timezone do Brasil (America/Sao_Paulo)
 * @returns string no formato ISO com timezone do Brasil
 */
export const getBrazilianDateTime = (): string => {
  const now = new Date()
  
  // Converter para o timezone do Brasil
  const brazilianTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
  
  // Retornar no formato ISO com timezone
  return brazilianTime.toISOString()
}

/**
 * Retorna a data atual no timezone do Brasil formatada para exibição
 * @returns string formatada para exibição
 */
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

/**
 * Converte uma data ISO para o timezone do Brasil
 * @param isoString string ISO da data
 * @returns string formatada no timezone do Brasil
 */
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
