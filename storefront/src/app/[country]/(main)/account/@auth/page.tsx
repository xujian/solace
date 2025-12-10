import { Metadata } from 'next'
import Auth from '@modules/account/auth'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Medusa Store account.'
}

export default function AuthPage() {
  return <Auth />
}
