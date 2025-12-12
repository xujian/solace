import { Button, Card, CardHeader, CardContent } from '@lib/components/ui'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between min-h-[200px] w-full">
      <Card className="w-full">
        <CardContent className="p-4 flex flex-col gap-y-2">
          <h2>Already have an account?</h2>
          <p className="text-neutral">
            Sign in for a better experience.
          </p>
          <p>&nbsp;</p>
          <LocalizedClientLink href="/account">
            <Button
              className="w-full"
              data-testid="sign-in-button">
              Sign in
            </Button>
          </LocalizedClientLink>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPrompt
