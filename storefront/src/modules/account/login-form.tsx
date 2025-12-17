'use client'

import { useActionState } from 'react'
import {
  Field,
  FieldLabel,
  FieldContent,
  Input,
  Button
} from '@lib/components/ui'
import { login } from '@lib/data/customer'
import ErrorMessage from '@modules/checkout/error-message'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [message, action, pending] = useActionState(login, null)
  const router = useRouter()

  const back = () => {
    router.back()
  }

  return (
    <form className="flex w-full flex-col gap-y-2" action={action}>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldContent>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </FieldContent>
      </Field>
      <ErrorMessage error={message} data-testid="login-error-message" />
      <div className='flex gap-2 justify-end items-center my-4'>
        <Button variant="outline" onClick={back} className='flex-1'>Cancel</Button>
        <Button
          isLoading={pending}
          data-testid="sign-in-button"
          className="flex-1"
          type="submit">
          Sign in
        </Button>
      </div>
    </form>
  )
}
