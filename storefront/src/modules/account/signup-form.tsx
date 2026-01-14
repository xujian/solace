'use client'

import { useState } from 'react'
import {
  Field,
  FieldLabel,
  FieldContent,
  Input,
  Button
} from '@lib/components/ui'
import { signup } from '@lib/data/customer'
import ErrorMessage from '@modules/checkout/error-message'
import { MakeInteractiveContentProps } from '@arsbreeze/interactive'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export type SignupFormProps = {
}

export default function SignupForm({ onComplete, onAbort }: MakeInteractiveContentProps<SignupFormProps>) {
  const [state, setState] = useState<{ success: boolean, error: string | null }>({ success: false, error: null })
  const [pending, setPending] = useState(false)

  const handleAction = async (formData: FormData) => {
    setPending(true)
    const result = await signup(null, formData)
    setState(result)
    setPending(false)
    if (result.success) {
      onComplete?.()
    }
  }

  return (
    <form className="flex w-full flex-col gap-y-4" action={handleAction}>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>First name</FieldLabel>
          <FieldContent>
            <Input
              id="first_name"
              name="first_name"
              placeholder="First name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Last name</FieldLabel>
          <FieldContent>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Last name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            data-testid="email-input"
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Phone (Optional)</FieldLabel>
        <FieldContent>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone"
            autoComplete="tel"
            data-testid="phone-input"
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
            required
            autoComplete="new-password"
            data-testid="password-input"
          />
        </FieldContent>
      </Field>

      <p className="text-muted-foreground text-xs">
        By creating an account, you agree to Solace&apos;s{' '}
        <LocalizedClientLink href="/content/privacy-policy" className="underline">
          Privacy Policy
        </LocalizedClientLink>{' '}
        and{' '}
        <LocalizedClientLink href="/content/terms-of-use" className="underline">
          Terms of Use
        </LocalizedClientLink>
        .
      </p>

      <ErrorMessage error={state?.error} data-testid="register-error" />

      <div className='flex flex-col gap-2 mt-4'>
        <Button
          isLoading={pending}
          data-testid="register-button"
          className="w-full"
          type="submit">
          Join Solace
        </Button>
        {onAbort && (
          <Button type="button" variant="ghost" onClick={onAbort} className='w-full'>Cancel</Button>
        )}
      </div>
    </form>
  )
}
