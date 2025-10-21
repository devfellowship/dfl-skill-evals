'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { ProfileEditFormProps, ProfileFormData, PasswordFormData, EmailFormData } from '@/types/profile/profile'
import { PROFILE_CONSTANTS, PROFILE_MESSAGES } from '@/consts/profile/profile-constants'
import { validateEmail } from '@/lib/utils/profile-utils'
import { ProfilePersonalInfo } from './ProfilePersonalInfo'
import { ProfileEmailSection } from './ProfileEmailSection'
import { ProfilePasswordSection } from './ProfilePasswordSection'
export function ProfileEditForm({ onClose }: ProfileEditFormProps) {
  const { profile, loading, canChangeName, daysUntilNameChange, updateProfile, changePassword, changeEmail } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [emailSaving, setEmailSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: ''
  })
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [emailData, setEmailData] = useState<EmailFormData>({
    newEmail: ''
  })
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || ''
      })
    }
  }, [profile])
  const handleSave = async () => {
    if (!profile) {
      return
    }
    setSaving(true)
    try {
      const result = await updateProfile(formData)
      toast.success(PROFILE_MESSAGES.PROFILE_UPDATED)
      setIsEditing(false)
      onClose?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : PROFILE_MESSAGES.UNEXPECTED_ERROR)
    } finally {
      setSaving(false)
    }
  }
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(PROFILE_MESSAGES.PASSWORD_MISMATCH)
      return
    }
    if (passwordData.newPassword.length < PROFILE_CONSTANTS.MIN_PASSWORD_LENGTH) {
      toast.error(PROFILE_MESSAGES.PASSWORD_TOO_SHORT)
      return
    }
    setPasswordSaving(true)
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      toast.success(PROFILE_MESSAGES.PASSWORD_CHANGED)
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : PROFILE_MESSAGES.UNEXPECTED_ERROR)
    } finally {
      setPasswordSaving(false)
    }
  }
  const handleEmailChange = async () => {
    if (!emailData.newEmail) {
      toast.error('Digite o novo email')
      return
    }
    if (emailData.newEmail === profile?.email) {
      toast.error(PROFILE_MESSAGES.EMAIL_SAME)
      return
    }
    if (!validateEmail(emailData.newEmail)) {
      toast.error(PROFILE_MESSAGES.EMAIL_INVALID)
      return
    }
    setEmailSaving(true)
    try {
      await changeEmail(emailData.newEmail)
      toast.success(PROFILE_MESSAGES.EMAIL_CHANGED)
      setIsChangingEmail(false)
      setEmailData({
        newEmail: ''
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : PROFILE_MESSAGES.UNEXPECTED_ERROR)
    } finally {
      setEmailSaving(false)
    }
  }
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">{PROFILE_MESSAGES.LOADING}</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{PROFILE_MESSAGES.ERROR_LOADING}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="space-y-6">
      <ProfilePersonalInfo
        profile={profile}
        canChangeName={canChangeName}
        daysUntilNameChange={daysUntilNameChange}
        isEditing={isEditing}
        formData={formData}
        saving={saving}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false)
          setFormData({
            full_name: profile.full_name || ''
          })
        }}
        onFormDataChange={setFormData}
      />
      <ProfileEmailSection
        isChangingEmail={isChangingEmail}
        emailSaving={emailSaving}
        emailData={emailData}
        onStartChange={() => setIsChangingEmail(true)}
        onCancel={() => {
          setIsChangingEmail(false)
          setEmailData({ newEmail: '' })
        }}
        onSave={handleEmailChange}
        onEmailDataChange={setEmailData}
      />
      <ProfilePasswordSection
        isChangingPassword={isChangingPassword}
        passwordSaving={passwordSaving}
        passwordData={passwordData}
        onStartChange={() => setIsChangingPassword(true)}
        onCancel={() => {
          setIsChangingPassword(false)
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
        }}
        onSave={handlePasswordChange}
        onPasswordDataChange={setPasswordData}
      />
    </div>
  )
}