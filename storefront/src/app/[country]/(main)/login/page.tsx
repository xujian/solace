'use client'

import LoginForm from '@modules/account/login-form'
import { useRouter } from 'next/navigation'

export default function LoginPage () {

  const router = useRouter()

  const handleComplete = () => {
    console.log('Login complete')
    router.push('/')
  }

  return (
    <div className="login-page flex-1 response-grid">
      <div className="w-full flex flex-row items-center justify-center">
        <img src="/balloons.svg" className="w-full h-full max-w-[400px] max-h-[400px]" alt="Welcome" />
      </div>
      <div className="w-full flex flex-row items-center justify-center">
        <div className="w-full max-w-[400px]">
          <h1>Welcome back</h1>
          <p>&nbsp;</p>
          <LoginForm onComplete={handleComplete} />
        </div>
      </div>
    </div>
  )
}