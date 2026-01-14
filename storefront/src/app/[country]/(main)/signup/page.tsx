'use client'

import { useRouter } from 'next/navigation'
import SignupForm from '@modules/account/signup-form'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function SignupPage() {
  const router = useRouter()

  const handleComplete = () => {
    console.log('Signup complete')
    router.push('/account')
  }

  return (
    <div className="signup-page response-grid min-h-[calc(100vh-80px)] flex-1 auto-rows-min!">
      <div className="flex w-full flex-row items-center justify-center">
        <img
          src="/join.svg"
          className="h-full max-h-[400px] w-full max-w-[400px] object-contain"
          alt="Join us"
        />
      </div>
      <div className="flex w-full flex-row items-center justify-center p-4 rounded-lg bg-neutral-200 md:bg-none">
        <div className="w-full max-w-[400px]">
          <h1 className="mb-2 text-3xl font-bold">Create an account</h1>
          <p className="mb-8 text-muted-foreground">
            Become a Solace member and get early access to new drops and
            exclusive offers.
          </p>
          <SignupForm onComplete={handleComplete} />
          <div className="mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              Already a member?{' '}
              <LocalizedClientLink
                href="/login"
                className="font-semibold text-foreground underline">
                Sign in
              </LocalizedClientLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
