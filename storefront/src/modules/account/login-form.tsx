'use client'

import { useState } from 'react'
import {
  Field,
  FieldLabel,
  FieldContent,
  Input,
  Button
} from '@lib/components/ui'
import { login } from '@lib/data/customer'
import ErrorMessage from '@modules/checkout/error-message'
import { MakeInteractiveContentProps } from '@arsbreeze/interactive'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export type LoginFormProps = {
}

export default function LoginForm({ onComplete, onAbort }: MakeInteractiveContentProps<LoginFormProps>) {
  const [state, setState] = useState<{ success: boolean, error: string | null }>({ success: false, error: null })
  const [pending, setPending] = useState(false)

  const handleAction = async (formData: FormData) => {
    setPending(true)
    const result = await login(null, formData)
    setState(result)
    setPending(false)
    if (result.success) {
      onComplete?.()
    }
  }

  return (
    <form className="flex w-full flex-col gap-y-2" action={handleAction}>
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
      <ErrorMessage error={state?.error} data-testid="login-error-message" />
      <div className='flex gap-2 justify-end items-center my-4'>
        {onAbort && <Button variant="outline" onClick={onAbort} className='flex-1'>Cancel</Button>}
        <Button
          isLoading={pending}
          data-testid="sign-in-button"
          className="flex-1"
          type="submit">
          Sign in
        </Button>
      </div>

      <div className="mt-4 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <LocalizedClientLink href="/signup" className="text-foreground font-semibold underline">
            Join us
          </LocalizedClientLink>
        </p>
      </div>
    </form>
  )
}
