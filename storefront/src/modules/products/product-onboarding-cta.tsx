import { cookies as nextCookies } from 'next/headers'
import { Button } from '@lib/components/ui'

async function ProductOnboardingCta() {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get('_medusa_onboarding')?.value === 'true'

  if (!isOnboarding) {
    return null
  }

  return (
    <div className="bg-ui-bg-subtle border-ui-border-base rounded-rounded h-full w-full max-w-4xl border p-8">
      <div className="center flex flex-col gap-y-4">
        <p className="text-ui-fg-base text-xl">Your demo product was successfully created! 🎉</p>
        <p className="text-ui-fg-subtle text-small-regular">You can now continue setting up your store in the admin.</p>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full">Continue setup in admin</Button>
        </a>
      </div>
    </div>
  )
}

export default ProductOnboardingCta
