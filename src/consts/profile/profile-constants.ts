export const PROFILE_CONSTANTS = {
  NAME_CHANGE_COOLDOWN_DAYS: 7,
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ALLOWED_PROFILE_FIELDS: ['full_name', 'phone', 'updated_at', 'last_name_change'] as const
} as const

export const PROFILE_MESSAGES = {
  LOADING: 'Carregando perfil...',
  ERROR_LOADING: 'Erro ao carregar perfil',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  PASSWORD_CHANGED: 'Senha alterada com sucesso!',
  EMAIL_CHANGED: 'Email alterado com sucesso! Verifique sua caixa de entrada para confirmar.',
  NAME_CHANGE_RESTRICTION: 'Você só pode alterar o nome a cada 7 dias. Faltam {days} dias.',
  EMAIL_INVALID: 'Formato de email inválido',
  EMAIL_SAME: 'O novo email deve ser diferente do email atual',
  PASSWORD_MISMATCH: 'As senhas não coincidem',
  PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 6 caracteres',
  CURRENT_PASSWORD_INCORRECT: 'Senha atual incorreta',
  USER_NOT_FOUND: 'Usuário não encontrado',
  UNEXPECTED_ERROR: 'Erro inesperado'
} as const
