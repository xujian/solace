import { useActionState } from 'react'
import { Input, Label } from '@lib/components/ui'
import { login } from '@lib/data/customer'
import { LOGIN_VIEW } from '@modules/account/components/login-signup'
import ErrorMessage from '@modules/checkout/components/error-message'
import { SubmitButton } from '@modules/checkout/components/submit-button'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center justify-center"
      data-testid="login-page">
      <h1 className="text-large-semi mb-6 uppercase">Welcome back</h1>
      <p className="text-base-regular text-ui-fg-base mb-8 text-center">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
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
          <div className="flex flex-col gap-y-1">
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
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="mt-6 w-full">
          Sign in
        </SubmitButton>
      </form>
      <span className="text-ui-fg-base text-small-regular mt-6 text-center">
        Not a member?{' '}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button">
          Join us
        </button>
        .
      </span>
    </div>
  )
}

export default Login
