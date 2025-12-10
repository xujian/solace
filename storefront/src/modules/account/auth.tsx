'use client'

import { useState } from 'react'
import Login from '@modules/account/signin'
import Signup from '@modules/account/signup'

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register'
}

const Auth = () => {
  const [currentView, setCurrentView] = useState('sign-in')

  return (
    <div className="flex w-full justify-center">
      {currentView === 'sign-in' ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Signup setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default Auth
