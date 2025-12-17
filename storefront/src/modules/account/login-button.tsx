'use client'

import { Button } from '@lib/components/ui'
import { useRouter } from 'next/navigation'

export default function LoginButton () {
  const router = useRouter()
  return (
    <Button type="button" onClick={() => router.push('/login')}>Login</Button> 
  )
}
