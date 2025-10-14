'use client'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Label } from '@/components/atoms/Label/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'
import { PasswordFormData } from '@/types/profile/profile'
interface ProfilePasswordSectionProps {
  isChangingPassword: boolean
  passwordSaving: boolean
  passwordData: PasswordFormData
  onStartChange: () => void
  onCancel: () => void
  onSave: () => void
  onPasswordDataChange: (data: PasswordFormData) => void
}
export function ProfilePasswordSection({
  isChangingPassword,
  passwordSaving,
  passwordData,
  onStartChange,
  onCancel,
  onSave,
  onPasswordDataChange
}: ProfilePasswordSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Segurança
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isChangingPassword ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Senha</p>
              <p className="text-sm text-muted-foreground">Altere sua senha de acesso</p>
            </div>
            <Button
              variant="outline"
              onClick={onStartChange}
            >
              Alterar Senha
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Digite sua senha atual"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, newPassword: e.target.value })}
                placeholder="Digite sua nova senha"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirme sua nova senha"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                disabled={passwordSaving}
                className="flex-1"
              >
                {passwordSaving ? 'Alterando...' : 'Alterar Senha'}
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={passwordSaving}
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