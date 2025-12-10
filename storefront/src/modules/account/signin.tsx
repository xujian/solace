import { useActionState } from 'react'
import { Button, CardContent, CardFooter, Input, Label } from '@lib/components/ui'
import { login } from '@lib/data/customer'
import { LOGIN_VIEW } from '@modules/account/auth'
import ErrorMessage from '@modules/checkout/error-message'
import { Card, CardHeader } from '@lib/components/ui'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Signin = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <Card
        className="w-full max-w-[480px] overflow-hidden"
        data-testid="login-page">
        <CardHeader>
          <h1 className="text-2xl uppercase">Welcome back</h1>
          <p className="text-neutral">
            Sign in to access an enhanced shopping experience.
          </p>
        </CardHeader>
        <CardContent>
        <form className="w-full" action={formAction}>
          <div className="flex flex-col gap-y-2 mb-4">
            <Label htmlFor="email">Email</Label>
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
          </div>
          <div className="flex flex-col gap-y-2 mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              data-testid="password-input"
            />
          </div>
          <ErrorMessage error={message} data-testid="login-error-message" />
          <Button
            data-testid="sign-in-button"
            className="mt-6 w-full"
            type="submit"
            isLoading={isPending}>
            Sign in
          </Button>
        </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-2 items-center justify-center bg-neutral-900">
          <p className="text-neutral my-4">
            Don't have an account?
          </p>
          <Button
            className="w-full"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            data-testid="register-button">
            Join us
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signin
