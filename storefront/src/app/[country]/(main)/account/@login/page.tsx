import { Metadata } from 'next'
import LoginSignup from '@modules/account/login-signup'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Medusa Store account.'
}

export default function Login() {
  return <LoginSignup />
}
