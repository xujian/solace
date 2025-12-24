'use client'

import { useActionState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Field,
  FieldContent,
  FieldLabel,
  Input,
  Label
} from '@lib/components/ui'
import { signup } from '@lib/data/customer'
import { LOGIN_VIEW } from '@modules/account/auth'
import ErrorMessage from '@modules/checkout/error-message'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Signup = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(signup, null)

  return (
    <Card
      className="flex max-w-[600px] flex-col overflow-hidden"
      data-testid="register-page">
      <CardHeader>
        <h1 className="text-lg font-semibold mb-6 uppercase">
          Become a Medusa Store Member
        </h1>
        <p className="text-muted-foreground">
          Create your Medusa Store Member profile, and get access to an enhanced
          shopping experience.
        </p>
      </CardHeader>
      <CardContent>
        <form className="flex w-full flex-col gap-4" action={formAction}>
          <div className="flex w-full gap-4">
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
            <FieldLabel>Phone</FieldLabel>
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
          <ErrorMessage error={message} data-testid="register-error" />

          <p className="text-muted-foreground mt-6">
            By creating an account, you agree to Medusa Store&apos;s{' '}
            <LocalizedClientLink
              href="/content/privacy-policy"
              className="underline">
              Privacy Policy
            </LocalizedClientLink>{' '}
            and{' '}
            <LocalizedClientLink
              href="/content/terms-of-use"
              className="underline">
              Terms of Use
            </LocalizedClientLink>
            .
          </p>
          <Button
            className="mt-6 w-full"
            data-testid="register-button"
            type="submit"
            isLoading={isPending}>
            Join
          </Button>
        </form>{' '}
      </CardContent>
      <CardFooter className="bg-secondary">
        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-muted-foreground my-4">Already a member?</p>
          <Button
            className="w-full"
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}>
            Sign in
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Signup
