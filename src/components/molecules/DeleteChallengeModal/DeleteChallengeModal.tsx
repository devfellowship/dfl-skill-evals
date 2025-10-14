import React, { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Textarea } from '@/components/atoms/Textarea/Textarea'
import { Label } from '@/components/atoms/Label/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DeleteChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  challengeTitle: string
  isDeleting?: boolean
}

export const DeleteChallengeModal: React.FC<DeleteChallengeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  challengeTitle,
  isDeleting = false
}) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      setError('Motivo é obrigatório')
      return
    }
    
    if (reason.trim().length < 10) {
      setError('Motivo deve ter pelo menos 10 caracteres')
      return
    }
    
    setError('')
    onConfirm(reason.trim())
  }

  const handleClose = () => {
    setReason('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">⚠️ Excluir Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Você está prestes a excluir a challenge:
              </p>
              <p className="font-semibold text-foreground">
                "{challengeTitle}"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motivo da exclusão <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  setError('')
                }}
                placeholder="Descreva o motivo da exclusão (mínimo 10 caracteres)..."
                className="min-h-[100px] resize-none"
                disabled={isDeleting}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={reason.length < 10 ? 'text-destructive' : 'text-green-600'}>
                  {reason.length}/10 caracteres
                </span>
                <span>Mínimo: 10 caracteres</span>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isDeleting || reason.length < 10}
                className="flex-1"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir Challenge'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
