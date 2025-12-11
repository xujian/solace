'use client'

import { useEffect, useState } from 'react'
import Signin from '@modules/account/signin'
import Signup from '@modules/account/signup'
import { useRouter, useSearchParams } from 'next/navigation'

export enum LOGIN_VIEW {
  SIGNIN = 'signin',
  SIGNUP = 'signup'
}

const Auth = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGNIN)
  const router = useRouter()
  const mode = useSearchParams().get('mode')

  useEffect(() => {
    if (mode === 'signin') {
      setCurrentView(LOGIN_VIEW.SIGNIN)
    }
    if (mode === 'signup') {
      setCurrentView(LOGIN_VIEW.SIGNUP)
    }
  }, [mode, router])

  return (
    <div className="flex w-full justify-center">
      {currentView === 'signin' ? (
        <Signin setCurrentView={setCurrentView} />
      ) : (
        <Signup setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default Auth
