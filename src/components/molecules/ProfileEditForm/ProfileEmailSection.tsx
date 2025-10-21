'use client'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Label } from '@/components/atoms/Label/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import { EmailFormData } from '@/types/profile/profile'
interface ProfileEmailSectionProps {
  isChangingEmail: boolean
  emailSaving: boolean
  emailData: EmailFormData
  onStartChange: () => void
  onCancel: () => void
  onSave: () => void
  onEmailDataChange: (data: EmailFormData) => void
}
export function ProfileEmailSection({
  isChangingEmail,
  emailSaving,
  emailData,
  onStartChange,
  onCancel,
  onSave,
  onEmailDataChange
}: ProfileEmailSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isChangingEmail ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">Altere seu email de acesso</p>
            </div>
            <Button
              variant="outline"
              onClick={onStartChange}
            >
              Alterar Email
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="newEmail">Novo Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={emailData.newEmail}
                onChange={(e) => onEmailDataChange({ ...emailData, newEmail: e.target.value })}
                placeholder="Digite seu novo email"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                disabled={emailSaving}
                className="flex-1"
              >
                {emailSaving ? 'Alterando...' : 'Alterar Email'}
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={emailSaving}
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