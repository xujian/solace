'use client'

import { useActionState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
      className="flex max-w-[480px] flex-col overflow-hidden"
      data-testid="register-page">
      <CardHeader>
        <h1 className="text-large-semi mb-6 uppercase">
          Become a Medusa Store Member
        </h1>
        <p className="text-neutral">
          Create your Medusa Store Member profile, and get access to an enhanced
          shopping experience.
        </p>
      </CardHeader>
      <CardContent>
        <form className="flex w-full flex-col" action={formAction}>
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="First name"
                required
                autoComplete="given-name"
                data-testid="first-name-input"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Last name"
                required
                autoComplete="family-name"
                data-testid="last-name-input"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                data-testid="email-input"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone"
                autoComplete="tel"
                data-testid="phone-input"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                autoComplete="new-password"
                data-testid="password-input"
              />
            </div>
          </div>
          <ErrorMessage error={message} data-testid="register-error" />

          <span className="text-ui-fg-base text-small-regular mt-6 text-center">
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
          </span>
          <Button
            className="mt-6 w-full"
            data-testid="register-button"
            type="submit"
            isLoading={isPending}>
            Join
          </Button>
        </form>{' '}
      </CardContent>
      <CardFooter className="bg-neutral-700">
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-neutral my-4">Already a member?</p>
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
