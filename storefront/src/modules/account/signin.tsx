import { useActionState } from 'react'
import {
  Button,
  CardContent,
  CardFooter,
  Field,
  FieldContent,
  FieldLabel,
  Input,
  Label
} from '@lib/components/ui'
import { Card, CardHeader } from '@lib/components/ui'
import { login } from '@lib/data/customer'
import { LOGIN_VIEW } from '@modules/account/auth'
import ErrorMessage from '@modules/checkout/error-message'

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
          <form
            className="mb-4 flex w-full flex-col gap-y-2"
            action={formAction}>
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
            <Button
              data-testid="sign-in-button"
              className="mt-6 w-full"
              type="submit"
              isLoading={isPending}>
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-y-2 bg-secondary">
          <p className="text-neutral my-4">Don't have an account?</p>
          <Button
            className="w-full"
            onClick={() => setCurrentView(LOGIN_VIEW.SIGNUP)}
            data-testid="register-button">
            Join us
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signin
