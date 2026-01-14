'use client'

import {
  Dialog,
  DialogContent, DialogHeader, DialogTitle
} from '@lib/components/ui'
import { useEffect, useState } from 'react'
import LoginForm from '@modules/account/login-form'
import { useRouter } from 'next/navigation'
import { useInteractive } from '@arsbreeze/interactive'

export default function Login() {
  const router = useRouter()
  const $ = useInteractive()

  useEffect(() => {
    $.dialog(LoginForm, {
      onComplete: (): void => {
        console.log('INTERACTIVE MODAL: login onComplete called')
        router.back()
      },
      onAbort: (): void => {
        console.log('INTERACTIVE MODAL: login onAbort called')
        router.back()
      }
    }, {
      title: 'Login'
    })
  }, [])

  return (
    <></>
  )
}
