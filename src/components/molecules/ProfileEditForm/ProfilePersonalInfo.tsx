'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Label } from '@/components/atoms/Label/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/atoms/Badge/Badge'
import { User, Phone, Calendar, AlertCircle } from 'lucide-react'
import { ProfileFormData } from '@/types/profile/profile'
import { PROFILE_MESSAGES } from '@/consts/profile/profile-constants'

interface ProfilePersonalInfoProps {
  profile: any
  canChangeName: boolean
  daysUntilNameChange: number
  isEditing: boolean
  formData: ProfileFormData
  saving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onFormDataChange: (data: ProfileFormData) => void
}

export function ProfilePersonalInfo({
  profile,
  canChangeName,
  daysUntilNameChange,
  isEditing,
  formData,
  saving,
  onEdit,
  onSave,
  onCancel,
  onFormDataChange
}: ProfilePersonalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
                <p className="text-foreground font-medium">{profile.full_name}</p>
              </div>
              <div className="flex items-center gap-2">
                {!canChangeName && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {daysUntilNameChange} dias restantes
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  disabled={!canChangeName}
                >
                  Editar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                <p className="text-foreground font-medium">{profile.phone || 'Não informado'}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                Editar
              </Button>
            </div>

            {!canChangeName && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">
                    Você só pode alterar seu nome a cada 7 dias. Faltam {daysUntilNameChange} dias para a próxima alteração.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => onFormDataChange({ ...formData, full_name: e.target.value })}
                disabled={!canChangeName}
                placeholder="Digite seu nome completo"
              />
              {!canChangeName && (
                <p className="text-xs text-muted-foreground mt-1">
                  Você não pode alterar o nome no momento
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
