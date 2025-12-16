'use client'

import {
  Dialog,
  DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
  Button
} from '@lib/components/ui'
import { useState } from 'react'
import LoginForm from '@modules/account/login-form'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [ open, setOpen ] = useState(true)

  const handleClose = (value: boolean) => {
    setOpen(value)
    if (!value) {
      router.back()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Login
          </DialogTitle>
        </DialogHeader>
        <LoginForm />
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
