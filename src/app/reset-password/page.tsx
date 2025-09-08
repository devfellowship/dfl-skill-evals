import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm/ResetPasswordForm'
import { AnimatedBackground } from '@/components/atoms/AnimatedBackground/AnimatedBackground'

export default function ResetPasswordPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-lg relative z-10">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
