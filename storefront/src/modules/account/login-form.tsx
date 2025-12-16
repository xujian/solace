import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Field,
  FieldLabel,
  FieldContent,
  Input,
  Button,
} from '@lib/components/ui'

export default function LoginForm() {
  return (
    <form className="mb-4 flex w-full flex-col gap-y-2">
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
      <Button
        data-testid="sign-in-button"
        className="mt-6 w-full"
        type="submit">
        Sign in
      </Button>
    </form>
  )
}
